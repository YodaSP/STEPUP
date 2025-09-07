# Backend Scripts - User Password Management

This directory contains a comprehensive, enterprise-grade solution for managing user passwords and accounts in the STEPUP system.

## 🚀 **Master Tool: `userPasswordManager.js`**

The `userPasswordManager.js` is a **robust, all-in-one solution** that provides multiple operation modes for different scenarios. This single script replaces all the previous individual scripts and provides a unified interface.

### 📋 Available Modes

#### 1. **Set Password for Specific User**
```bash
# Set password for rohit@gmail.com to 123456
node userPasswordManager.js specific rohit@gmail.com 123456

# Set custom password
node userPasswordManager.js specific rohit@gmail.com myCustomPassword
```

#### 2. **Set Default Passwords for Users Without Passwords**
```bash
# Only update users who don't have passwords
node userPasswordManager.js defaults
```

#### 3. **Reset ALL Users to Default Password** ⚠️
```bash
# ⚠️  CAUTION: This changes ALL existing passwords
node userPasswordManager.js reset
```

#### 4. **Bulk Update All Students**
```bash
# Update all students to password 123456
node userPasswordManager.js bulk-student

# Update all students to custom password
node userPasswordManager.js bulk-student myCustomPassword
```

#### 5. **Bulk Update All Executives**
```bash
# Update all executives to password 123456
node userPasswordManager.js bulk-executive

# Update all executives to custom password
node userPasswordManager.js bulk-executive myCustomPassword
```

#### 6. **Audit Current Password Status**
```bash
# Check how many users have passwords
node userPasswordManager.js audit
```

#### 7. **Test User Login**
```bash
# Test if rohit@gmail.com can login with 123456
node userPasswordManager.js test rohit@gmail.com 123456
```

### 🔧 Key Features

- **Auto-detection**: Automatically finds whether a user is a Student or Executive
- **Secure hashing**: Uses bcrypt with 12 salt rounds
- **Dual authentication**: Sets `authMethod` to 'both' (Google + Password)
- **Comprehensive logging**: Detailed output for debugging
- **Error handling**: Graceful error handling and database connection management
- **Flexible**: Multiple modes for different use cases
- **Unified interface**: Single script handles all password management needs

## 🎯 **Recommended Workflow**

### For Setting Password for rohit@gmail.com:
```bash
cd kaam-backend
node scripts/userPasswordManager.js specific rohit@gmail.com 123456
```

### For Bulk Operations:
```bash
# First, audit current status
node scripts/userPasswordManager.js audit

# Then, set default passwords for users without passwords
node scripts/userPasswordManager.js defaults

# Or, update all students specifically
node scripts/userPasswordManager.js bulk-student 123456
```

### For Testing:
```bash
# Test the login
node scripts/userPasswordManager.js test rohit@gmail.com 123456
```

## 🔐 **Security Features**

- **Strong hashing**: bcrypt with 12 salt rounds
- **Password verification**: Built-in testing capabilities
- **Audit trails**: Comprehensive logging of all operations
- **Safe defaults**: Non-destructive operations by default

## ⚠️ **Important Notes**

1. **Always backup your database** before running bulk operations
2. **Test on a small subset** before running on production
3. **The 'reset' mode** changes ALL existing passwords - use with caution
4. **Default password** is set to `123456` - change this in production
5. **Auth method** is set to `'both'` to allow both Google and password login

## 🚨 **Emergency Scenarios**

### If you need to reset ALL users to a known password:
```bash
node userPasswordManager.js reset
```

### If you need to quickly set passwords for users without them:
```bash
node userPasswordManager.js defaults
```

### If you need to verify a specific user can login:
```bash
node userPasswordManager.js test user@email.com password
```

## 📊 **Output Examples**

The script provides detailed, color-coded output:
- ✅ Success operations
- ❌ Errors and failures
- 🔍 Information and status
- ⚠️  Warnings and cautions
- 📊 Summary statistics

## 🧹 **Cleanup Status**

✅ **Scripts folder has been cleaned up** - All redundant legacy scripts have been removed  
✅ **Single master tool** - `userPasswordManager.js` handles all password management needs  
✅ **Comprehensive documentation** - This README covers all functionality  

## 🎉 **Benefits of Cleanup**

- **No more confusion** about which script to use
- **Single source of truth** for password management
- **Easier maintenance** - only one script to update
- **Better organization** - clean, focused scripts folder
- **Consistent interface** - all operations use the same tool

This comprehensive tool gives you full control over user password management while maintaining security and providing detailed feedback for all operations. The cleanup ensures you have a streamlined, professional-grade solution.
