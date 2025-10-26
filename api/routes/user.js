const { Router } = require('express');
const { body, validationResult } = require('express-validator'); // Import validation functions
const User = require('../models/user'); //

const router = Router(); //

// --- Validation Rules ---
const signupValidationRules = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required.')
        .escape(),
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        // Example: Add complexity requirement (at least one number, one uppercase, one lowercase)
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
        .withMessage('Password must contain at least one number, one lowercase letter, and one uppercase letter.')
];

const signinValidationRules = [
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return the first error message for simplicity
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};

// --- Routes ---

// GET /api/user/me - Check for logged-in user
router.get('/me', (req, res) => { //
    if (req.user) {
        return res.json(req.user); //
    }
    return res.status(401).json({ error: 'Not authenticated' }); //
});

// POST /api/user/signup
// Add validation middleware here 👇
router.post('/signup', signupValidationRules, handleValidationErrors, async (req, res) => { //
    try {
        const { fullName, email, password } = req.body;
        // Check if user already exists (duplicate check moved here)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const user = await User.create({ //
            fullName,
            email,
            password,
        });
        // Don't send password back
        return res.status(201).json({ _id: user._id, fullName: user.fullName, email: user.email }); //
    } catch (error) {
        // Mongoose validation errors (like unique constraint) might still occur,
        // but express-validator catches most common issues earlier.
        console.error("Error during signup:", error);
        // Duplicate email error (code 11000) might still happen due to race conditions
        if (error.code === 11000) { //
            return res.status(400).json({ error: "Email already registered." }); //
        }
        return res.status(500).json({ error: "An error occurred during registration." }); //
    }
});

// POST /api/user/signin
// Add validation middleware here 👇
router.post('/signin', signinValidationRules, handleValidationErrors, async (req, res) => { //
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password); //

        // Find user details to return (excluding sensitive info)
        const user = await User.findOne({ email }).select('-password -salt'); //

        return res.cookie("token", token, { //
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json(user); // Send user data back to React
    } catch (error) {
        // This catch block now primarily handles errors from matchPasswordAndGenerateToken
        // (i.e., incorrect credentials)
        console.error("Error during signin:", error);
        return res.status(400).json({ error: error.message || "Incorrect email or password" }); //
    }
});

// GET /api/user/logout
router.get('/logout', (req, res) => { //
    return res.clearCookie("token").json({ message: "Logout successful" }); //
});

module.exports = router;