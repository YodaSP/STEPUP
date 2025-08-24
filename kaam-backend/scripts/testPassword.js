const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Executive = require('../models/Executive');

const testPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/kaam_db');
    console.log('Connected to MongoDB');

    const email = 'niveditaroy11@gmail.com';
    const testPassword = '123456';
    
    // ---- Find Student or Executive ----
    // Uncomment the one you want to test
    
    // const user = await Student.findOne({ email });
    const user = await Executive.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ Found user:', user.fullName);
    console.log('✅ User has password:', !!user.password);
    console.log('✅ User authMethod:', user.authMethod);

    if (!user.password) {
      console.log('⚠️ This user has no password set in DB.');
      return;
    }

    // Test password comparison
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    console.log('🔍 Password comparison result:', isValidPassword);
    
    // Test with wrong password
    const isWrongPassword = await bcrypt.compare('wrongpassword', user.password);
    console.log('🔍 Wrong password test:', isWrongPassword);
    
    // Show the hashed password (first 20 chars)
    console.log('🔍 Hashed password (first 20 chars):', user.password.substring(0, 20) + '...');

  } catch (error) {
    console.error('Error testing password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
testPassword();
