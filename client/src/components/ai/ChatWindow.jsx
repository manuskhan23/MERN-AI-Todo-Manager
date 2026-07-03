import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, setMessages } from '../../redux/aiChatSlice.js';
import ChatMessage from './ChatMessage.jsx';
import TypingLoader from './TypingLoader.jsx';
import MessageInput from './MessageInput.jsx';
import { useUser } from '@clerk/clerk-react';

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { activeChat, messages, loading } = useSelector(state => state.aiChats);
  const { user } = useUser();
  const endRef = useRef(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessages(activeChat));
    }
  }, [activeChat, dispatch]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  if (!activeChat) return (
    <div className="flex-1 flex items-center justify-center text-secondary text-lg">
      Select or create a new chat to begin
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-card">
      <div className="flex-1 overflow-y-auto p-6 bg-bg">
        {messages.map((msg, i) => <ChatMessage key={i} role={msg.role} content={msg.content} />)}
        {loading && <TypingLoader />}
        <div ref={endRef} />
      </div>
      <MessageInput />
    </div>
  );
}