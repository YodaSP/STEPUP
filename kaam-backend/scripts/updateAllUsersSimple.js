const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const updateAllUsersSimple = async () => {
  try {
    // Connect to MongoDB Atlas (same as server)
    const mongoURI = "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas');

    const saltRounds = 12;
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    
    console.log('🔧 Starting update for all users...');
    
    // Update all students directly in the database
    const studentResult = await mongoose.connection.collection('students').updateMany(
      { $or: [{ password: { $exists: false } }, { password: null }, { authMethod: { $ne: 'both' } }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    
    console.log(`📚 Students updated: ${studentResult.modifiedCount} out of ${studentResult.matchedCount} matched`);
    
    // Update all executives directly in the database
    const executiveResult = await mongoose.connection.collection('executives').updateMany(
      { $or: [{ password: { $exists: false } }, { password: null }, { authMethod: { $ne: 'both' } }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    
    console.log(`👔 Executives updated: ${executiveResult.modifiedCount} out of ${executiveResult.matchedCount} matched`);
    
    // Summary
    console.log('\n📊 UPDATE SUMMARY:');
    console.log(`📚 Students: ${studentResult.modifiedCount} updated`);
    console.log(`👔 Executives: ${executiveResult.modifiedCount} updated`);
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
updateAllUsersSimple();
