import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const AdminChat = ({ user }) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]); // List of users with messages
  const [currentChatUser, setCurrentChatUser] = useState(null); // User ID for the active chat
  const [messages, setMessages] = useState([]); // Messages for the current chat
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) return; // Only connect if admin is logged in

    const newSocket = io('http://localhost:5002', {
      auth: { token: localStorage.getItem('token') },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to chat server');
      newSocket.emit('getConversations'); // Request list of conversations
    });

    newSocket.on('receiveMessage', (message) => {
      // Only add message if it's for the current conversation or a new one
      setMessages((prevMessages) => {
        // Only add if it's part of the current active conversation
        if (currentChatUser && (message.sender === currentChatUser._id || message.receiver === currentChatUser._id)) {
          return [...prevMessages, message];
        } else if (!currentChatUser && !message.receiver) { // General message to admins
            return [...prevMessages, message]; // This might need a separate 'general chat' view
        }
        return prevMessages; // Don't add if not for current chat
      });
      // Also, update the conversation list to show new message/unread status
      // (This part requires backend logic to track unread messages and update conversation list)
      newSocket.emit('getConversations'); // Refresh conversation list
    });

    newSocket.on('loadConversations', (loadedConversations) => {
      setConversations(loadedConversations);
      setLoadingConversations(false);
    });

    newSocket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
      setLoadingMessages(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Admin disconnected from chat server');
    });

    newSocket.on('connect_error', (err) => {
      setError(`Chat connection error: ${err.message}`);
    });

    return () => newSocket.close();
  }, [user, currentChatUser]); // Reconnect if currentChatUser changes to load new messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectUser = (chatUser) => {
    setCurrentChatUser(chatUser);
    setLoadingMessages(true);
    setError('');
    // Request messages for this specific user
    if (socket) {
      socket.emit('getMessages', { userId: chatUser._id });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket && user && currentChatUser) {
      const messageData = {
        senderId: user._id,
        receiverId: currentChatUser._id,
        isAdminMessage: true,
        content: messageInput,
      };
      socket.emit('sendMessage', messageData);
      setMessageInput('');
    } else if (messageInput.trim() && socket && user && !currentChatUser) {
        // Admin sending a general message (no specific receiver yet)
        const messageData = {
            senderId: user._id,
            isAdminMessage: true,
            content: messageInput,
        };
        socket.emit('sendMessage', messageData);
        setMessageInput('');
    }
  };

  if (!user || !user.isAdmin) {
    return <div className="text-center mt-10 text-red-400">Access denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-10 flex h-[600px]">
      {/* Left Pane: Conversations List */}
      <div className="w-1/3 border-r border-gray-700 pr-4 flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-white">Conversations</h3>
        {loadingConversations ? (
          <p className="text-gray-400">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-400">No active conversations.</p>
        ) : (
          <div className="overflow-y-auto flex-1">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => handleSelectUser(conv)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition ${currentChatUser?._id === conv._id ? 'bg-green-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <p className="font-semibold text-lg">{conv.name || conv.email}</p>
                {/* <p className="text-sm text-gray-400">Last message: {conv.lastMessage || ''}</p> */}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Pane: Chat Window */}
      <div className="w-2/3 pl-4 flex flex-col">
        {currentChatUser ? (
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-4 text-white">Chat with {currentChatUser.name || currentChatUser.email}</h3>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg mb-4 space-y-4">
              {loadingMessages ? (
                <p className="text-gray-400 text-center">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-center">No messages yet. Start a conversation!</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${msg.sender._id === user._id ? 'bg-green-600' : 'bg-gray-700'}
                      ${msg.sender._id === user._id ? 'text-white' : 'text-gray-100'}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs text-right block mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded transition"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg mt-20">Select a conversation from the left pane.</p>
        )}
        {error && <div className="text-red-400 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default AdminChat; 