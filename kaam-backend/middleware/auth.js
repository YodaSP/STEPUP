const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType, // student, executive, employer
      googleId: user.googleId,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  authenticateToken,
  verifyGoogleToken,
  generateToken,
};
