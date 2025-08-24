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

async function setPassword() {
  try {
    const email = 'niveditaroy11@gmail.com';
    const newPassword = '123456';
    
    console.log('🔍 Setting password for:', email);
    console.log('🔍 New password:', newPassword);
    
    // Find the user
    const user = await Executive.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.fullName);
    console.log('🔍 Current password status:', {
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      authMethod: user.authMethod
    });
    
    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('🔍 New hashed password:', hashedPassword);
    console.log('🔍 Hash starts with $2:', hashedPassword.startsWith('$2'));
    
    // Update the user directly in the database
    const result = await Executive.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Password updated successfully');
      
      // Verify the update
      const updatedUser = await Executive.findOne({ email }).select('+password');
      if (updatedUser) {
        console.log('🔍 Verification - Updated user password status:', {
          hasPassword: !!updatedUser.password,
          passwordLength: updatedUser.password ? updatedUser.password.length : 0,
          authMethod: updatedUser.authMethod
        });
        
        // Test password verification
        const isValid = await bcrypt.compare(newPassword, updatedUser.password);
        console.log('🔍 Password verification test:', isValid);
        
        if (isValid) {
          console.log('🎉 SUCCESS: Password is working correctly!');
          console.log('🔑 You can now login with:');
          console.log('   Email: niveditaroy11@gmail.com');
          console.log('   Password: 123456');
        } else {
          console.log('❌ ERROR: Password verification failed');
        }
      }
    } else {
      console.log('❌ No changes made to the database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

setPassword();
