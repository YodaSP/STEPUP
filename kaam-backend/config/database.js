const mongoose = require('mongoose');

/**
 * Database configuration for production
 */
class DatabaseConfig {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB with production optimizations
   */
  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI;
      
      if (!mongoURI) {
        throw new Error('MONGODB_URI environment variable is required');
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
        retryWrites: true,
        w: 'majority',
        readPreference: 'secondaryPreferred', // Read from secondary if available
      };

      this.connection = await mongoose.connect(mongoURI, options);
      this.isConnected = true;
      
      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event listeners
      this.setupEventListeners();
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Set up database event listeners
   */
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  /**
   * Graceful shutdown
   */
  async gracefulShutdown() {
    console.log('Received termination signal. Closing MongoDB connection...');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  /**
   * Health check for load balancer
   */
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'unhealthy', message: 'Not connected to database' };
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      
      return { 
        status: 'healthy', 
        message: 'Database connection is healthy',
        ...this.getConnectionStatus()
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: 'Database health check failed',
        error: error.message 
      };
    }
  }
}

module.exports = new DatabaseConfig();
