import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  register: async (email, password, name) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user });
      toast.success('Registration successful! 🎉');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to register';
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user });
      toast.success('Login successful! 🎉');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to login';
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ token: null, user: null });
    }
  },

  updateProfile: async (data) => {
    const token = get().token;
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user });
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
    toast.success('Logged out successfully');
  },
}));
