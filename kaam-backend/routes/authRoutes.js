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
        student.authMethod = 'both'; // Allow both Google and password
        student.isEmailVerified = googleUser.emailVerified;
      } else if (student.authMethod === 'password') {
        // If user was password-only, now they can use both
        student.authMethod = 'both';
      }
      
      // Debug: Log the actual student data
      console.log('🔍 Student data from database:', {
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        university: student.university,
        degree: student.degree,
        skills: student.skills,
        jobRole: student.jobRole,
        currentLocation: student.currentLocation,
        resume: student.resume
      });
      
      // Check if all required fields are present before saving
      const requiredFields = ['fullName', 'email', 'phone', 'university', 'degree', 'passingDate', 'skills', 'jobRole', 'preferredLocation', 'currentLocation', 'resume'];
      const missingFields = requiredFields.filter(field => !student[field]);
      
      let hasIncompleteProfile = false;
      if (missingFields.length > 0) {
        console.log('⚠️ Student missing required fields during Google OAuth:', missingFields);
        hasIncompleteProfile = true;
        // Update only the lastLogin field directly to avoid validation issues
        try {
          await Student.updateOne(
            { _id: student._id },
            { 
              $set: { 
                lastLogin: new Date(),
                googleId: student.googleId || googleUser.googleId,
                authMethod: student.authMethod || 'both',
                isEmailVerified: student.isEmailVerified || googleUser.emailVerified
              }
            }
          );
        } catch (updateError) {
          console.error('Student update error during Google OAuth:', updateError);
        }
      } else {
        // All required fields are present, safe to save the entire object
        try {
          await student.save();
        } catch (saveError) {
          console.error('Student save error during Google OAuth:', saveError);
        }
      }
      
      const token = generateToken({ ...student.toObject(), userType: 'student' });
      
      const profileData = {
        fullName: student.fullName || null,
        email: student.email || null,
        phone: student.phone || null,
        gender: student.gender || 'Other',
        country: student.country || null,
        otherCountry: student.otherCountry || null,
        state: student.state || null,
        otherState: student.otherState || null,
        city: student.city || null,
        otherCity: student.otherCity || null,
        university: student.university || null,
        degree: student.degree || null,
        specialization: student.specialization || null,
        passingDate: student.passingDate || null,
        cgpa: student.cgpa || null,
        skills: student.skills || null,
        jobRole: student.jobRole || null,
        preferredLocation: student.preferredLocation || null,
        currentLocation: student.currentLocation || null,
        linkedin: student.linkedin || null,
        resume: student.resume || null,
        photo: student.photo || null,
        authMethod: student.authMethod || 'google',
        isEmailVerified: student.isEmailVerified || false,
        lastLogin: student.lastLogin || new Date()
      };
      
      // Debug: Log the constructed profile data
      console.log('🔍 Constructed profile data:', profileData);
      
              return res.json({
          success: true,
          token,
          user: {
            id: student._id,
            email: student.email,
            fullName: student.fullName,
            userType: 'student',
            isNewUser: false,
            hasIncompleteProfile: hasIncompleteProfile,
            // Include all profile data at root level for frontend compatibility
            phone: student.phone || null,
            gender: student.gender || 'Other',
            country: student.country || null,
            otherCountry: student.otherCountry || null,
            state: student.state || null,
            otherState: student.otherState || null,
            city: student.city || null,
            otherCity: student.otherCity || null,
            university: student.university || null,
            degree: student.degree || null,
            specialization: student.specialization || null,
            passingDate: student.passingDate || null,
            cgpa: student.cgpa || null,
            skills: student.skills || null,
            jobRole: student.jobRole || null,
            preferredLocation: student.preferredLocation || null,
            currentLocation: student.currentLocation || null,
            linkedin: student.linkedin || null,
            resume: student.resume || null,
            photo: student.photo || null,
            authMethod: student.authMethod || 'google',
            isEmailVerified: student.isEmailVerified || false,
            lastLogin: student.lastLogin || new Date(),
            // Also include profile object for backward compatibility
            profile: profileData
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
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.message);
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })));
    }
    
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
        executive.authMethod = 'both'; // Allow both Google and password
        executive.isEmailVerified = googleUser.emailVerified;
      } else if (executive.authMethod === 'password') {
        // If user was password-only, now they can use both
        executive.authMethod = 'both';
      }
      
      // Debug: Log the actual executive data
      console.log('🔍 Executive data from database:', {
        fullName: executive.fullName,
        email: executive.email,
        phone: executive.phone,
        currentLocation: executive.currentLocation,
        dateOfBirth: executive.dateOfBirth,
        currentDesignation: executive.currentDesignation,
        totalYearsExperience: executive.totalYearsExperience,
        careerObjective: executive.careerObjective,
        highestQualification: executive.highestQualification,
        institutionName: executive.institutionName,
        company: executive.company,
        position: executive.position,
        industry: executive.industry,
        resume: executive.resume
      });
      
      // Check if all required fields are present before saving
      const requiredFields = ['fullName', 'email', 'phone', 'currentLocation', 'dateOfBirth', 'currentDesignation', 'totalYearsExperience', 'careerObjective', 'highestQualification', 'institutionName', 'company', 'position', 'industry', 'resume'];
      const missingFields = requiredFields.filter(field => !executive[field]);
      
      let hasIncompleteProfile = false;
      if (missingFields.length > 0) {
        console.log('⚠️ Executive missing required fields during Google OAuth:', missingFields);
        hasIncompleteProfile = true;
        // Update only the lastLogin field directly to avoid validation issues
        try {
          await Executive.updateOne(
            { _id: executive._id },
            { 
              $set: { 
                lastLogin: new Date(),
                googleId: executive.googleId || googleUser.googleId,
                authMethod: executive.authMethod || 'both',
                isEmailVerified: executive.isEmailVerified || googleUser.emailVerified
              }
            }
          );
        } catch (updateError) {
          console.error('Executive update error during Google OAuth:', updateError);
        }
      } else {
        // All required fields are present, safe to save the entire object
        try {
          await executive.save();
        } catch (saveError) {
          console.error('Executive save error during Google OAuth:', saveError);
        }
      }

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
          hasIncompleteProfile: hasIncompleteProfile,
          // Include all profile data at root level for frontend compatibility
          phone: executive.phone || null,
          gender: executive.gender || 'Other',
          country: executive.country || null,
          otherCountry: executive.otherCountry || null,
          state: executive.state || null,
          otherState: executive.otherState || null,
          city: executive.city || null,
          otherCity: executive.otherCity || null,
          currentLocation: executive.currentLocation || null,
          dateOfBirth: executive.dateOfBirth || null,
          maritalStatus: executive.maritalStatus || 'Single',
          currentDesignation: executive.currentDesignation || null,
          totalYearsExperience: executive.totalYearsExperience || null,
          linkedinProfile: executive.linkedinProfile || null,
          careerObjective: executive.careerObjective || null,
          highestQualification: executive.highestQualification || null,
          institutionName: executive.institutionName || null,
          company: executive.company || null,
          position: executive.position || null,
          industry: executive.industry || null,
          resume: executive.resume || null,
          photo: executive.photo || null,
          // Also include profile object for backward compatibility
          profile: {
            phone: executive.phone || null,
            gender: executive.gender || 'Other',
            country: executive.country || null,
            otherCountry: executive.otherCountry || null,
            state: executive.state || null,
            otherState: executive.otherState || null,
            city: executive.city || null,
            otherCity: executive.otherCity || null,
            currentLocation: executive.currentLocation || null,
            dateOfBirth: executive.dateOfBirth || null,
            maritalStatus: executive.maritalStatus || 'Single',
            currentDesignation: executive.currentDesignation || null,
            totalYearsExperience: executive.totalYearsExperience || null,
            linkedinProfile: executive.linkedinProfile || null,
            careerObjective: executive.careerObjective || null,
            highestQualification: executive.highestQualification || null,
            institutionName: executive.institutionName || null,
            company: executive.company || null,
            position: executive.position || null,
            industry: executive.industry || null,
            resume: executive.resume || null,
            photo: executive.photo || null
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
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.message);
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })));
    }
    
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
        employer.authMethod = 'both'; // Allow both Google and password
        employer.isEmailVerified = googleUser.emailVerified;
      } else if (employer.authMethod === 'password') {
        // If user was password-only, now they can use both
        employer.authMethod = 'both';
      }
      
      // Only save if the employer object is valid
      try {
              // Check if all required fields are present before saving
      const requiredFields = ['companyName', 'email', 'contactPerson', 'phone', 'industry', 'location', 'companySize', 'description'];
      const missingFields = requiredFields.filter(field => !employer[field]);
      
      let hasIncompleteProfile = false;
      if (missingFields.length > 0) {
        console.log('⚠️ Employer missing required fields during Google OAuth:', missingFields);
        hasIncompleteProfile = true;
        // Update only the lastLogin field directly to avoid validation issues
        try {
          await Employer.updateOne(
            { _id: employer._id },
            { 
              $set: { 
                lastLogin: new Date(),
                googleId: employer.googleId || googleUser.googleId,
                authMethod: employer.authMethod || 'both',
                isEmailVerified: employer.isEmailVerified || googleUser.emailVerified
              }
            }
          );
        } catch (updateError) {
          console.error('Employer update error during Google OAuth:', updateError);
        }
      } else {
        // All required fields are present, safe to save the entire object
        try {
          await employer.save();
        } catch (saveError) {
          console.error('Employer save error during Google OAuth:', saveError);
        }
      }
      } catch (saveError) {
        console.error('Employer save error during Google OAuth:', saveError);
        // If save fails due to validation, still allow login but don't update the user
        // The user can complete their profile later
      }

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
          hasIncompleteProfile: hasIncompleteProfile,
          // Include all profile data at root level for frontend compatibility
          contactPerson: employer.contactPerson || null,
          phone: employer.phone || null,
          industry: employer.industry || null,
          location: employer.location || null,
          companySize: employer.companySize || null,
          website: employer.website || null,
          description: employer.description || null,
          // Also include profile object for backward compatibility
          profile: {
            contactPerson: employer.contactPerson || null,
            phone: employer.phone || null,
            industry: employer.industry || null,
            location: employer.location || null,
            companySize: employer.companySize || null,
            website: employer.website || null,
            description: employer.description || null
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
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.message);
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })));
    }
    
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

