import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useSocketStore } from '../store/socketStore';
import { useAuthStore } from '../store/authStore';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
  const { selectedUser, messages, isTyping } = useChatStore();
  const { sendMessage, emitTyping, emitStopTyping, isUserOnline } = useSocketStore();
  const { user } = useAuthStore();
  const [messageText, setMessageText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = isUserOnline(selectedUser?._id);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsUserTyping(isTyping(selectedUser?._id));
  }, [isTyping, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    sendMessage(selectedUser._id, messageText.trim());
    setMessageText('');
    emitStopTyping(selectedUser._id);
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    if (!selectedUser) return;

    emitTyping(selectedUser._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedUser._id);
    }, 1000);
  };

  if (!selectedUser) return null;

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: selectedUser.avatarColor || '#667eea' }}
            >
              {selectedUser.name?.charAt(0).toUpperCase()}
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
            <p className="text-sm text-gray-500">
              {isUserTyping ? (
                <span className="text-primary-600 flex items-center gap-1">
                  <span className="animate-pulse">typing</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </span>
              ) : isOnline ? (
                'Online'
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voice Call"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Video Call"
          >
            <Video className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id || index}
                message={message}
                isOwn={message.sender === user._id}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].sender !== message.sender
                }
                user={message.sender === user._id ? user : selectedUser}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-t border-gray-200 p-4"
      >
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none outline-none scrollbar-thin"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!messageText.trim()}
              className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatWindow;
