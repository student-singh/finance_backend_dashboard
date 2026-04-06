const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async function(req, res, next) {
  console.log('protect middleware called');
  console.log('headers:', req.headers.authorization);
  
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded token:', decoded);

    const user = await User.findById(decoded.id);
    console.log('found user:', user ? user.email : 'NOT FOUND');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.log('token error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};

module.exports = { protect };