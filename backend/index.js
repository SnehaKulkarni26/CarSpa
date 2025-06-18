// eslint-disable-next-line
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Server from socket.io
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const reviewRoutes = require('./routes/reviews');
const Message = require('./models/Message'); // Import Message model
const jwt = require('jsonwebtoken'); // Import jwt
const User = require('./models/User'); // Import User model
const sequelize = require('./config/database'); // Import Sequelize instance

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { // Initialize Socket.IO server
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow connections from your React frontend (both 3000 and 3001)
    methods: ['GET', 'POST'],
    credentials: true, // Allow cookies/auth headers
  },
});

const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Sync database and create tables
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
}).catch((err) => {
  console.error('Database sync error:', err);
  console.log('Server will start without database connection');
});

app.use('/api/auth', authRoutes);

app.use('/api/booking', bookingRoutes);

app.use('/api/reviews', reviewRoutes);

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Authenticate socket connection using JWT
  let user = null;
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findByPk(decoded.userId);
      if (user) {
        socket.userId = user.id;
        socket.isAdmin = user.isAdmin;
        socket.join(user.id.toString());
        if (user.isAdmin) {
          socket.join('admins');
        }
        console.log(`Socket ${socket.id} authenticated as ${user.email} (Admin: ${user.isAdmin})`);
      } else {
        console.log('Socket authentication failed: User not found');
        socket.disconnect(true);
      }
    } catch (err) {
      console.log('Socket authentication failed: Invalid token', err.message);
      socket.disconnect(true);
    }
  }

  // Admin: Get list of users with whom there are conversations
  socket.on('getConversations', async () => {
    if (!socket.isAdmin) return; // Only for admins
    try {
      const usersWithMessages = await Message.findAll({
        where: { receiverId: null },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['timestamp', 'DESC']],
        group: ['Message.id', 'sender.id']
      });
      
      const conversations = usersWithMessages.map(msg => ({
        _id: msg.sender.id,
        name: msg.sender.name,
        email: msg.sender.email,
        lastMessage: msg.content,
        lastTimestamp: msg.timestamp
      }));
      
      socket.emit('loadConversations', conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
    }
  });

  // Handle fetching historical messages for a specific chat or general admin chat
  socket.on('getMessages', async (data) => {
    if (!socket.userId) return; // Must be authenticated

    try {
      let messages;
      const targetUserId = data.userId; // This is the user an admin is chatting with

      if (socket.isAdmin) {
        if (targetUserId) {
          // Admin getting messages for a specific user
          messages = await Message.findAll({
            where: {
              $or: [
                { senderId: targetUserId, receiverId: null, isAdminMessage: false },
                { senderId: targetUserId, receiverId: socket.userId, isAdminMessage: false },
                { senderId: socket.userId, receiverId: targetUserId, isAdminMessage: true }
              ]
            },
            include: [
              { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
              { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
            ],
            order: [['timestamp', 'ASC']]
          });
        } else {
          // Admin getting all general user-to-admin messages
          messages = await Message.findAll({
            where: { receiverId: null, isAdminMessage: false },
            include: [
              { model: User, as: 'sender', attributes: ['id', 'name', 'email'] }
            ],
            order: [['timestamp', 'ASC']]
          });
        }
      } else {
        // User getting their own messages
        messages = await Message.findAll({
          where: {
            $or: [
              { senderId: socket.userId },
              { receiverId: socket.userId },
              { receiverId: null, isAdminMessage: true }
            ]
          },
          include: [
            { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
            { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
          ],
          order: [['timestamp', 'ASC']]
        });
      }

      socket.emit('loadMessages', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    if (!socket.userId) return; // Must be authenticated to send message

    try {
      const newMessage = await Message.create({
        senderId: socket.userId,
        receiverId: data.receiverId || null,
        isAdminMessage: socket.isAdmin,
        content: data.content,
      });

      // Load the message with user details
      const messageWithUser = await Message.findByPk(newMessage.id, {
        include: [
          { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] }
        ]
      });

      // Emit message to sender
      socket.emit('receiveMessage', messageWithUser);

      // Emit message to appropriate rooms/users
      if (socket.isAdmin) {
        if (data.receiverId) {
          // Admin sending to a specific user
          io.to(data.receiverId).emit('receiveMessage', messageWithUser);
        } else {
          // Admin sending a general message
          io.to('admins').emit('receiveMessage', messageWithUser);
        }
      } else {
        // User sending to admin(s)
        io.to('admins').emit('receiveMessage', messageWithUser);
      }
      console.log('Message saved and emitted:', messageWithUser);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('The Car Spa backend is running!');
});

// Start server regardless of database connection
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 