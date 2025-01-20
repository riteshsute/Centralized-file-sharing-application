const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('token');
    console.log(token, 'checking the token');

    const decoded = jwt.verify(token, 'jsbdgd89072o83hliebwod8hd');
    console.log(decoded, decoded.userId, 'in auth');

    const user = await User.findById(decoded.userId);
    console.log(user, 'check user');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    console.log(user._id.toString(), 'in auth'); // ObjectId to string
    req.user = user;
    console.log(user._id.toString(), 'user ID as string');
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = authenticate;
