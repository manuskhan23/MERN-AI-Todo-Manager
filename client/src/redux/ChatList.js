import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveChat, renameChat, deleteChat } from '../../redux/aiChatSlice.js';
import { MdEdit, MdDelete } from 'react-icons/md';

const ChatList = ({ chats, activeChat, createNewChat }) => {
  const dispatch = useDispatch();
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingChatId]);

  const handleSetActiveChat = (chatId) => {
    if (editingChatId !== chatId) {
      dispatch(setActiveChat(chatId));
    }
  };

  const handleRename = (chatId) => {
    if (newTitle.trim() && newTitle.trim() !== chats.find(c => c._id === chatId)?.title) {
      dispatch(renameChat({ chatId, title: newTitle.trim() }));
    }
    setEditingChatId(null);
    setNewTitle('');
  };

  const handleStartEditing = (chat) => {
    setEditingChatId(chat._id);
    setNewTitle(chat.title);
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation(); // Prevent setting active chat
    if (window.confirm('Are you sure you want to delete this chat?')) {
      dispatch(deleteChat(chatId));
    }
  };

  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      handleRename(chatId);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
      setNewTitle('');
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={createNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Chat
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-4 cursor-pointer hover:bg-gray-700 ${activeChat === chat._id ? 'bg-gray-900' : ''}`}
            onClick={() => handleSetActiveChat(chat._id)}
            onDoubleClick={() => handleStartEditing(chat)}
          >
            {editingChatId === chat._id ? (
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => handleRename(chat._id)}
                onKeyDown={(e) => handleKeyDown(e, chat._id)}
                className="bg-gray-700 text-white w-full p-1 rounded"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex justify-between items-center">
                <span className="truncate">{chat.title}</span>
                <div className="flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartEditing(chat); }}
                    className="text-gray-400 hover:text-white ml-2 p-1"
                    aria-label="Rename chat"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(chat._id, e)}
                    className="text-gray-400 hover:text-white ml-1 p-1"
                    aria-label="Delete chat"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;