const { validateToken } = require('../services/authentication');

/**
 * Middleware to check for an authentication cookie and attach user payload to the request.
 * If no token is found or validation fails, it proceeds to the next middleware/route.
 *
 * @param {string} cookieName - The name of the cookie containing the authentication token.
 * @returns {function} Express middleware function.
 */
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        console.log(`[Auth Middleware] Checking for cookie: ${cookieName}`);
        console.log(`[Auth Middleware] Token cookie value: ${tokenCookieValue ? 'Exists' : 'Does Not Exist'}`);

        // If no token cookie is found, explicitly set req.user to null and proceed.
        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }

        try {
            // Validate the token.
            const userPayload = validateToken(tokenCookieValue);
            // Attach the user payload to req.user if validation is successful.
            req.user = userPayload;
            console.log(`[Auth Middleware] Token validated. User payload:`, req.user);

        } catch (error) {
            // Log the error for debugging purposes.
            console.error(`[Auth Middleware] Authentication cookie validation failed: ${error.message}`);
            // If token is invalid/expired, ensure req.user is null and clear the cookie.
            req.user = null;
            res.clearCookie(cookieName);
        }
        // Always proceed to the next middleware.
        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
