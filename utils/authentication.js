const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication failed: No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret'); // Use env variable for JWT_SECRET

    // Fetch user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Authentication failed: User not found' });
    }

    req.user = user; // Attach user object to the request
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed: Invalid token' });
  }
};

module.exports = { authenticate };
