import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, createChat, setActiveChat, deleteChat } from '../../redux/aiChatSlice.js';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function ChatSidebar() {
  const dispatch = useDispatch();
  const { chats, activeChat, chatsLoading } = useSelector(state => state.aiChats);

  useEffect(() => { 
    dispatch(fetchChats()); 
  }, []);

  // Auto-select first chat if none is selected and chats are loaded
  useEffect(() => {
    if (!activeChat && !chatsLoading && chats.length > 0) {
      dispatch(setActiveChat(chats[0]._id));
    }
  }, [chats, activeChat, chatsLoading, dispatch]);

  return (
    <div className="w-64 bg-card border-r border-light h-full flex flex-col">
      <div className="p-4 border-b border-light">
        <button onClick={() => dispatch(createChat())} className="w-full bg-primary text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-primary-hover">
          <FaPlus /> New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat._id} 
            onClick={() => dispatch(setActiveChat(chat._id))}
            className={`p-3 cursor-pointer flex justify-between items-center hover:bg-bg ${activeChat === chat._id ? 'bg-bg border-l-4 border-primary' : ''}`}
          >
            <span className="text-sm text-dark truncate">{chat.title}</span>
            <button onClick={(e) => { e.stopPropagation(); dispatch(deleteChat(chat._id)); }} className="text-secondary hover:text-red-500">
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}