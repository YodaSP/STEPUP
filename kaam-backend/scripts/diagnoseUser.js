const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const diagnoseUser = async () => {
  try {
    // Connect to MongoDB Atlas (same as server)
    const mongoURI = "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas');

    const email = 'shivampandeyaps@gmail.com';
    
    // Find the user and show all fields
    const student = await Student.findOne({ email });
    if (!student) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('=== USER DIAGNOSTIC REPORT ===');
    console.log('✅ User found:', student.fullName);
    console.log('📧 Email:', student.email);
    console.log('🔑 Password field exists:', !!student.password);
    console.log('🔑 Password field type:', typeof student.password);
    console.log('🔑 Password field length:', student.password ? student.password.length : 0);
    console.log('🔑 Password field value (first 50 chars):', student.password ? student.password.substring(0, 50) + '...' : 'null');
    console.log('🔐 AuthMethod:', student.authMethod);
    console.log('🔐 AuthMethod type:', typeof student.authMethod);
    console.log('📅 Last Login:', student.lastLogin);
    console.log('✅ Email Verified:', student.isEmailVerified);
    console.log('🆔 Google ID:', student.googleId);
    
    // Test password comparison
    const testPassword = '123456';
    const isValidPassword = await bcrypt.compare(testPassword, student.password);
    console.log('🔍 Password comparison with "123456":', isValidPassword);
    
    // Test with wrong password
    const isWrongPassword = await bcrypt.compare('wrongpassword', student.password);
    console.log('🔍 Password comparison with "wrongpassword":', isWrongPassword);
    
    // Check if password field is empty string
    console.log('🔍 Password is empty string:', student.password === '');
    console.log('🔍 Password is null:', student.password === null);
    console.log('🔍 Password is undefined:', student.password === undefined);
    
    // Show all user fields
    console.log('\n=== ALL USER FIELDS ===');
    console.log(JSON.stringify(student.toObject(), null, 2));

  } catch (error) {
    console.error('Error diagnosing user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
diagnoseUser();
