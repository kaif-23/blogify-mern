# Blogify MERN

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js).\

## 🔗 Live Demo
👉 [Checkout website](https://blogify-client-ba6c.onrender.com)

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Rich text editor for content creation
- Responsive design
- User profiles

## Tech Stack

**Frontend:**
- React
- CSS/Styling library

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blogify-mern
```

2. Install dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Run the application
```bash
# Run server and client concurrently
npm run dev

# Or run separately
npm run server
npm run client
```

## Usage

- Navigate to `http://localhost:3000`
- Register/Login to create and manage blog posts
- Browse posts from other users