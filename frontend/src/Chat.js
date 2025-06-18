import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const Chat = ({ user }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return; // Only connect if user is logged in

    // Establish Socket.IO connection
    const newSocket = io('http://localhost:5002', {
        auth: { token: localStorage.getItem('token') } // Pass token for authentication
    }); 
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      // On connection, fetch past messages for this user/admin
      newSocket.emit('getMessages', { userId: user._id, isAdmin: user.isAdmin });
    });

    newSocket.on('receiveMessage', (message) => {
        // The backend populates sender/receiver, so we check _id
      if (
        (message.sender && message.sender._id === user._id) ||
        (message.receiver && message.receiver._id === user._id) ||
        (user.isAdmin && !message.receiver) // Admin receives general user messages (receiver is null)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    newSocket.on('loadMessages', (loadedMessages) => {
        setMessages(loadedMessages);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    newSocket.on('connect_error', (err) => {
        console.error(`Chat connection error: ${err.message}`);
    });

    return () => newSocket.close(); // Clean up on unmount
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket && user) {
      const token = localStorage.getItem('token');
      let decodedUser = null;
      if (token) {
        try {
            decodedUser = jwtDecode(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            // Handle invalid token, e.g., log out user
            return;
        }
      }
      const messageData = {
        senderId: decodedUser ? decodedUser.userId : '',
        isAdminMessage: user.isAdmin, // Set if the sender is an admin
        content: messageInput,
        // For now, simple chat: receiverId can be null, indicating message to general support
        // For direct user-to-admin: receiverId would be admin's ID, or vice versa
      };
      socket.emit('sendMessage', messageData);
      setMessageInput('');
    }
  };

  if (!user) {
    return <div className="text-center mt-10 text-red-400">Please log in to use chat.</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-10 flex flex-col h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">Live Chat</h2>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg mb-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">Start a conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender && msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.sender && msg.sender._id === user._id ? 'bg-green-600' : 'bg-gray-700'}
                ${msg.sender && msg.sender._id === user._id ? 'text-white' : 'text-gray-100'}`}
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
  );
};

export default Chat;