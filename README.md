# 🚗 The Car Spa - Belgaum

A professional car and bike detailing service website for The Car Spa located in Guruwar Peth, Belgaum, Karnataka.

## 🌟 Features

### For Customers
- **Service Booking**: Easy online booking for car and bike detailing services
- **Payment Options**: Google Pay, PhonePe, and Cash payment methods
- **File Upload**: Upload car photos and payment screenshots
- **Booking History**: View and manage your bookings
- **Real-time Chat**: Chat with admin for support
- **Reviews System**: Submit and view customer reviews
- **Responsive Design**: Works perfectly on all devices

### For Admins
- **Admin Panel**: Manage all bookings and customer interactions
- **Reviews Management**: Approve/reject customer reviews
- **Real-time Chat**: Respond to customer queries instantly
- **Booking Status**: Update booking status (pending, confirmed, completed, cancelled)
- **File Management**: View uploaded car photos and payment screenshots

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time chat
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Sequelize ORM** with PostgreSQL
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database
- **PostgreSQL** (Supabase)

## 📁 Project Structure

```
Car_spa/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Node.js backend application
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads directory
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Car_spa
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5002
   ```

5. **Database Setup**
   - Set up your PostgreSQL database
   - Update the DATABASE_URL in your .env file
   - The tables will be created automatically when you start the server

6. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```

7. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Create Admin User**
   ```bash
   cd backend
   node createAdmin.js
   ```

## 📱 Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## 🔧 Configuration

### Payment Methods
- **Google Pay UPI ID**: carspa@gpay
- **PhonePe UPI ID**: carspa@phonepe
- **Cash Payment**: Available at the time of service

### Business Hours
- **Monday to Sunday**: 9:00 AM - 7:00 PM

### Location
- **Address**: Guruwar Peth, Belgaum, Karnataka 590003, India
- **Landmark**: Near A K Sports

## 📞 Contact Information

- **Phone**: +91 7411116090, +91 7738956523
- **Email**: info@carspa.com
- **Address**: Guruwar Peth, Belgaum, Karnataka 590003, India

## 🎨 Features Overview

### Home Page
- Hero section with background image
- About us section
- Core values
- Gallery of work
- Founders section
- Customer reviews (randomly displayed)
- User rating system

### Services
- Detailing
- Interior Cleaning
- Car & Bike Polish
- Glass Polish
- Ceramic Coating
- Teflon Coating
- Paint Protection Film (PPF)
- Scratch Removal
- Dent Removal & Paint
- Accessories Installation

### Booking System
- Service selection
- Car/Bike type selection
- Date and time booking
- Payment method selection
- File upload (car photo, payment screenshot)
- Booking confirmation

### Admin Features
- View all bookings
- Update booking status
- Manage customer reviews
- Real-time chat with customers
- View uploaded files

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- File upload validation
- CORS configuration
- Input validation and sanitization

## 📊 Database Schema

### Users Table
- id, name, email, password, isAdmin, timestamps

### Bookings Table
- id, userId, service, carType, date, time, photoUrl, paymentId, paymentMethod, paymentScreenshot, status, cancellationReason, timestamps

### Reviews Table
- id, name, rating, text, isApproved, avatar, timestamps

### Messages Table
- id, senderId, receiverId, content, isAdminMessage, timestamp

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure database connection
3. Install dependencies: `npm install`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React and Vite for the frontend framework
- Node.js and Express for the backend
- Tailwind CSS for styling
- Socket.IO for real-time features
- DiceBear for cartoon avatars
- Unsplash for background images

---

**The Car Spa - Professional Car & Bike Detailing Services in Belgaum** 🚗✨ 