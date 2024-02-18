const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware for JWT token validation
const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
    console.log(token);
    
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }
  console.log(process.env.JWT_SECRET_KEY);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
        console.error('Token verification failed:', { algorithm: 'HS256'}, err.message);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    // Attach decoded data to the request for later use
    req.user = decoded;
    next();
  });
};

module.exports = jwtMiddleware;