// Password-based login for existing users
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 Login Debug - Request body:', req.body);
    const { email, password, userType } = req.body;
    
    if (!email || !password || !userType) {
      console.log('❌ Login Debug - Missing required fields');
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    let user;
    switch (userType) {
      case 'student':
        user = await Student.findOne({ email }).select('+password');
        break;
      case 'executive':
        user = await Executive.findOne({ email }).select('+password');
        break;
      case 'employer':
        user = await Employer.findOne({ email }).select('+password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      console.log('❌ Login Debug - User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('✅ Login Debug - User found:', user.fullName);
    console.log('✅ Login Debug - User has password:', !!user.password);
    console.log('✅ Login Debug - User authMethod:', user.authMethod);
    
    // Debug: Log the actual user data from database
    if (userType === 'student') {
      console.log('🔍 Student data from database:', {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        university: user.university,
        degree: user.degree,
        skills: user.skills,
        jobRole: user.jobRole,
        currentLocation: user.currentLocation,
        resume: user.resume
      });
    } else if (userType === 'executive') {
      console.log('🔍 Executive data from database:', {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        currentLocation: user.currentLocation,
        dateOfBirth: user.dateOfBirth,
        currentDesignation: user.currentDesignation,
        totalYearsExperience: user.totalYearsExperience,
        careerObjective: user.careerObjective,
        highestQualification: user.highestQualification,
        institutionName: user.institutionName,
        company: user.company,
        position: user.position,
        industry: user.industry,
        resume: user.resume
      });
    } else if (userType === 'employer') {
      console.log('🔍 Employer data from database:', {
        companyName: user.companyName,
        email: user.email,
        contactPerson: user.contactPerson,
        phone: user.phone,
        industry: user.industry,
        location: user.location,
        companySize: user.companySize,
        description: user.description
      });
    }

    if (!user.password) {
      console.log('❌ Login Debug - User has no password');
      return res.status(401).json({ message: 'Account not set up for password login. Please use Google Sign-In.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔍 Login Debug - Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Login Debug - Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.lastLogin = new Date();
    
    // Check if all required fields are present before saving
    let requiredFields = [];
    if (userType === 'student') {
      requiredFields = ['fullName', 'email', 'phone', 'university', 'degree', 'passingDate', 'skills', 'jobRole', 'preferredLocation', 'currentLocation', 'resume'];
    } else if (userType === 'executive') {
      requiredFields = ['fullName', 'email', 'phone', 'currentLocation', 'dateOfBirth', 'currentDesignation', 'totalYearsExperience', 'careerObjective', 'highestQualification', 'institutionName', 'company', 'position', 'industry', 'resume'];
    } else if (userType === 'employer') {
      requiredFields = ['companyName', 'email', 'contactPerson', 'phone', 'industry', 'location', 'companySize', 'description'];
    }
    
    const missingFields = requiredFields.filter(field => !user[field]);
    
    let hasIncompleteProfile = false;
    if (missingFields.length > 0) {
      console.log(`⚠️ ${userType} missing required fields during password login:`, missingFields);
      hasIncompleteProfile = true;
      // Update only the lastLogin field directly to avoid validation issues
      try {
        let Model;
        if (userType === 'student') Model = Student;
        else if (userType === 'executive') Model = Executive;
        else if (userType === 'employer') Model = Employer;
        
        await Model.updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
        );
      } catch (updateError) {
        console.error(`${userType} update error during password login:`, updateError);
      }
    } else {
      // All required fields are present, safe to save the entire object
      try {
        await user.save();
      } catch (saveError) {
        console.error('User save error during password login:', saveError);
      }
    }

    const token = generateToken({ ...user.toObject(), userType });
    
    // Debug: Log the final response being sent
    const finalResponse = {
      success: true,
      token,
      user: userType === 'student' ? {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: hasIncompleteProfile,
        // Include all profile data at root level for frontend compatibility
        phone: user.phone || null,
        gender: user.gender || 'Other',
        country: user.country || null,
        otherCountry: user.otherCountry || null,
        state: user.state || null,
        otherState: user.otherState || null,
        city: user.city || null,
        otherCity: user.otherCity || null,
        university: user.university || null,
        degree: user.degree || null,
        specialization: user.specialization || null,
        passingDate: user.passingDate || null,
        cgpa: user.cgpa || null,
        skills: user.skills || null,
        jobRole: user.jobRole || null,
        preferredLocation: user.preferredLocation || null,
        currentLocation: user.currentLocation || null,
        linkedin: user.linkedin || null,
        resume: user.resume || null,
        photo: user.photo || null,
        // Also include profile object for backward compatibility
        profile: {
          phone: user.phone || null,
          gender: user.gender || 'Other',
          country: user.country || null,
          otherCountry: user.otherCountry || null,
          state: user.state || null,
          otherState: user.otherState || null,
          city: user.city || null,
          otherCity: user.otherCity || null,
          university: user.university || null,
          degree: user.degree || null,
          specialization: user.specialization || null,
          passingDate: user.passingDate || null,
          cgpa: user.cgpa || null,
          skills: user.skills || null,
          jobRole: user.jobRole || null,
          preferredLocation: user.preferredLocation || null,
          currentLocation: user.currentLocation || null,
          linkedin: user.linkedin || null,
          resume: user.resume || null,
          photo: user.photo || null
        }
      } : userType === 'executive' ? {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: hasIncompleteProfile,
        // Include all profile data at root level for frontend compatibility
        phone: user.phone || null,
        gender: user.gender || 'Other',
        country: user.country || null,
        otherCountry: user.otherCountry || null,
        state: user.state || null,
        otherState: user.otherState || null,
        city: user.city || null,
        otherCity: user.otherCity || null,
        currentLocation: user.currentLocation || null,
        dateOfBirth: user.dateOfBirth || null,
        maritalStatus: user.maritalStatus || 'Single',
        currentDesignation: user.currentDesignation || null,
        totalYearsExperience: user.totalYearsExperience || null,
        linkedinProfile: user.linkedinProfile || null,
        careerObjective: user.careerObjective || null,
        highestQualification: user.highestQualification || null,
        institutionName: user.institutionName || null,
        company: user.company || null,
        position: user.position || null,
        industry: user.industry || null,
        resume: user.resume || null,
        photo: user.photo || null,
        // Also include profile object for backward compatibility
        profile: {
          phone: user.phone || null,
          gender: user.gender || 'Other',
          country: user.country || null,
          otherCountry: user.otherCountry || null,
          state: user.state || null,
          otherState: user.otherState || null,
          city: user.city || null,
          otherCity: user.otherCity || null,
          currentLocation: user.currentLocation || null,
          dateOfBirth: user.dateOfBirth || null,
          maritalStatus: user.maritalStatus || 'Single',
          currentDesignation: user.currentDesignation || null,
          totalYearsExperience: user.totalYearsExperience || null,
          linkedinProfile: user.linkedinProfile || null,
          careerObjective: user.careerObjective || null,
          highestQualification: user.highestQualification || null,
          institutionName: user.institutionName || null,
          company: user.company || null,
          position: user.position || null,
          industry: user.industry || null,
          resume: user.resume || null,
          photo: user.photo || null
        }
      } : {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: hasIncompleteProfile,
        // Include all profile data at root level for frontend compatibility
        contactPerson: user.contactPerson || null,
        phone: user.phone || null,
        industry: user.industry || null,
        location: user.location || null,
        companySize: user.companySize || null,
        website: user.website || null,
        description: user.description || null,
        // Also include profile object for backward compatibility
        profile: {
          contactPerson: user.contactPerson || null,
          phone: user.phone || null,
          industry: user.industry || null,
          location: user.location || null,
          companySize: user.companySize || null,
          website: user.website || null,
          description: user.description || null
        }
      }
    };
    
    console.log('🔍 Final response being sent to frontend:', JSON.stringify(finalResponse, null, 2));
    res.json(finalResponse);

  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.message);
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })));
    }
    
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Set or update password for users
router.post('/set-password', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    let user;
    switch (userType) {
      case 'student':
        user = await Student.findOne({ email }).select('+password');
        break;
      case 'executive':
        user = await Executive.findOne({ email }).select('+password');
        break;
      case 'employer':
        user = await Employer.findOne({ email }).select('+password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update only the password and authMethod fields to avoid validation issues
    let Model;
    switch (userType) {
      case 'student':
        Model = Student;
        break;
      case 'executive':
        Model = Executive;
        break;
      case 'employer':
        Model = Employer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    await Model.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          authMethod: 'both'
        } 
      }
    );

    res.json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Set password error:', error);
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.message);
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })));
    }
    
    res.status(500).json({ message: 'Failed to set password', error: error.message });
  }
});

