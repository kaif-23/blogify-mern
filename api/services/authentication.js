const JWT = require('jsonwebtoken');

// IMPORTANT: The secret key should NOT be hardcoded in production.
// It should be loaded from environment variables for security.
// For development, you can use a .env file and a package like `dotenv`.
const secretkey = process.env.JWT_SECRET_KEY || 'super-secret-default-key'; // Fallback for dev

/**
 * Creates a JWT token for a given user payload.
 * @param {object} user - The user object containing _id, email, profileImageURL, and role.
 * @returns {string} The generated JWT token.
 */
function createTokenForUser(user) {
    const payload = {
        _id: user._id, // Use _id from Mongoose document
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload, secretkey, {
        expiresIn: '7d' // Token expires in 7 days (example)
    });
    return token;
}

/**
 * Validates a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to validate.
 * @returns {object|null} The decoded token payload if valid, otherwise null.
 */
function validateToken(token) {
    try {
        const payload = JWT.verify(token, secretkey);
        return payload;
    } catch (error) {
        // Log the error for debugging purposes (e.g., token expired, malformed)
        console.error("Token validation error:", error.message);
        return null; // Return null or throw a specific error depending on desired handling
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};
