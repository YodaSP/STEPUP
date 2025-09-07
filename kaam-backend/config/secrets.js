const AWS = require('aws-sdk');

// Initialize AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Cache for secrets to avoid repeated API calls
const secretsCache = new Map();

/**
 * Retrieve secret from AWS Secrets Manager
 * @param {string} secretName - Name of the secret in AWS Secrets Manager
 * @returns {Promise<Object>} Secret value
 */
async function getSecret(secretName) {
  // Check cache first
  if (secretsCache.has(secretName)) {
    return secretsCache.get(secretName);
  }

  try {
    const result = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secret = JSON.parse(result.SecretString);
    
    // Cache the secret
    secretsCache.set(secretName, secret);
    
    return secret;
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}:`, error);
    throw error;
  }
}

/**
 * Get database configuration
 */
async function getDatabaseConfig() {
  const secrets = await getSecret('kaam-backend/database');
  return {
    uri: secrets.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  };
}

/**
 * Get JWT configuration
 */
async function getJWTConfig() {
  const secrets = await getSecret('kaam-backend/jwt');
  return {
    secret: secrets.JWT_SECRET,
    expiresIn: secrets.JWT_EXPIRES_IN || '7d'
  };
}

/**
 * Get Google OAuth configuration
 */
async function getGoogleOAuthConfig() {
  const secrets = await getSecret('kaam-backend/google-oauth');
  return {
    clientId: secrets.GOOGLE_CLIENT_ID,
    clientSecret: secrets.GOOGLE_CLIENT_SECRET
  };
}

module.exports = {
  getSecret,
  getDatabaseConfig,
  getJWTConfig,
  getGoogleOAuthConfig
};
