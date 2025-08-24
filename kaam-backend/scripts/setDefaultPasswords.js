const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Executive = require('../models/Executive');

const setDefaultPasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/kaam_db');
    console.log('Connected to MongoDB');

    // Hash the default password
    const saltRounds = 12;
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // Update all students who don't have a password
    const studentsResult = await Student.updateMany(
      { password: { $exists: false } },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`Updated ${studentsResult.modifiedCount} students with default password`);

    // Update all executives who don't have a password
    const executivesResult = await Executive.updateMany(
      { password: { $exists: false } },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`Updated ${executivesResult.modifiedCount} executives with default password`);

    // Also update users with null/empty passwords
    const studentsResult2 = await Student.updateMany(
      { $or: [{ password: null }, { password: '' }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`Updated ${studentsResult2.modifiedCount} students with null/empty passwords`);

    const executivesResult2 = await Executive.updateMany(
      { $or: [{ password: null }, { password: '' }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`Updated ${executivesResult2.modifiedCount} executives with null/empty passwords`);

    console.log('Default password setup completed successfully!');
    console.log('Default password for all users: 123456');

  } catch (error) {
    console.error('Error setting default passwords:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
setDefaultPasswords();
