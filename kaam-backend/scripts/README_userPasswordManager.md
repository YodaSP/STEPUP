# User Password Manager - Admin Guide

A comprehensive tool for managing user passwords in the StepUP application. This script allows administrators to set, update, and audit user passwords for both Students and Executives.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage Modes](#usage-modes)
- [Command Examples](#command-examples)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

- Node.js installed on your system
- Access to the MongoDB database
- Proper environment variables configured in `.env` file
- Admin access to the backend server

## Installation

1. Navigate to the backend directory:
   ```bash
   cd kaam-backend
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

3. Verify your `.env` file contains the MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

## Usage Modes

The script supports 7 different modes for various password management tasks:

### 1. Set Password for Specific User
**Mode:** `specific`

Set or update password for a specific user by email address.

```bash
node scripts/userPasswordManager.js specific <email> [password]
```

**Examples:**
```bash
# Set password to default (123456)
node scripts/userPasswordManager.js specific john.doe@gmail.com

# Set custom password
node scripts/userPasswordManager.js specific jane.smith@gmail.com mySecurePassword123
```

**Features:**
- Auto-detects user type (Student or Executive)
- Verifies password after setting
- Sets authMethod to 'both' (Google + Password)
- Shows detailed status information

### 2. Set Default Passwords for Users Without Passwords
**Mode:** `defaults`

Sets default password (123456) for all users who don't have a password set.

```bash
node scripts/userPasswordManager.js defaults
```

**Use Case:** Initial setup or after importing users without passwords.

### 3. Reset All Users to Default Password
**Mode:** `reset`

⚠️ **WARNING:** This resets ALL user passwords to the default password.

```bash
node scripts/userPasswordManager.js reset
```

**Use Case:** Emergency password reset for all users.

### 4. Bulk Update Student Passwords
**Mode:** `bulk-student`

Updates passwords for all students.

```bash
node scripts/userPasswordManager.js bulk-student [password]
```

**Examples:**
```bash
# Set all students to default password
node scripts/userPasswordManager.js bulk-student

# Set all students to custom password
node scripts/userPasswordManager.js bulk-student studentPassword123
```

### 5. Bulk Update Executive Passwords
**Mode:** `bulk-executive`

Updates passwords for all executives.

```bash
node scripts/userPasswordManager.js bulk-executive [password]
```

**Examples:**
```bash
# Set all executives to default password
node scripts/userPasswordManager.js bulk-executive

# Set all executives to custom password
node scripts/userPasswordManager.js bulk-executive executivePassword123
```

### 6. Audit User Password Status
**Mode:** `audit`

Provides a comprehensive report on password status across all users.

```bash
node scripts/userPasswordManager.js audit
```

**Output includes:**
- Total number of users
- Users with passwords
- Users without passwords
- Password coverage percentage
- Breakdown by user type (Students vs Executives)

### 7. Test User Login
**Mode:** `test`

Tests if a user can login with given credentials.

```bash
node scripts/userPasswordManager.js test <email> <password>
```

**Example:**
```bash
node scripts/userPasswordManager.js test john.doe@gmail.com 123456
```

## Command Examples

### Quick Start - Set Password for Specific User
```bash
# Navigate to backend directory
cd kaam-backend

# Set password for specific user
node scripts/userPasswordManager.js specific shivampandeyaps@gmail.com 123456
```

### Initial Setup - Set Default Passwords
```bash
# Set default passwords for all users without passwords
node scripts/userPasswordManager.js defaults
```

### Emergency Reset - Reset All Passwords
```bash
# Reset all users to default password (use with caution)
node scripts/userPasswordManager.js reset
```

### Audit Current Status
```bash
# Check password status across all users
node scripts/userPasswordManager.js audit
```

### Test Login Credentials
```bash
# Test if user can login
node scripts/userPasswordManager.js test user@example.com 123456
```

## Security Notes

### Password Security
- All passwords are hashed using bcrypt with 12 salt rounds
- Default password is `123456` (change this for production)
- Passwords are never stored in plain text

### Authentication Methods
- After setting a password, users can login using:
  - **Google OAuth** (if previously enabled)
  - **Email + Password** (newly set)
  - **Both methods** (authMethod: 'both')

### Access Control
- This script requires direct database access
- Run only from secure, admin-controlled environments
- Consider using environment-specific passwords

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
❌ MongoDB connection failed: [error message]
```

**Solution:**
- Check your `.env` file for correct MONGODB_URI
- Verify network connectivity to MongoDB
- Ensure MongoDB credentials are correct

#### 2. User Not Found
```
❌ No Student found with email: user@example.com
```

**Solution:**
- Verify the email address is correct
- Check if user exists in the database
- Try with different user type (student/executive)

#### 3. Permission Denied
```
❌ No changes made to the database
```

**Solution:**
- Check database write permissions
- Verify user has admin access
- Ensure MongoDB user has update permissions

#### 4. Password Verification Failed
```
❌ Password verification: ❌ FAILED
```

**Solution:**
- This is rare but indicates a hashing issue
- Try running the command again
- Check for database corruption

### Debug Mode
Add `--trace-warnings` to see detailed warnings:
```bash
node --trace-warnings scripts/userPasswordManager.js specific user@example.com
```

## Best Practices

### 1. Regular Audits
Run audits regularly to monitor password status:
```bash
node scripts/userPasswordManager.js audit
```

### 2. Secure Default Passwords
Change the default password in the script for production:
```javascript
// In userPasswordManager.js, line 15
this.defaultPassword = 'your-secure-default-password';
```

### 3. User Communication
Always inform users when passwords are reset:
- Send email notifications
- Provide clear instructions for first login
- Include password reset instructions

### 4. Backup Before Bulk Operations
Before running bulk operations, consider:
- Taking a database backup
- Testing on a small subset first
- Having a rollback plan

### 5. Environment Separation
- Use different passwords for different environments
- Never use production passwords in development
- Keep a record of password changes

## Script Configuration

### Default Settings
```javascript
// Password hashing
this.saltRounds = 12;

// Default password
this.defaultPassword = '123456';

// Authentication method after password set
authMethod: 'both'
```

### Customizing Default Password
To change the default password, edit line 15 in `userPasswordManager.js`:
```javascript
this.defaultPassword = 'your-new-default-password';
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the command output for specific error messages
3. Verify database connectivity and permissions
4. Contact the development team for assistance

## Version History

- **v1.0** - Initial release with basic password management
- **v1.1** - Added audit functionality
- **v1.2** - Added user type auto-detection
- **v1.3** - Added password verification
- **v1.4** - Added bulk operations and test login

---

**⚠️ Important:** Always test password changes in a development environment before applying to production. Keep backups of your database before running bulk operations.