// Get missing required fields for a user
router.get('/missing-fields/:userType/:userId', async (req, res) => {
  try {
    const { userType, userId } = req.params;
    
    let user;
    let requiredFields = [];
    
    switch (userType) {
      case 'student':
        user = await Student.findById(userId);
        requiredFields = ['fullName', 'email', 'phone', 'university', 'degree', 'passingDate', 'skills', 'jobRole', 'preferredLocation', 'currentLocation', 'resume'];
        break;
      case 'executive':
        user = await Executive.findById(userId);
        requiredFields = ['fullName', 'email', 'phone', 'currentLocation', 'dateOfBirth', 'currentDesignation', 'totalYearsExperience', 'careerObjective', 'highestQualification', 'institutionName', 'company', 'position', 'industry', 'resume'];
        break;
      case 'employer':
        user = await Employer.findById(userId);
        requiredFields = ['companyName', 'email', 'contactPerson', 'phone', 'industry', 'location', 'companySize', 'description'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const missingFields = requiredFields.filter(field => !user[field]);
    
    res.json({
      success: true,
      missingFields,
      hasIncompleteProfile: missingFields.length > 0,
      totalRequiredFields: requiredFields.length,
      completedFields: requiredFields.length - missingFields.length,
      userData: {
        id: user._id,
        email: user.email,
        fullName: user.fullName || user.companyName,
        userType,
        profile: userType === 'student' ? {
          phone: user.phone || null,
          gender: user.gender || 'Other',
          country: user.country || null,
          state: user.state || null,
          city: user.city || null,
          university: user.university || null,
          degree: user.degree || null,
          specialization: user.specialization || null,
          passingDate: user.passingDate || null,
          cgpa: user.cgpa || null,
          skills: user.skills || null,
          jobRole: user.jobRole || null,
          preferredLocation: user.preferredLocation || null,
          currentLocation: user.currentLocation || null,
          linkedin: user.linkedin || null,
          resume: user.resume || null,
          photo: user.photo || null
        } : userType === 'executive' ? {
          phone: user.phone || null,
          gender: user.gender || 'Other',
          country: user.country || null,
          state: user.state || null,
          city: user.city || null,
          currentLocation: user.currentLocation || null,
          dateOfBirth: user.dateOfBirth || null,
          maritalStatus: user.maritalStatus || 'Single',
          currentDesignation: user.currentDesignation || null,
          totalYearsExperience: user.totalYearsExperience || null,
          linkedinProfile: user.linkedinProfile || null,
          careerObjective: user.careerObjective || null,
          highestQualification: user.highestQualification || null,
          institutionName: user.institutionName || null,
          company: user.company || null,
          position: user.position || null,
          industry: user.industry || null,
          resume: user.resume || null,
          photo: user.photo || null
        } : {
          contactPerson: user.contactPerson || null,
          phone: user.phone || null,
          industry: user.industry || null,
          location: user.location || null,
          companySize: user.companySize || null,
          website: user.website || null,
          description: user.description || null
        }
      }
    });
    
  } catch (error) {
    console.error('Get missing fields error:', error);
    res.status(500).json({ message: 'Failed to get missing fields', error: error.message });
  }
});

// Update user profile fields
router.patch('/update-profile/:userType/:userId', async (req, res) => {
  try {
    const { userType, userId } = req.params;
    const updateData = req.body;
    
    let Model;
    switch (userType) {
      case 'student':
        Model = Student;
        break;
      case 'executive':
        Model = Executive;
        break;
      case 'employer':
        Model = Employer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    const user = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: false } // Don't run validators for partial updates
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName || user.companyName,
        userType
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Debug route to check user data directly from database
router.get('/debug-user/:userType/:email', async (req, res) => {
  try {
    const { userType, email } = req.params;
    
    let user;
    let Model;
    
    switch (userType) {
      case 'student':
        Model = Student;
        break;
      case 'executive':
        Model = Executive;
        break;
      case 'employer':
        Model = Employer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    user = await Model.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return the raw user data from database
    res.json({
      success: true,
      message: 'Raw user data from database',
      userType,
      email,
      rawUserData: user.toObject(),
      hasIncompleteProfile: false // We'll calculate this based on required fields
    });
    
  } catch (error) {
    console.error('Debug user error:', error);
    res.status(500).json({ message: 'Failed to get user data', error: error.message });
  }
});

// Route to get profile completion status
router.get('/profile-status/:userType/:userId', async (req, res) => {
  try {
    const { userType, userId } = req.params;
    
    let user;
    let requiredFields = [];
    
    switch (userType) {
      case 'student':
        user = await Student.findById(userId);
        requiredFields = ['fullName', 'email', 'phone', 'university', 'degree', 'passingDate', 'skills', 'jobRole', 'preferredLocation', 'currentLocation', 'resume'];
        break;
      case 'executive':
        user = await Executive.findById(userId);
        requiredFields = ['fullName', 'email', 'phone', 'currentLocation', 'dateOfBirth', 'currentDesignation', 'totalYearsExperience', 'careerObjective', 'highestQualification', 'institutionName', 'company', 'position', 'industry', 'resume'];
        break;
      case 'employer':
        user = await Employer.findById(userId);
        requiredFields = ['companyName', 'email', 'contactPerson', 'phone', 'industry', 'location', 'companySize', 'description'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const missingFields = requiredFields.filter(field => !user[field]);
    const completedFields = requiredFields.filter(field => user[field]);
    
    res.json({
      success: true,
      userType,
      userId,
      totalRequiredFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields.length,
      completionPercentage: Math.round((completedFields.length / requiredFields.length) * 100),
      missingFieldsList: missingFields,
      completedFieldsList: completedFields,
      hasIncompleteProfile: missingFields.length > 0
    });
    
  } catch (error) {
    console.error('Profile status error:', error);
    res.status(500).json({ message: 'Failed to get profile status', error: error.message });
  }
});

// Debug route to check user's current password hash
router.get('/debug-password/:userType/:email', async (req, res) => {
  try {
    const { userType, email } = req.params;
    
    let user;
    let Model;
    
    switch (userType) {
      case 'student':
        Model = Student;
        break;
      case 'executive':
        Model = Executive;
        break;
      case 'employer':
        Model = Employer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    user = await Model.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      authMethod: user.authMethod,
      passwordHash: user.password ? user.password.substring(0, 20) + '...' : 'No password'
    });
    
  } catch (error) {
    console.error('Debug password error:', error);
    res.status(500).json({ message: 'Error checking password', error: error.message });
  }
});

// Test route to check what data is being sent for a specific user
router.get('/test-user-data/:userType/:email', async (req, res) => {
  try {
    const { userType, email } = req.params;
    
    let user;
    let Model;
    
    switch (userType) {
      case 'student':
        Model = Student;
        break;
      case 'executive':
        Model = Executive;
        break;
      case 'employer':
        Model = Employer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    user = await Model.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Simulate the same data structure that would be sent during login
    const testResponse = {
      success: true,
      token: 'test-token',
      user: userType === 'student' ? {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: false,
        // Include all profile data at root level for frontend compatibility
        phone: user.phone || null,
        gender: user.gender || 'Other',
        country: user.country || null,
        otherCountry: user.otherCountry || null,
        state: user.state || null,
        otherState: user.otherState || null,
        city: user.city || null,
        otherCity: user.otherCity || null,
        university: user.university || null,
        degree: user.degree || null,
        specialization: user.specialization || null,
        passingDate: user.passingDate || null,
        cgpa: user.cgpa || null,
        skills: user.skills || null,
        jobRole: user.jobRole || null,
        preferredLocation: user.preferredLocation || null,
        currentLocation: user.currentLocation || null,
        linkedin: user.linkedin || null,
        resume: user.resume || null,
        photo: user.photo || null
      } : userType === 'executive' ? {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: false,
        // Include all profile data at root level for frontend compatibility
        phone: user.phone || null,
        gender: user.gender || 'Other',
        country: user.country || null,
        otherCountry: user.otherCountry || null,
        state: user.state || null,
        otherState: user.otherState || null,
        city: user.city || null,
        otherCity: user.otherCity || null,
        currentLocation: user.currentLocation || null,
        dateOfBirth: user.dateOfBirth || null,
        maritalStatus: user.maritalStatus || 'Single',
        currentDesignation: user.currentDesignation || null,
        totalYearsExperience: user.totalYearsExperience || null,
        linkedinProfile: user.linkedinProfile || null,
        careerObjective: user.careerObjective || null,
        highestQualification: user.highestQualification || null,
        institutionName: user.institutionName || null,
        company: user.company || null,
        position: user.position || null,
        industry: user.industry || null,
        resume: user.resume || null,
        photo: user.photo || null
      } : {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        userType,
        isNewUser: false,
        hasIncompleteProfile: false,
        // Include all profile data at root level for frontend compatibility
        contactPerson: user.contactPerson || null,
        phone: user.phone || null,
        industry: user.industry || null,
        location: user.location || null,
        companySize: user.companySize || null,
        website: user.website || null,
        description: user.description || null
      }
    };
    
    res.json({
      message: 'Test user data structure (same as login response)',
      userType,
      email,
      testResponse,
      rawDatabaseData: user.toObject()
    });
    
  } catch (error) {
    console.error('Test user data error:', error);
    res.status(500).json({ message: 'Failed to get test user data', error: error.message });
  }
});

module.exports = router;
