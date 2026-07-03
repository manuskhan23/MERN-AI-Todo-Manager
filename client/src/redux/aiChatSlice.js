import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchChats = createAsyncThunk('ai/fetchChats', async () => {
  const { data } = await api.get('/ai/chats');
  return data;
});

export const createChat = createAsyncThunk('ai/createChat', async () => {
  const { data } = await api.post('/ai/chats');
  return data;
});

export const fetchMessages = createAsyncThunk('ai/fetchMessages', async (chatId) => {
  const { data } = await api.get(`/ai/chats/${chatId}/messages`);
  return data;
});

export const sendMessage = createAsyncThunk('ai/sendMessage', async ({ chatId, content }) => {
  const { data } = await api.post(`/ai/chats/${chatId}/messages`, { content });
  return data;
});

export const deleteChat = createAsyncThunk('ai/deleteChat', async (chatId) => {
  await api.delete(`/ai/chats/${chatId}`);
  return chatId;
});

export const renameChat = createAsyncThunk('ai/renameChat', async ({ chatId, title }) => {
  const { data } = await api.patch(`/ai/chats/${chatId}`, { title });
  return data;
});

const aiChatSlice = createSlice({
  name: 'aiChats',
  initialState: { chats: [], activeChat: null, messages: [], loading: false, chatsLoading: false },
  reducers: {
    setActiveChat: (state, action) => { 
      state.activeChat = action.payload; 
      state.messages = []; 
      // Persist active chat to localStorage
      if (action.payload) {
        localStorage.setItem('activeChatId', action.payload);
      } else {
        localStorage.removeItem('activeChatId');
      }
    },
    restoreActiveChat: (state) => {
      // Restore active chat from localStorage on app load
      const savedChatId = localStorage.getItem('activeChatId');
      if (savedChatId) {
        state.activeChat = savedChatId;
      }
    },
    restoreMessages: (state) => {
      // Restore messages from localStorage on app load for the active chat
      if (state.activeChat) {
        const savedMessages = localStorage.getItem(`chatMessages_${state.activeChat}`);
        if (savedMessages) {
          try {
            state.messages = JSON.parse(savedMessages);
          } catch (e) {
            console.error('Failed to parse saved messages:', e);
          }
        }
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      // Persist messages to localStorage per chat
      if (state.activeChat) {
        localStorage.setItem(`chatMessages_${state.activeChat}`, JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.chatsLoading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => { 
        state.chats = action.payload; 
        state.chatsLoading = false;
      })
      .addCase(fetchChats.rejected, (state) => { state.chatsLoading = false; })
      .addCase(createChat.fulfilled, (state, action) => { state.chats.unshift(action.payload); state.activeChat = action.payload._id; })
      .addCase(fetchMessages.fulfilled, (state, action) => { 
        state.messages = action.payload;
        // Persist messages to localStorage with chat-specific key
        if (state.activeChat) {
          localStorage.setItem(`chatMessages_${state.activeChat}`, JSON.stringify(action.payload));
        }
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.messages.push({ role: 'user', content: action.meta.arg.content });
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // The backend returns an array: [userMessage, aiMessage].
        // The user message was already added optimistically in the pending state.
        // We need to replace the last message (the optimistic one) with the two new ones.
        // However, a simpler and more robust approach is to just push the AI message.
        // The user message from the backend can be ignored since we have it optimistically.
        const [userMessage, aiMessage] = action.payload;
        // Replace the optimistic user message with the one from the server
        state.messages[state.messages.length - 1] = userMessage;
        // Push the new AI message
        state.messages.push(aiMessage);
        state.loading = false;
        // Persist updated messages to localStorage
        if (state.activeChat) {
          localStorage.setItem(`chatMessages_${state.activeChat}`, JSON.stringify(state.messages));
        }
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(c => c._id !== action.payload);
        if (state.activeChat === action.payload) state.activeChat = null;
      })
      .addCase(renameChat.fulfilled, (state, action) => {
        const index = state.chats.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })
  },
});

export const { setActiveChat, restoreActiveChat, restoreMessages, setMessages } = aiChatSlice.actions;
export default aiChatSlice.reducer;
