const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Import models
const Executive = require('../models/Executive');

async function fixPassword() {
  try {
    const email = 'niveditaroy11@gmail.com';
    
    // Find the user
    const user = await Executive.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('🔍 Current user data:');
    console.log('Email:', user.email);
    console.log('Has password:', !!user.password);
    console.log('Password length:', user.password ? user.password.length : 0);
    console.log('Password value:', user.password);
    console.log('Auth method:', user.authMethod);
    
    // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
    if (user.password && user.password.startsWith('$2')) {
      console.log('✅ Password is already properly hashed');
      
      // Test the current password
      const testPassword = 'niveditaroy';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('🔍 Test password "niveditaroy" is valid:', isValid);
      
      if (isValid) {
        console.log('✅ Password is working correctly');
        return;
      }
    } else {
      console.log('❌ Password is not hashed (stored as plain text)');
    }
    
    // Hash the password properly
    const newPassword = 'niveditaroy';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('🔍 New hashed password:', hashedPassword);
    console.log('🔍 Hash starts with $2:', hashedPassword.startsWith('$2'));
    
    // Update the user
    user.password = hashedPassword;
    user.authMethod = 'both';
    
    await user.save();
    
    console.log('✅ Password updated successfully');
    
    // Verify the new password
    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log('🔍 New password verification:', isValid);
    
    // Test login simulation
    const loginTest = await Executive.findOne({ email }).select('+password');
    if (loginTest) {
      const loginValid = await bcrypt.compare(newPassword, loginTest.password);
      console.log('🔍 Login simulation test:', loginValid);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixPassword();
