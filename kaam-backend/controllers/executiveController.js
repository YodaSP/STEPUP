const Executive = require("../models/Executive");

// POST /api/executives
const registerExecutive = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      position, // Changed from designation to match frontend
      department,
      experience,
      company,
      currentLocation, // Changed from location to match frontend
      industry, // Added missing field
      preferredLocation, // Added missing field
      linkedinProfile, // Added missing field
      skills,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !position) { // Changed from designation to position
      return res.status(400).json({
        error: "fullName, email, phone, and position are required.", // Updated error message
      });
    }

    // Normalize skills to trimmed string if present
    const normalizedSkills = typeof skills === "string" ? skills.trim() : "";

    const resumePath = req.files?.resume?.[0]?.path || null;
    const photoPath = req.files?.photo?.[0]?.path || null;

    const executive = new Executive({
      fullName,
      email,
      phone,
      position, // Changed from designation
      department,
      experience,
      company,
      currentLocation, // Changed from location
      industry, // Added missing field
      preferredLocation, // Added missing field
      linkedinProfile, // Added missing field
      skills: normalizedSkills,
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

// GET /api/executives?skills=skill1,skill2&designation=Manager
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

// GET /api/executives/email/:email - Get executive by email (for CXO login)
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

module.exports = {
  registerExecutive,
  getAllExecutives,
  getExecutiveByEmail,
};
