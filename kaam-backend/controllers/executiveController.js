const Executive = require("../models/Executive");
const bcrypt = require("bcryptjs");

const registerExecutive = async (req, res) => {
  try {
    console.log('🔍 Executive Registration Debug - Request body:', req.body);
    console.log('🔍 Executive Registration Debug - Files:', req.files);
    
    const {
      // Section 1: Personal Information
      fullName,
      email,
      password,
      phone,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      currentLocation,
      dateOfBirth,
      maritalStatus,
      gender,

      // Section 2: Professional Information
      currentDesignation,
      totalYearsExperience,
      linkedinProfile,
      careerObjective,

      // Section 3: Education
      highestQualification,
      institutionName,
      yearOfCompletion,
      specialization,
      additionalCertifications,

      // Section 4: Work Experience
      workExperience,

      // Section 5: Skills
      technicalSkills,
      softSkills,
      toolsTechnologies,
      languagesKnown,

      // Section 6: Additional Information
      awardsRecognition,
      hobbiesInterests,
      professionalMemberships,

      // Legacy fields
      position,
      company,
      industry,
      experience,
      preferredLocation,
      skills,
      department,
    } = req.body;

    // Basic validation for required fields
    console.log('🔍 Executive Registration Debug - Validating required fields...');
    console.log('🔍 Executive Registration Debug - fullName:', fullName);
    console.log('🔍 Executive Registration Debug - email:', email);
    console.log('🔍 Executive Registration Debug - phone:', phone);
    console.log('🔍 Executive Registration Debug - currentLocation:', currentLocation);
    console.log('🔍 Executive Registration Debug - password:', password ? 'provided' : 'missing');
    
    if (!fullName || !email || !phone || !currentLocation) {
      console.log('❌ Executive Registration Debug - Basic validation failed');
      return res.status(400).json({ message: "Name, email, phone, and location are required fields." });
    }
    
    // Password validation - simplified (no strict requirements)
    if (!password) {
      console.log('❌ Executive Registration Debug - Password validation failed');
      return res.status(400).json({ message: "Password is required" });
    }
    
    // Additional required field validations based on the Executive model
    console.log('🔍 Executive Registration Debug - Validating additional required fields...');
    console.log('🔍 Executive Registration Debug - dateOfBirth:', dateOfBirth);
    console.log('🔍 Executive Registration Debug - currentDesignation:', currentDesignation);
    console.log('🔍 Executive Registration Debug - totalYearsExperience:', totalYearsExperience);
    console.log('🔍 Executive Registration Debug - careerObjective:', careerObjective);
    console.log('🔍 Executive Registration Debug - highestQualification:', highestQualification);
    console.log('🔍 Executive Registration Debug - institutionName:', institutionName);
    console.log('🔍 Executive Registration Debug - company:', company);
    console.log('🔍 Executive Registration Debug - position:', position);
    console.log('🔍 Executive Registration Debug - industry:', industry);
    console.log('🔍 Executive Registration Debug - resume file:', req.files?.resume?.[0] ? 'provided' : 'missing');
    
    if (!dateOfBirth || dateOfBirth.trim() === '') {
      console.log('❌ Executive Registration Debug - Date of birth validation failed');
      return res.status(400).json({ message: "Date of birth is required" });
    }
    if (!currentDesignation || currentDesignation.trim() === '') {
      console.log('❌ Executive Registration Debug - Current designation validation failed');
      return res.status(400).json({ message: "Current designation is required" });
    }
    if (!totalYearsExperience || totalYearsExperience.trim() === '') {
      console.log('❌ Executive Registration Debug - Total years experience validation failed');
      return res.status(400).json({ message: "Total years of experience is required" });
    }
    if (!careerObjective || careerObjective.trim() === '') {
      console.log('❌ Executive Registration Debug - Career objective validation failed');
      return res.status(400).json({ message: "Career objective is required" });
    }
    if (!highestQualification || highestQualification.trim() === '') {
      console.log('❌ Executive Registration Debug - Highest qualification validation failed');
      return res.status(400).json({ message: "Highest qualification is required" });
    }
    if (!institutionName || institutionName.trim() === '') {
      console.log('❌ Executive Registration Debug - Institution name validation failed');
      return res.status(400).json({ message: "Institution name is required" });
    }
    if (!company || company.trim() === '') {
      console.log('❌ Executive Registration Debug - Company validation failed');
      return res.status(400).json({ message: "Company is required" });
    }
    if (!position || position.trim() === '') {
      console.log('❌ Executive Registration Debug - Position validation failed');
      return res.status(400).json({ message: "Position is required" });
    }
    if (!industry || industry.trim() === '') {
      console.log('❌ Executive Registration Debug - Industry validation failed');
      return res.status(400).json({ message: "Industry is required" });
    }
    if (!req.files?.resume?.[0]) {
      console.log('❌ Executive Registration Debug - Resume file validation failed');
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Parse work experience if it's a string
    let parsedWorkExperience = [];
    if (workExperience) {
      try {
        parsedWorkExperience = typeof workExperience === 'string' ? JSON.parse(workExperience) : workExperience;
      } catch (error) {
        console.log("Work experience parsing failed, using as string");
        parsedWorkExperience = [];
      }
    }

    // Normalize skills fields
    const normalizedTechnicalSkills = typeof technicalSkills === "string" ? technicalSkills.trim() : "";
    const normalizedSoftSkills = typeof softSkills === "string" ? softSkills.trim() : "";
    const normalizedToolsTechnologies = typeof toolsTechnologies === "string" ? toolsTechnologies.trim() : "";
    const normalizedLanguagesKnown = typeof languagesKnown === "string" ? languagesKnown.trim() : "";
    const normalizedSkills = typeof skills === "string" ? skills.trim() : "";

    const resumePath = (req.files?.resume?.[0]?.location || req.files?.resume?.[0]?.path) || null;
    const photoPath = (req.files?.photo?.[0]?.location || req.files?.photo?.[0]?.path) || null;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const executive = new Executive({
      // Section 1: Personal Information
      fullName,
      email,
      phone,
      password: hashedPassword,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      currentLocation,
      dateOfBirth,
      maritalStatus,
      gender,

      // Section 2: Professional Information
      currentDesignation: currentDesignation || position, // Use currentDesignation or fallback to position
      totalYearsExperience: totalYearsExperience || experience, // Use totalYearsExperience or fallback to experience
      linkedinProfile,
      careerObjective,

      // Section 3: Education
      highestQualification,
      institutionName,
      yearOfCompletion,
      specialization,
      additionalCertifications,

      // Section 4: Work Experience
      workExperience: parsedWorkExperience,

      // Section 5: Skills
      technicalSkills: normalizedTechnicalSkills,
      softSkills: normalizedSoftSkills,
      toolsTechnologies: normalizedToolsTechnologies,
      languagesKnown: normalizedLanguagesKnown,

      // Section 6: Additional Information
      awardsRecognition,
      hobbiesInterests,
      professionalMemberships,

      // Legacy fields (for backward compatibility)
      position: currentDesignation || position,
      company,
      industry,
      experience: totalYearsExperience || experience,
      preferredLocation,
      skills: normalizedSkills,
      department,

      // Files
      resume: resumePath,
      photo: photoPath,
      
      // Authentication fields
      authMethod: 'password',
      isEmailVerified: true, // Since they're registering with password
    });

    await executive.save();
    console.log('✅ Executive Registration Debug - Executive saved successfully!');

    res.status(201).json({ message: "Executive registered successfully!" });
  } catch (error) {
    console.error("❌ Executive registration failed:", error);
    console.error("❌ Executive Registration Debug - Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllExecutives = async (req, res) => {
  try {
    console.log("🧑‍💼 getAllExecutives controller called");
    const { skills, designation } = req.query;

    // Build filter object
    const filter = {};

    if (skills) {
      // Regex to match any skill keywords in the skills string (case-insensitive)
      filter.skills = { $regex: skills.split(",").join("|"), $options: "i" };
    }

    if (designation) {
      filter.position = designation; // Changed from designation to position
    }

    const executives = await Executive.find(filter);
    console.log("📊 Found", executives.length, "executives");
    console.log("📋 Executives data:", executives);
    res.status(200).json(executives);
  } catch (error) {
    console.error("❌ Error fetching executives:", error);
    res.status(500).json({ message: "Failed to fetch executives" });
  }
};

const getExecutiveByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("🔍 CXO Login: Searching for executive with email:", email);
    
    const executive = await Executive.findOne({ email });
    console.log("📋 CXO Login: Executive found:", executive ? "Yes" : "No");
    
    if (!executive) {
      console.log("❌ CXO Login: Executive not found for email:", email);
      return res.status(404).json({ message: "Executive not found" });
    }
    
    console.log("✅ CXO Login: Executive found:", executive.fullName);
    res.status(200).json(executive);
  } catch (error) {
    console.error("❌ CXO Login: Error fetching executive by email:", error);
    res.status(500).json({ message: "Failed to fetch executive" });
  }
};

const getExecutiveLocationStats = async (req, res) => {
  try {
    const stats = await Executive.aggregate([
      {
        $group: {
          _id: "$currentLocation",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          location: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error aggregating executive location stats:", error);
    res.status(500).json({ message: "Failed to fetch executive location stats" });
  }
};

const updateExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, resume, ...bodyWithoutFiles } = req.body;
    const update = { ...bodyWithoutFiles };
    
    console.log('🔍 Update Executive Debug - ID:', id);
    console.log('🔍 Update Executive Debug - Request body:', req.body);
    console.log('🔍 Update Executive Debug - Request files:', req.files);
    console.log('🔍 Update Executive Debug - Body without files:', bodyWithoutFiles);
    console.log('🔍 Update Executive Debug - Photo from body:', photo, typeof photo);
    console.log('🔍 Update Executive Debug - Resume from body:', resume, typeof resume);
    
    // Handle password update if provided
    if (update.password && update.password.trim() !== '') {
      console.log('🔍 Update Executive Debug - Password provided, hashing...');
      const saltRounds = 12;
      update.password = await bcrypt.hash(update.password, saltRounds);
      update.authMethod = 'both'; // Allow both Google and password after setting password
      console.log('🔍 Update Executive Debug - Password hashed, authMethod set to both');
    } else if (update.password === '') {
      console.log('🔍 Update Executive Debug - Empty password, removing from update');
      delete update.password; // Don't update password if empty
    }

    // Handle file uploads
    if (req.files?.resume) {
      if (req.files.resume[0]?.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF." });
      }
      try {
        const { deleteObjectFromUrl } = require('../utils/s3Utils');
        if (update.resume && req.body.currentResumeUrl) {
          await deleteObjectFromUrl(req.body.currentResumeUrl);
        }
      } catch (_e) {}
      update.resume = req.files.resume[0].location || req.files.resume[0].path;
    }
    if (req.files?.photo) {
      if (req.files.photo[0]?.mimetype && !req.files.photo[0].mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Profile photo must be an image." });
      }
      try {
        const { deleteObjectFromUrl } = require('../utils/s3Utils');
        if (update.photo && req.body.currentPhotoUrl) {
          await deleteObjectFromUrl(req.body.currentPhotoUrl);
        }
      } catch (_e) {}
      update.photo = req.files.photo[0].location || req.files.photo[0].path;
    }

    // Parse work experience if it's a string
    if (update.workExperience) {
      try {
        update.workExperience = typeof update.workExperience === 'string' ? JSON.parse(update.workExperience) : update.workExperience;
      } catch (error) {
        console.log("Work experience parsing failed, using as string");
        update.workExperience = [];
      }
    }

    // Handle legacy field mappings
    if (update.currentDesignation && !update.position) {
      update.position = update.currentDesignation;
    }
    if (update.totalYearsExperience && !update.experience) {
      update.experience = update.totalYearsExperience;
    }

    // Validate required fields (for update, only if present)
    const requiredFields = [
      "fullName", "email", "phone", "currentLocation"
    ];
    for (const field of requiredFields) {
      if (field in update && (!update[field] || update[field].trim() === "")) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // If resume is being updated, ensure it's present
    if ("resume" in update && !update.resume) {
      return res.status(400).json({ message: "Resume (PDF) is required." });
    }

    console.log('🔍 Update Executive Debug - Final update object:', update);

    // Allow updating all new fields
    const updated = await Executive.findByIdAndUpdate(id, update, { new: true, runValidators: false });
    if (!updated) {
      return res.status(404).json({ message: "Executive not found" });
    }
    console.log('🔍 Update Executive Debug - Executive updated successfully');
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating executive:", error);
    console.error("❌ Error details:", error.message);
    if (error.name === 'ValidationError') {
      console.error("❌ Validation errors:", error.errors);
    }
    res.status(500).json({ message: "Failed to update executive", error: error.message });
  }
};

// DELETE /api/executives/:id - Delete executive by ID
const deleteExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Executive.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Executive not found" });
    }
    res.status(200).json({ message: "Executive deleted successfully" });
  } catch (error) {
    console.error("Error deleting executive:", error);
    res.status(500).json({ message: "Failed to delete executive" });
  }
};

module.exports = {
  registerExecutive,
  getAllExecutives,
  getExecutiveByEmail,
  getExecutiveLocationStats,
  updateExecutive,
  deleteExecutive,
};
