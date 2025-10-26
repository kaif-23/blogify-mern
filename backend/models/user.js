const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto'); // Removed 'secretkey' as it's not from crypto for hashing
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email addresses are unique
    },
    salt: {
        type: String // Stores the salt used for hashing
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png' // Default profile image
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'], // Defines allowed roles
        default: 'USER'
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Pre-save hook to hash password before saving a new user or updating password
userSchema.pre("save", function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString(); // Generate a random salt
    const hashedPassword = createHmac("sha256", salt) // Hash the password with the salt
        .update(user.password)
        .digest("hex");

    this.salt = salt; // Store the salt
    this.password = hashedPassword; // Store the hashed password
    next();
});

// Static method for password matching and token generation
userSchema.static("matchPasswordAndGenerateToken",
    async function (email, password) {
        const user = await this.findOne({ email });
        if (!user) {
            // Throwing an error here is good for consistent error handling in routes
            throw new Error("User not found or invalid credentials");
        }

        const hashedPassword = createHmac("sha256", user.salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== user.password) {
            // Throwing an error here for incorrect password
            throw new Error("Incorrect email or password");
        }

        // If credentials are correct, create and return a token
        const token = createTokenForUser(user);
        return token;
    });

// Define and export the User model
const User = model("User", userSchema); // Capitalized 'User' for model name
module.exports = User;
