const jwt = require('jsonwebtoken');
const User = require('../models/Staff');

const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  const cookieToken = req.cookies.token;
  const accessToken = token || cookieToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Attach user details to the request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = authMiddleware;
