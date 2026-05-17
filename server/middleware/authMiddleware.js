const jwt = require('jsonwebtoken');

// MIDDLEWARE 1: protect
// Checks if request has a valid JWT token
// Like a security guard checking your ID card
exports.protect = (req, res, next) => {
  // Get token from request header
  // Frontend sends: Authorization: Bearer eyJhbGci...
  const token = req.headers.authorization?.split(' ')[1];

  // If no token found — reject the request
  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please login first.' });
  }

  try {
    // Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request so controllers can use it
    req.user = decoded; // { userId, role }
    
    next(); // Allow request to continue to the controller
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

// MIDDLEWARE 2: authorize
// Checks if user has the required role
// Like checking if your ID card allows access to this room
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    next();
  };
};