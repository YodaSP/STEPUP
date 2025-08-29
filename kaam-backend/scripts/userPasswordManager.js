const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";

// Import models
const Student = require('../models/Student');
const Executive = require('../models/Executive');

class UserPasswordManager {
  constructor() {
    this.saltRounds = 12;
    this.defaultPassword = '123456';
  }

  async connect() {
    try {
      await mongoose.connect(mongoURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      });
      console.log("✅ MongoDB connected successfully");
      return true;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      return false;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("🔌 Database connection closed");
    } catch (error) {
      console.error("❌ Error disconnecting:", error.message);
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Mode 1: Set password for specific user by email
  async setSpecificUserPassword(email, password = this.defaultPassword, userType = 'auto') {
    console.log(`\n🔍 Setting password for: ${email}`);
    console.log(`🔑 New password: ${password}`);
    console.log(`👤 User type: ${userType === 'auto' ? 'Auto-detect' : userType}`);

    let user = null;
    let userModel = null;
    let userTypeFound = null;

    // Auto-detect user type if not specified
    if (userType === 'auto') {
      user = await Student.findOne({ email });
      if (user) {
        userModel = Student;
        userTypeFound = 'Student';
      } else {
        user = await Executive.findOne({ email });
        if (user) {
          userModel = Executive;
          userTypeFound = 'Executive';
        }
      }
    } else if (userType === 'student') {
      user = await Student.findOne({ email });
      userModel = Student;
      userTypeFound = 'Student';
    } else if (userType === 'executive') {
      user = await Executive.findOne({ email });
      userModel = Executive;
      userTypeFound = 'Executive';
    }

    if (!user) {
      console.log(`❌ No ${userTypeFound || userType} found with email: ${email}`);
      return false;
    }

    console.log(`✅ Found ${userTypeFound}: ${user.fullName}`);
    console.log(`🔍 Current status:`, {
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      authMethod: user.authMethod
    });

    // Hash and update password
    const hashedPassword = await this.hashPassword(password);
    const result = await userModel.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Password updated successfully for ${userTypeFound}`);
      
      // Verify the update
      const updatedUser = await userModel.findOne({ email }).select('+password');
      if (updatedUser) {
        const isValid = await this.verifyPassword(password, updatedUser.password);
        console.log(`🔍 Password verification: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (isValid) {
          console.log(`🎉 SUCCESS: ${userTypeFound} can now login with:`);
          console.log(`   Email: ${email}`);
          console.log(`   Password: ${password}`);
          console.log(`   Auth Method: both (Google + Password)`);
          return true;
        }
      }
    } else {
      console.log(`❌ No changes made to the database`);
    }
    
