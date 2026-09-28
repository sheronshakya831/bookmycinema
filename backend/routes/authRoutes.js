const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
// 1. IMPORT OUR BOUNCER
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
// 2. USE OUR BOUNCER
// When a GET request hits '/me', Express runs `protect` FIRST.
// If `protect` calls next(), it THEN runs the arrow function (req, res) => {...}
router.get('/me', protect, (req, res) => {
    // Because the `protect` middleware ran and attached the user to req.user,
    // we can simply send that user data back!
    res.status(200).json(req.user);
});
module.exports = router;