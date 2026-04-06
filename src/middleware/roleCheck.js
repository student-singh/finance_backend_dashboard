const roleCheck = (...roles) => {
  return function(req, res, next) {
    console.log('roleCheck called');
    console.log('user role:', req.user ? req.user.role : 'NO USER');
    console.log('allowed roles:', roles);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No user found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    
    return next();
  };
};

module.exports = { roleCheck };