    return false;
  }

  // Mode 2: Set default passwords for all users without passwords
  async setDefaultPasswordsForAll() {
    console.log(`\n🔧 Setting default passwords for all users without passwords...`);
    
    const hashedPassword = await this.hashPassword(this.defaultPassword);
    let totalUpdates = 0;

    // Update students without passwords
    const studentsResult = await Student.updateMany(
      { $or: [{ password: { $exists: false } }, { password: null }, { password: '' }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`📚 Updated ${studentsResult.modifiedCount} students`);

    // Update executives without passwords
    const executivesResult = await Executive.updateMany(
      { $or: [{ password: { $exists: false } }, { password: null }, { password: '' }] },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`👔 Updated ${executivesResult.modifiedCount} executives`);

    totalUpdates = studentsResult.modifiedCount + executivesResult.modifiedCount;
    
    if (totalUpdates > 0) {
      console.log(`\n✅ Successfully updated ${totalUpdates} users`);
      console.log(`🔑 Default password: ${this.defaultPassword}`);
      console.log(`🔐 Auth method: both (Google + Password)`);
    } else {
      console.log(`\n⏭️  All users already have passwords`);
    }

    return totalUpdates;
  }

  // Mode 3: Reset all users to default password
  async resetAllUsersToDefault() {
    console.log(`\n⚠️  RESETTING ALL USERS TO DEFAULT PASSWORD...`);
    console.log(`⚠️  This will change ALL existing passwords to: ${this.defaultPassword}`);
    
    const hashedPassword = await this.hashPassword(this.defaultPassword);
    let totalUpdates = 0;

    // Reset all students
    const studentsResult = await Student.updateMany(
      {},
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`📚 Reset ${studentsResult.modifiedCount} students`);

    // Reset all executives
    const executivesResult = await Executive.updateMany(
      {},
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );
    console.log(`👔 Reset ${executivesResult.modifiedCount} executives`);

    totalUpdates = studentsResult.modifiedCount + executivesResult.modifiedCount;
    
    console.log(`\n✅ Successfully reset ${totalUpdates} users`);
    console.log(`🔑 New password for all users: ${this.defaultPassword}`);
    console.log(`🔐 Auth method: both (Google + Password)`);

    return totalUpdates;
  }

  // Mode 4: Bulk update specific user types
  async updateUserTypePasswords(userType, password = this.defaultPassword) {
    console.log(`\n🔧 Updating passwords for all ${userType}s...`);
    
    const hashedPassword = await this.hashPassword(password);
    let userModel, userTypeName;

    if (userType === 'student') {
      userModel = Student;
      userTypeName = 'Students';
    } else if (userType === 'executive') {
      userModel = Executive;
      userTypeName = 'Executives';
    } else {
      console.log(`❌ Invalid user type: ${userType}. Use 'student' or 'executive'`);
      return 0;
    }

    const result = await userModel.updateMany(
      {},
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} ${userTypeName}`);
    console.log(`🔑 New password: ${password}`);
    console.log(`🔐 Auth method: both (Google + Password)`);

    return result.modifiedCount;
  }

  // Mode 5: Audit user password status
  async auditUserPasswords() {
    console.log(`\n🔍 AUDITING USER PASSWORD STATUS...`);
    
    // Check students
    const students = await Student.find({});
    const studentsWithPassword = students.filter(s => s.password && s.password.length > 0);
    const studentsWithoutPassword = students.length - studentsWithPassword.length;
    
    console.log(`📚 Students:`);
    console.log(`   Total: ${students.length}`);
    console.log(`   With password: ${studentsWithPassword.length}`);
    console.log(`   Without password: ${studentsWithoutPassword}`);

    // Check executives
    const executives = await Executive.find({});
    const executivesWithPassword = executives.filter(e => e.password && e.password.length > 0);
    const executivesWithoutPassword = executives.length - executivesWithPassword.length;
    
    console.log(`👔 Executives:`);
    console.log(`   Total: ${executives.length}`);
    console.log(`   With password: ${executivesWithPassword.length}`);
    console.log(`   Without password: ${executivesWithoutPassword}`);

    const totalUsers = students.length + executives.length;
    const totalWithPassword = studentsWithPassword.length + executivesWithPassword.length;
    const totalWithoutPassword = totalUsers - totalWithPassword;

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   With password: ${totalWithPassword}`);
    console.log(`   Without password: ${totalWithoutPassword}`);
    console.log(`   Coverage: ${((totalWithPassword / totalUsers) * 100).toFixed(1)}%`);

    return {
      total: totalUsers,
      withPassword: totalWithPassword,
      withoutPassword: totalWithoutPassword
    };
  }

  // Mode 6: Test specific user login
  async testUserLogin(email, password) {
    console.log(`\n🧪 Testing login for: ${email}`);
    
    let user = await Student.findOne({ email }).select('+password');
    let userType = 'Student';
    
    if (!user) {
      user = await Executive.findOne({ email }).select('+password');
      userType = 'Executive';
    }

    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return false;
    }

    console.log(`✅ Found ${userType}: ${user.fullName}`);
    console.log(`🔍 Account status:`, {
      hasPassword: !!user.password,
      authMethod: user.authMethod,
      isEmailVerified: user.isEmailVerified
    });

    if (!user.password) {
      console.log(`❌ User has no password set`);
      return false;
    }

    const isValid = await this.verifyPassword(password, user.password);
    console.log(`🔐 Password verification: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (isValid) {
      console.log(`🎉 LOGIN SUCCESSFUL!`);
      console.log(`   ${userType}: ${user.fullName}`);
      console.log(`   Email: ${email}`);
      console.log(`   Can login with: ${user.authMethod}`);
    } else {
      console.log(`❌ LOGIN FAILED - Invalid password`);
    }

    return isValid;
  }
}

// Main execution function
async function main() {
  const manager = new UserPasswordManager();
  
  // Check command line arguments
  const args = process.argv.slice(2);
  const mode = args[0];
  
  if (!await manager.connect()) {
    process.exit(1);
  }

  try {
    switch (mode) {
      case 'specific':
        // Usage: node userPasswordManager.js specific rohit@gmail.com 123456
        const email = args[1];
        const password = args[2] || '123456';
        if (!email) {
          console.log('❌ Usage: node userPasswordManager.js specific <email> [password]');
          break;
        }
        await manager.setSpecificUserPassword(email, password);
        break;

      case 'defaults':
        // Usage: node userPasswordManager.js defaults
        await manager.setDefaultPasswordsForAll();
        break;

      case 'reset':
        // Usage: node userPasswordManager.js reset
        await manager.resetAllUsersToDefault();
        break;

      case 'bulk-student':
        // Usage: node userPasswordManager.js bulk-student [password]
        const studentPassword = args[1] || '123456';
        await manager.updateUserTypePasswords('student', studentPassword);
        break;

      case 'bulk-executive':
        // Usage: node userPasswordManager.js bulk-executive [password]
        const executivePassword = args[1] || '123456';
        await manager.updateUserTypePasswords('executive', executivePassword);
        break;

      case 'audit':
        // Usage: node userPasswordManager.js audit
        await manager.auditUserPasswords();
        break;

      case 'test':
        // Usage: node userPasswordManager.js test rohit@gmail.com 123456
        const testEmail = args[1];
        const testPassword = args[2];
        if (!testEmail || !testPassword) {
          console.log('❌ Usage: node userPasswordManager.js test <email> <password>');
          break;
        }
        await manager.testUserLogin(testEmail, testPassword);
        break;

      default:
        console.log(`
🔧 USER PASSWORD MANAGER - Comprehensive Tool

📋 USAGE EXAMPLES:

1. Set password for specific user:
   node userPasswordManager.js specific rohit@gmail.com 123456

2. Set default passwords for users without passwords:
   node userPasswordManager.js defaults

3. Reset ALL users to default password (⚠️  CAUTION):
   node userPasswordManager.js reset

4. Update all students to specific password:
   node userPasswordManager.js bulk-student 123456

5. Update all executives to specific password:
   node userPasswordManager.js bulk-executive 123456

6. Audit current password status:
   node userPasswordManager.js audit

7. Test user login:
   node userPasswordManager.js test rohit@gmail.com 123456

🔑 Default password: 123456
🔐 Auth method: both (Google + Password)
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await manager.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = UserPasswordManager;
