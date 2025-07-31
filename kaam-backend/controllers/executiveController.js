const Executive = require("../models/Executive");

const registerExecutive = async (req, res) => {
  try {
    const {
      // Section 1: Personal Information
      fullName,
      email,
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
    if (!fullName || !email || !phone || !currentLocation) {
      return res.status(400).json({ message: "Name, email, phone, and location are required fields." });
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

    const resumePath = req.files?.resume?.[0]?.path || null;
    const photoPath = req.files?.photo?.[0]?.path || null;

    const executive = new Executive({
      // Section 1: Personal Information
      fullName,
      email,
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
    });

    await executive.save();

    res.status(201).json({ message: "Executive registered successfully!" });
  } catch (error) {
    console.error("❌ Executive registration failed:", error);
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
    const update = { ...req.body };
    
    // Handle file uploads
    if (req.files?.resume) {
      if (req.files.resume[0]?.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF." });
      }
      update.resume = req.files.resume[0].path;
    }
    if (req.files?.photo) {
      if (req.files.photo[0]?.mimetype && !req.files.photo[0].mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Profile photo must be an image." });
      }
      update.photo = req.files.photo[0].path;
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

    // Allow updating all new fields
    const updated = await Executive.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Executive not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating executive:", error);
    res.status(500).json({ message: "Failed to update executive" });
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
