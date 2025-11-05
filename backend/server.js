require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import CORS

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogPage';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

// Middleware
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
    origin: [clientURL, 'http://localhost:3000'], // Allow production and dev
    credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

// Serve static files (for blog cover images)
// This path is now relative to the 'api' folder
app.use(express.static(path.resolve('./public')));

// API Routes
app.get('/', (req, res) => {
    res.json({ message: 'Blogify API is running!' });
});

app.use("/api/user", userRoute); // Prefixed with /api
app.use("/api/blog", blogRoute); // Prefixed with /api

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
});