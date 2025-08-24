const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Executive = require('../models/Executive');

const updateAllUsers = async () => {
  try {
    // Connect to MongoDB Atlas (same as server)
    const mongoURI = "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas');

    const saltRounds = 12;
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    
    console.log('🔧 Starting update for all users...');
    
    // Update all students
    const students = await Student.find({});
    console.log(`📚 Found ${students.length} students`);
    
    let studentUpdates = 0;
    for (const student of students) {
      const needsUpdate = !student.password || student.authMethod !== 'both';
      
      if (needsUpdate) {
        student.password = hashedPassword;
        student.authMethod = 'both';
        await student.save();
        studentUpdates++;
        console.log(`✅ Updated student: ${student.fullName} (${student.email})`);
      } else {
        console.log(`⏭️  Student already updated: ${student.fullName} (${student.email})`);
      }
    }
    
    // Update all executives
    const executives = await Executive.find({});
    console.log(`👔 Found ${executives.length} executives`);
    
    let executiveUpdates = 0;
    for (const executive of executives) {
      const needsUpdate = !executive.password || executive.authMethod !== 'both';
      
      if (needsUpdate) {
        executive.password = hashedPassword;
        executive.authMethod = 'both';
        await executive.save();
        executiveUpdates++;
        console.log(`✅ Updated executive: ${executive.fullName} (${executive.email})`);
      } else {
        console.log(`⏭️  Executive already updated: ${executive.fullName} (${executive.email})`);
      }
    }
    
    // Summary
    console.log('\n📊 UPDATE SUMMARY:');
    console.log(`📚 Students: ${studentUpdates}/${students.length} updated`);
    console.log(`👔 Executives: ${executiveUpdates}/${executives.length} updated`);
    console.log(`🔑 Default password set: ${defaultPassword}`);
    console.log(`🔐 AuthMethod set to: both`);
    console.log(`✅ All users can now login with Google Sign-In OR password: ${defaultPassword}`);

  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateAllUsers();
