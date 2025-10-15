import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useSocketStore } from '../store/socketStore';
import { useChatStore } from '../store/chatStore';

const UserListItem = ({ user, lastMessage, unreadCount, onClick }) => {
  const { isUserOnline } = useSocketStore();
  const { selectedUser } = useChatStore();
  const isOnline = isUserOnline(user._id);
  const isSelected = selectedUser?._id === user._id;

  return (
    <motion.div
      whileHover={{ backgroundColor: '#f9fafb' }}
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-primary-50 border-l-4 border-primary-500' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: user.avatarColor || '#667eea' }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
            {lastMessage && (
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(lastMessage.timestamp), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">
              {lastMessage ? lastMessage.message : user.email}
            </p>
            {unreadCount > 0 && (
              <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserListItem;
