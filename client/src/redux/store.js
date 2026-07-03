import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import todoReducer from './todoSlice.js';
import sectionReducer from './sectionSlice.js';
import aiChatReducer from './aiChatSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    sections: sectionReducer,
    aiChats: aiChatReducer,
  },
});