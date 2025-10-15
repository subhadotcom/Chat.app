import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  connected: false,

  connect: (token) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      set({ connected: true });
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      set({ connected: false });
    });

    socket.on('online-users', (users) => {
      set({ onlineUsers: users });
    });

    socket.on('user-online', ({ userId }) => {
      const onlineUsers = get().onlineUsers;
      if (!onlineUsers.includes(userId)) {
        set({ onlineUsers: [...onlineUsers, userId] });
      }
    });

    socket.on('user-offline', ({ userId }) => {
      const onlineUsers = get().onlineUsers;
      set({ onlineUsers: onlineUsers.filter((id) => id !== userId) });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Retrying...');
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false, onlineUsers: [] });
    }
  },

  sendMessage: (receiverId, message) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('send-message', {
        receiverId,
        message,
        timestamp: new Date(),
      });
    }
  },

  emitTyping: (receiverId) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('typing', { receiverId });
    }
  },

  emitStopTyping: (receiverId) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('stop-typing', { receiverId });
    }
  },

  markMessagesRead: (messageIds) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('mark-read', { messageIds });
    }
  },

  isUserOnline: (userId) => {
    return get().onlineUsers.includes(userId);
  },
}));
