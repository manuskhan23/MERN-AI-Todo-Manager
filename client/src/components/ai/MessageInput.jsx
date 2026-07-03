import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/aiChatSlice.js';
import { FaPaperPlane } from 'react-icons/fa';

export default function MessageInput() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { activeChat } = useSelector(state => state.aiChats);

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;
    dispatch(sendMessage({ chatId: activeChat, content: text }));
    setText('');
  };

  return (
    <div className="p-4 border-t border-light bg-card flex gap-2">
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
        rows={1}
        placeholder="Message AI Assistant... (Enter to send, Shift+Enter for new line)"
        className="flex-1 p-3 border border-light rounded-lg resize-none focus:outline-none focus:border-primary"
      />
      <button onClick={handleSend} className="bg-primary text-white p-3 rounded-lg hover:bg-primary-hover flex items-center">
        <FaPaperPlane />
      </button>
    </div>
  );
}