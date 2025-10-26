const { Router } = require('express');
const User = require('../models/user');

const router = Router();

// GET /api/user/me - Check for logged-in user
router.get('/me', (req, res) => {
    if (req.user) {
        return res.json(req.user);
    }
    return res.status(401).json({ error: 'Not authenticated' });
});

// POST /api/user/signup
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const user = await User.create({
            fullName,
            email,
            password,
        });
        // Don't send password back
        return res.status(201).json({ _id: user._id, fullName: user.fullName, email: user.email });
    } catch (error) {
        console.error("Error during signup:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already registered." });
        }
        return res.status(500).json({ error: "An error occurred during registration." });
    }
});

// POST /api/user/signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // Find user details to return (excluding sensitive info)
        const user = await User.findOne({ email }).select('-password -salt');

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json(user); // Send user data back to React
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(400).json({ error: error.message || "Incorrect email or password" });
    }
});

// GET /api/user/logout
router.get('/logout', (req, res) => {
    return res.clearCookie("token").json({ message: "Logout successful" });
});

module.exports = router;