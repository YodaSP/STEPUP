const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');

// Enhanced JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify Google ID token
const verifyGoogleToken = async (req, res, next) => {
  try {
    console.log('🔍 Google OAuth Debug - Request body:', req.body);
    console.log('🔍 Google OAuth Debug - Request headers:', req.headers);
    console.log('🔍 Google OAuth Debug - GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    
    // Try different possible field names
    const credential = req.body.credential || req.body.idToken || req.body.token;
    
    if (!credential) {
      console.log('❌ Google OAuth Debug - No credential found in request body');
      console.log('❌ Google OAuth Debug - Available fields:', Object.keys(req.body));
      return res.status(400).json({ message: 'Google ID token required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.googleUser = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };

    next();
  } catch (error) {
    console.error('Google token verification error:', error);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
};

// Generate JWT token with enhanced security
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    userType: user.userType, // student, executive, employer
    googleId: user.googleId,
    iat: Math.floor(Date.now() / 1000), // Issued at
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'kaam-backend',
    audience: 'kaam-frontend'
  });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '30d',
    issuer: 'kaam-backend',
    audience: 'kaam-frontend'
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kaam-backend',
      audience: 'kaam-frontend'
    });
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Input validation middleware
const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  
  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  verifyGoogleToken,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  validateAuthInput,
  authLimiter,
};
