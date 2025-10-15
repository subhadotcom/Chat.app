import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useChatStore = create((set, get) => ({
  users: [],
  conversations: [],
  selectedUser: null,
  messages: [],
  typingUsers: new Set(),
  loading: false,

  fetchUsers: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: response.data.users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  fetchConversations: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ conversations: response.data.conversations });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  },

  selectUser: async (user, token) => {
    set({ selectedUser: user, loading: true });
    try {
      const response = await axios.get(
        `${API_URL}/messages/conversation/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ messages: response.data.messages });
      
      // Mark messages as read
      await axios.put(
        `${API_URL}/messages/mark-read/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      set({ loading: false });
    }
  },

  addMessage: (message) => {
    const messages = get().messages;
    const selectedUser = get().selectedUser;
    
    // Only add if it's part of the current conversation
    if (
      selectedUser &&
      (message.sender === selectedUser._id || message.receiver === selectedUser._id)
    ) {
      set({ messages: [...messages, message] });
    }

    // Update conversations list
    get().updateConversationsList(message);
  },

  updateConversationsList: (message) => {
    const conversations = get().conversations;
    const otherUserId = message.sender === message.receiver ? message.sender : 
                        (conversations.find(c => c.userId === message.sender) ? message.sender : message.receiver);
    
    const existingConvIndex = conversations.findIndex(
      (c) => c.userId === otherUserId
    );

    if (existingConvIndex !== -1) {
      const updatedConversations = [...conversations];
      updatedConversations[existingConvIndex] = {
        ...updatedConversations[existingConvIndex],
        lastMessage: {
          message: message.message,
          timestamp: message.timestamp,
          sender: message.sender,
        },
      };
      // Move to top
      const [conv] = updatedConversations.splice(existingConvIndex, 1);
      updatedConversations.unshift(conv);
      set({ conversations: updatedConversations });
    }
  },

  setTyping: (userId, isTyping) => {
    const typingUsers = new Set(get().typingUsers);
    if (isTyping) {
      typingUsers.add(userId);
    } else {
      typingUsers.delete(userId);
    }
    set({ typingUsers });
  },

  isTyping: (userId) => {
    return get().typingUsers.has(userId);
  },

  searchUsers: async (query, token) => {
    if (!query.trim()) {
      return get().users;
    }
    
    try {
      const response = await axios.get(`${API_URL}/users/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.users;
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  },
}));
