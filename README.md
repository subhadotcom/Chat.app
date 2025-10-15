# 💬 Modern Chat Application

A full-stack real-time chat application with OTP-based email authentication, built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

![Chat App](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen) ![Socket.io](https://img.shields.io/badge/Socket.io-4.6-black)

## ✨ Features

### 🔐 Authentication
- **OTP-based Email Authentication** - Secure passwordless login
- **JWT Token Management** - Persistent sessions
- **Email Verification** - 6-digit OTP sent via email
- **Auto-expiring OTPs** - 10-minute validity

### 💬 Real-time Messaging
- **Instant Message Delivery** - Socket.io powered real-time communication
- **Online Status Indicators** - See who's online in real-time
- **Typing Indicators** - Know when someone is typing
- **Message Read Receipts** - Double-check marks for read messages
- **Message History** - Persistent chat storage in MongoDB

### 🎨 Modern UI/UX
- **Beautiful Gradient Design** - Eye-catching color schemes
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Works on all screen sizes
- **TailwindCSS Styling** - Modern, utility-first CSS
- **Custom Scrollbars** - Sleek, minimal scrollbar design
- **Avatar Colors** - Unique color for each user

### 👥 User Management
- **User Search** - Find users by name or email
- **Conversation List** - See all your active chats
- **User Profiles** - View and edit your profile
- **Bio Support** - Add a personal bio
- **Last Seen Status** - Track user activity

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **Nodemailer** - Email sending
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing (future use)
- **express-validator** - Input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**
- **Email account** (Gmail recommended for SMTP)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Chat.app
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install all dependencies (root, server, and client):
```bash
npm run install-all
```

Or install individually:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

#### Server Configuration
Create `server/.env` file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=Chat App <your_email@gmail.com>

# OTP Configuration
OTP_EXPIRY_MINUTES=10
```

#### Client Configuration
Create `client/.env` file:
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Gmail SMTP Setup (Recommended)

To use Gmail for sending OTP emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password
3. Use this password in `EMAIL_PASSWORD` in your `.env` file

### 5. Start MongoDB

Make sure MongoDB is running:
```bash
# Windows
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 6. Run the Application

#### Development Mode (Recommended)
Run both server and client concurrently from the root directory:
```bash
npm run dev
```

#### Run Separately
Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 Usage Guide

### First Time Setup

1. **Open the Application**
   - Navigate to http://localhost:5173

2. **Sign Up / Login**
   - Enter your name and email address
   - Click "Send OTP"
   - Check your email for the 6-digit code
   - Enter the OTP and click "Verify & Login"

3. **Start Chatting**
   - Browse users in the "Users" tab
   - Click on a user to start a conversation
   - Type your message and press Enter or click Send

### Features Walkthrough

#### 🔍 Search Users
- Click on the "Users" tab
- Use the search bar to find users by name or email
- Click on any user to start chatting

#### 💬 Send Messages
- Select a user from the list
- Type your message in the input field
- Press Enter or click the Send button
- Messages are delivered instantly if the user is online

#### 👁️ Online Status
- Green dot indicates user is online
- Gray dot indicates user is offline
- Real-time updates when users come online/offline

#### ✍️ Typing Indicators
- See "typing..." when the other person is typing
- Animated dots show active typing
- Automatically disappears after 1 second of inactivity

#### ✅ Read Receipts
- Single check mark: Message sent
- Double check mark (blue): Message read

#### 👤 Profile Management
- Click on your avatar in the top-left
- Edit your name and bio
- Changes are saved instantly

## 🏗️ Project Structure

```
Chat.app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UserListItem.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── AuthPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── store/         # Zustand state management
│   │   │   ├── authStore.js
│   │   │   ├── chatStore.js
│   │   │   └── socketStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── OTP.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── utils/            # Utility functions
│   │   └── email.js
│   ├── index.js          # Server entry point
│   └── package.json
│
├── package.json          # Root package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP for email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:userId` - Get user by ID (requires auth)
- `GET /api/users/search/:query` - Search users (requires auth)

### Messages
- `GET /api/messages/conversations` - Get all conversations (requires auth)
- `GET /api/messages/conversation/:userId` - Get conversation with user (requires auth)
- `PUT /api/messages/mark-read/:userId` - Mark messages as read (requires auth)
- `DELETE /api/messages/:messageId` - Delete message (requires auth)

### Socket.io Events

#### Client → Server
- `send-message` - Send a new message
- `typing` - Notify typing status
- `stop-typing` - Stop typing notification
- `mark-read` - Mark messages as read

#### Server → Client
- `receive-message` - Receive new message
- `message-sent` - Confirmation of sent message
- `user-online` - User came online
- `user-offline` - User went offline
- `online-users` - List of online users
- `user-typing` - User is typing
- `user-stop-typing` - User stopped typing

## 🎨 Customization

### Change Color Scheme
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#667eea', // Change this
    // ... other shades
  },
  secondary: {
    500: '#764ba2', // Change this
  }
}
```

### Modify Avatar Colors
Edit `server/models/User.js`:
```javascript
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', // Add or modify colors
  // ...
];
```

### Change OTP Expiry Time
Edit `server/.env`:
```env
OTP_EXPIRY_MINUTES=10  # Change to desired minutes
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
mongod
```

### Email Not Sending
**Solution**: 
1. Check your email credentials in `server/.env`
2. For Gmail, ensure you're using an App Password, not your regular password
3. Check if 2FA is enabled on your Google account

### Socket Connection Failed
**Solution**:
1. Check if the server is running on port 5000
2. Verify `VITE_SOCKET_URL` in `client/.env`
3. Check browser console for CORS errors

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using the port or change the port in `server/.env`

## 🔒 Security Considerations

### Production Deployment
1. **Change JWT Secret**: Use a strong, random secret
2. **Enable HTTPS**: Use SSL certificates
3. **Environment Variables**: Never commit `.env` files
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Input Validation**: Already implemented with express-validator
6. **MongoDB Security**: Use authentication and restrict access
7. **CORS Configuration**: Restrict to your domain only

## 📈 Future Enhancements

- [ ] File and image sharing
- [ ] Voice and video calls
- [ ] Group chats
- [ ] Message reactions (emojis)
- [ ] Message editing and deletion
- [ ] Push notifications
- [ ] Dark mode
- [ ] Message search
- [ ] User blocking
- [ ] End-to-end encryption

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- React team for the amazing library
- Socket.io for real-time capabilities
- TailwindCSS for the utility-first CSS framework
- Framer Motion for smooth animations
- All open-source contributors

---

**Happy Chatting! 💬✨**
