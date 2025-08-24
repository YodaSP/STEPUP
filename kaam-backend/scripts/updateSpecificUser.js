const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Executive = require('../models/Executive');

const updateSpecificUser = async () => {
  try {
    // Connect to MongoDB Atlas (same as server)
    const mongoURI = "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas');

    const email = 'shivampandeyaps@gmail.com';
    
    let student = await Student.findOne({ email });
    if (student) {
      console.log('✅ Found student:', student.fullName);
      console.log('Current password exists:', !!student.password);
      console.log('Current authMethod:', student.authMethod);
      
      const saltRounds = 12;
      const defaultPassword = '123456';
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
      
      student.password = hashedPassword;
      student.authMethod = 'both';
      await student.save();
      
      console.log('✅ Updated student password to: 123456');
      console.log('✅ Set authMethod to: both');
    }
    
    let executive = await Executive.findOne({ email });
    if (executive) {
      console.log('✅ Found executive:', executive.fullName);
      console.log('Current password exists:', !!executive.password);
      console.log('Current authMethod:', executive.authMethod);
      
      const saltRounds = 12;
      const defaultPassword = '123456';
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
      
      executive.password = hashedPassword;
      executive.authMethod = 'both';
      await executive.save();
      
      console.log('✅ Updated executive password to: 123456');
      console.log('✅ Set authMethod to: both');
    }
    
    if (!student && !executive) {
      console.log('❌ User not found with email:', email);
    }

  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateSpecificUser();
