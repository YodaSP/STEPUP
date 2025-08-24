const express = require('express');
const bcrypt = require('bcryptjs');
const { verifyGoogleToken, generateToken } = require('../middleware/auth');
const Student = require('../models/Student');
const Executive = require('../models/Executive');
const Employer = require('../models/Employer');

const router = express.Router();

// Google OAuth login/register for Students
router.post('/student/google', verifyGoogleToken, async (req, res) => {
  try {
    const { googleUser } = req;
    
    // Check if user already exists
    let student = await Student.findOne({ 
      $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }] 
    });

    if (student) {
      // Update last login and Google ID if not set
      student.lastLogin = new Date();
      if (!student.googleId) {
        student.googleId = googleUser.googleId;
        student.authMethod = 'google';
        student.isEmailVerified = googleUser.emailVerified;
      }
      await student.save();

      const token = generateToken({ ...student.toObject(), userType: 'student' });
      return res.json({
        success: true,
        token,
        user: {
          id: student._id,
          email: student.email,
          fullName: student.fullName,
          userType: 'student',
          isNewUser: false,
          // Include all profile data for existing users
          profile: {
            phone: student.phone,
            gender: student.gender,
            country: student.country,
            state: student.state,
            city: student.city,
            university: student.university,
            degree: student.degree,
            specialization: student.specialization,
            passingDate: student.passingDate,
            cgpa: student.cgpa,
            skills: student.skills,
            jobRole: student.jobRole,
            preferredLocation: student.preferredLocation,
            currentLocation: student.currentLocation,
            linkedin: student.linkedin,
            resume: student.resume,
            photo: student.photo
          }
        }
      });
    }

    // User doesn't exist - return special response for frontend to handle
    return res.json({
      success: false,
      userNotFound: true,
      message: 'User not found. Please complete registration.',
      user: {
        email: googleUser.email,
        fullName: googleUser.name,
        userType: 'student'
      }
    });

  } catch (error) {
    console.error('Student Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

// Google OAuth login/register for Executives
router.post('/executive/google', verifyGoogleToken, async (req, res) => {
  try {
    const { googleUser } = req;
    
    let executive = await Executive.findOne({ 
      $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }] 
    });

    if (executive) {
      executive.lastLogin = new Date();
      if (!executive.googleId) {
        executive.googleId = googleUser.googleId;
        executive.authMethod = 'google';
        executive.isEmailVerified = googleUser.emailVerified;
      }
      await executive.save();

      const token = generateToken({ ...executive.toObject(), userType: 'executive' });
      return res.json({
        success: true,
        token,
        user: {
          id: executive._id,
          email: executive.email,
          fullName: executive.fullName,
          userType: 'executive',
          isNewUser: false,
          // Include all profile data for existing users
          profile: {
            phone: executive.phone,
            gender: executive.gender,
            country: executive.country,
            state: executive.state,
            city: executive.city,
            currentLocation: executive.currentLocation,
            dateOfBirth: executive.dateOfBirth,
            maritalStatus: executive.maritalStatus,
            currentDesignation: executive.currentDesignation,
            totalYearsExperience: executive.totalYearsExperience,
            linkedinProfile: executive.linkedinProfile,
            careerObjective: executive.careerObjective,
            highestQualification: executive.highestQualification,
            institutionName: executive.institutionName,
            company: executive.company,
            position: executive.position,
            industry: executive.industry,
            resume: executive.resume,
            photo: executive.photo
          }
        }
      });
    }

    // User doesn't exist - return special response for frontend to handle
    return res.json({
      success: false,
      userNotFound: true,
      message: 'User not found. Please complete registration.',
      user: {
        email: googleUser.email,
        fullName: googleUser.name,
        userType: 'executive'
      }
    });

  } catch (error) {
    console.error('Executive Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

// Google OAuth login/register for Employers
router.post('/employer/google', verifyGoogleToken, async (req, res) => {
  try {
    const { googleUser } = req;
    
    let employer = await Employer.findOne({ 
      $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }] 
    });

    if (employer) {
      employer.lastLogin = new Date();
      if (!employer.googleId) {
        employer.googleId = googleUser.googleId;
        employer.authMethod = 'google';
        employer.isEmailVerified = googleUser.emailVerified;
      }
      await employer.save();

      const token = generateToken({ ...employer.toObject(), userType: 'employer' });
      return res.json({
        success: true,
        token,
        user: {
          id: employer._id,
          email: employer.email,
          companyName: employer.companyName,
          userType: 'employer',
          isNewUser: false,
          // Include all profile data for existing users
          profile: {
            contactPerson: employer.contactPerson,
            phone: employer.phone,
            industry: employer.industry,
            location: employer.location,
            companySize: employer.companySize,
            website: employer.website,
            description: employer.description
          }
        }
      });
    }

    // User doesn't exist - return special response for frontend to handle
    return res.json({
      success: false,
      userNotFound: true,
      message: 'User not found. Please complete registration.',
      user: {
        email: googleUser.email,
        fullName: googleUser.name,
        userType: 'employer'
      }
    });

  } catch (error) {
    console.error('Employer Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

// Password-based login for existing users
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    let user;
    switch (userType) {
      case 'student':
        user = await Student.findOne({ email });
        break;
      case 'executive':
        user = await Executive.findOne({ email });
        break;
      case 'employer':
        user = await Employer.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Account not set up for password login. Please use Google Sign-In.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ ...user.toObject(), userType });
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName || user.companyName,
        userType,
        isNewUser: false,
        // Include all profile data for password-based login
        profile: userType === 'student' ? {
          phone: user.phone,
          gender: user.gender,
          country: user.country,
          state: user.state,
          city: user.city,
          university: user.university,
          degree: user.degree,
          specialization: user.specialization,
          passingDate: user.passingDate,
          cgpa: user.cgpa,
          skills: user.skills,
          jobRole: user.jobRole,
          preferredLocation: user.preferredLocation,
          currentLocation: user.currentLocation,
          linkedin: user.linkedin,
          resume: user.resume,
          photo: user.photo
        } : userType === 'executive' ? {
          phone: user.phone,
          gender: user.gender,
          country: user.country,
          state: user.state,
          city: user.city,
          currentLocation: user.currentLocation,
          dateOfBirth: user.dateOfBirth,
          maritalStatus: user.maritalStatus,
          currentDesignation: user.currentDesignation,
          totalYearsExperience: user.totalYearsExperience,
          linkedinProfile: user.linkedinProfile,
          careerObjective: user.careerObjective,
          highestQualification: user.highestQualification,
          institutionName: user.institutionName,
          company: user.company,
          position: user.position,
          industry: user.industry,
          resume: user.resume,
          photo: user.photo
        } : {
          contactPerson: user.contactPerson,
          phone: user.phone,
          industry: user.industry,
          location: user.location,
          companySize: user.companySize,
          website: user.website,
          description: user.description
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Set password for existing Google users
router.post('/set-password', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    let user;
    switch (userType) {
      case 'student':
        user = await Student.findOne({ email });
        break;
      case 'executive':
        user = await Executive.findOne({ email });
        break;
      case 'employer':
        user = await Employer.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password) {
      return res.status(400).json({ message: 'Password already set for this account' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    user.password = hashedPassword;
    user.authMethod = 'both'; // Can use both Google and password
    await user.save();

    res.json({ success: true, message: 'Password set successfully' });

  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ message: 'Failed to set password', error: error.message });
  }
});

module.exports = router;
