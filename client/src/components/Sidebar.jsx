import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, LogOut, User, MessageCircle, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useSocketStore } from '../store/socketStore';
import UserListItem from './UserListItem';

const Sidebar = ({ onProfileClick }) => {
  const { user, logout, token } = useAuthStore();
  const { users, conversations, selectUser, searchUsers } = useChatStore();
  const { connected } = useSocketStore();
  const [activeTab, setActiveTab] = useState('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim() && activeTab === 'users') {
        const results = await searchUsers(searchQuery, token);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, activeTab, token]);

  const displayUsers = searchQuery.trim() && activeTab === 'users' 
    ? searchResults 
    : users;

  const handleUserSelect = (selectedUser) => {
    selectUser(selectedUser, token);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg cursor-pointer"
                style={{ backgroundColor: user?.avatarColor || '#667eea' }}
                onClick={onProfileClick}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  connected ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></div>
            </div>
            <div className="text-white">
              <h2 className="font-semibold">{user?.name}</h2>
              <p className="text-xs text-white/80">
                {connected ? 'Online' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/90 border-0 rounded-lg text-sm focus:ring-2 focus:ring-white/50 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'conversations'
              ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
      </div>

      {/* User/Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'conversations' ? (
          conversations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <UserListItem
                  key={conv.userId}
                  user={conv.user}
                  lastMessage={conv.lastMessage}
                  unreadCount={conv.unreadCount}
                  onClick={() => handleUserSelect(conv.user)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
              <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start chatting with someone!</p>
            </div>
          )
        ) : (
          <div className="divide-y divide-gray-100">
            {displayUsers.map((u) => (
              <UserListItem
                key={u._id}
                user={u}
                onClick={() => handleUserSelect(u)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
