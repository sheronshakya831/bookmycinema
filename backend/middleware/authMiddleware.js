const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// ==========================================
// 1. THE PROTECT MIDDLEWARE (Check for Wristband)
// ==========================================
// Notice it takes 3 arguments: req, res, and next!
const protect = async (req, res, next) => {
    let token;
    // 1. Look at the request headers. Do they have an 'authorization' header?
    // And does it start with the word 'Bearer'?
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token.
            // req.headers.authorization looks like: "Bearer eyJhbGciOiJIUzI1..."
            // We use .split(' ') to cut it into an array: ["Bearer","eyJhbGciOiJIUzI1..."]
            // We take index [1], which is just the token string.
            token = req.headers.authorization.split(' ')[1];
            // 3. Verify the token signature
            // jwt.verify takes the token and our secret key.
            // If valid, it decodes the payload (which contains the user's ID
            // we saved yesterday).
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Example of decoded: { id: "64a7c8f9...", iat: 1688..., exp: 1691... }
            // 4. Find the user in the database
            // We use the ID from the decoded token to find the real user.
            // .select('-password') tells MongoDB: "Give me the user, but leave out
            // the password field!" We don't want passwords floating around in memory.
            req.user = await User.findById(decoded.id).select('-password');
            // 5. Success!
            // By attaching `req.user`, ANY controller that runs after this middleware
            // will know exactly who is logged in!
            // We call next() to tell Express to move to the next function (the Controller).
            next();
        } catch (error) {
            console.error(error);
            // If the token is expired or tampered with, jwt.verify throws an error.
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    // If there was no token attached to the headers at all:
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// ==========================================
// 2. THE ADMIN MIDDLEWARE (Check if VIP is an Admin)
// ==========================================
const admin = (req, res, next) => {
    // We check if req.user exists (meaning the 'protect' middleware already passed them)
    // AND we check if req.user.isAdmin is true.
    if (req.user && req.user.isAdmin) {
        next(); // They are an admin, let them pass
    } else {
        // 403 Forbidden means "I know who you are, but you don't have permission."
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
module.exports = { protect, admin };