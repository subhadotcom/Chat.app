require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const { authenticateSocket } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Socket.io connection handling
const onlineUsers = new Map(); // userId -> socketId

io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);
  
  // Broadcast online status to all users
  io.emit('user-online', { userId: socket.userId });
  
  // Send current online users to the newly connected user
  socket.emit('online-users', Array.from(onlineUsers.keys()));

  // Join user's personal room
  socket.join(socket.userId);

  // Handle private messages
  socket.on('send-message', async (data) => {
    try {
      const { receiverId, message, timestamp } = data;
      const Message = require('./models/Message');
      
      // Save message to database
      const newMessage = new Message({
        sender: socket.userId,
        receiver: receiverId,
        message,
        timestamp: timestamp || new Date()
      });
      
      await newMessage.save();

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', {
          _id: newMessage._id,
          sender: socket.userId,
          receiver: receiverId,
          message,
          timestamp: newMessage.timestamp,
          read: false
        });
      }

      // Send confirmation back to sender
      socket.emit('message-sent', {
        _id: newMessage._id,
        sender: socket.userId,
        receiver: receiverId,
        message,
        timestamp: newMessage.timestamp,
        read: false
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', { userId: socket.userId });
    }
  });

  socket.on('stop-typing', (data) => {
    const { receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-stop-typing', { userId: socket.userId });
    }
  });

  // Handle message read status
  socket.on('mark-read', async (data) => {
    try {
      const { messageIds } = data;
      const Message = require('./models/Message');
      
      await Message.updateMany(
        { _id: { $in: messageIds }, receiver: socket.userId },
        { read: true }
      );

      socket.emit('messages-marked-read', { messageIds });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    onlineUsers.delete(socket.userId);
    io.emit('user-offline', { userId: socket.userId });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
