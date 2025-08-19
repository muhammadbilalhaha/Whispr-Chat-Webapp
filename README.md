# Whispr – Chat Web Application

Whispr is a real-time chat application built with a focus on simplicity, speed, and usability.  
It’s designed to give you the essential features of a modern chat app — sending messages, image sharing, unread indicators, friend management, and admin tools — without unnecessary complexity.  

---

## Key Features

- Real-time messaging powered by Socket.IO  
- Unread message counters (similar to WhatsApp)  
- Friend management: add, remove, and permanently delete conversations  
- Image message support (stored via Cloudinary)  
- Authentication with JWT cookies (secure, httpOnly)  
- Admin dashboard with user management (roles, block/unblock, delete)  
- Responsive UI written purely in Tailwind CSS (no UI libraries)  
- State management with Zustand for auth, friends, messages, and unread badges  

---

## Tech Stack

**Frontend**
- React (JSX)
- Tailwind CSS
- Zustand (state management)
- Socket.IO client  

**Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- Socket.IO server  
- Cloudinary (image uploads)  
- JWT authentication  

## Environment Variables

Create a `.env` file in the root of your backend with the following variables:

```env
# Server
PORT=5005
DB_URI=mongodb://localhost:27017/Chatapp

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=3days
COOKIE_EXPIRE=5
NODE_ENV=development

# Password Reset
RESET_PASSWORD_EXPIRE=10
RESET_PASSWORD_URL=http://localhost:5173/userResetPassword/
RP_SERVICE=gmail
RP_USER_MAIL=your_email@gmail.com
RP_USER_PASSWORD=your_app_password_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALL_BACK_URL=http://localhost:5005/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

