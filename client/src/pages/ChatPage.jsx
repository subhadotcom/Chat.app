import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import UserProfile from '../components/UserProfile';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useSocketStore } from '../store/socketStore';

const ChatPage = () => {
  const { token, user } = useAuthStore();
  const { fetchUsers, fetchConversations, selectedUser, addMessage, setTyping } = useChatStore();
  const { socket } = useSocketStore();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
      fetchConversations(token);
    }
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      addMessage(message);
    };

    const handleMessageSent = (message) => {
      addMessage(message);
    };

    const handleUserTyping = ({ userId }) => {
      setTyping(userId, true);
      setTimeout(() => setTyping(userId, false), 3000);
    };

    const handleUserStopTyping = ({ userId }) => {
      setTyping(userId, false);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
    };
  }, [socket, addMessage, setTyping]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar onProfileClick={() => setShowProfile(true)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6 shadow-lg"
              >
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, {user?.name}! 👋
              </h2>
              <p className="text-gray-600">
                Select a conversation to start chatting
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
