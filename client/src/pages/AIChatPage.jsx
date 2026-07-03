import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import ChatSidebar from '../components/ai/ChatSidebar.jsx';
import ChatWindow from '../components/ai/ChatWindow.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import { restoreActiveChat, restoreMessages } from '../redux/aiChatSlice.js';

export default function AIChatPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getToken();

        if (token) {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Token error:', error);
      }
    };

    if (isLoaded) {
      setToken();
      // Restore the previously active chat and messages from localStorage
      dispatch(restoreActiveChat());
      dispatch(restoreMessages());
    }
  }, [isLoaded, getToken, dispatch]);

  return (
    <div className="h-screen flex flex-col bg-bg">
      <Navbar />

      <header className="bg-card p-4 border-b border-light flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
}