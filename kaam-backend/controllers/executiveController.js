const Executive = require("../models/Executive");

// POST /api/executives
const registerExecutive = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      designation,
      department,
      experience,
      company,
      location,
      skills,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !designation) {
      return res.status(400).json({ error: "fullName, email, phone, and designation are required." });
    }

    // Normalize skills to array if it's a string (comma separated)
    let skillsArray = [];
    if (typeof skills === "string") {
      skillsArray = skills.split(",").map(skill => skill.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }

    const resumePath = req.files?.resume?.[0]?.path || null;
    const photoPath = req.files?.photo?.[0]?.path || null;

    const executive = new Executive({
      fullName,
      email,
      phone,
      designation,
      department,
      experience,
      company,
      location,
      skills: skillsArray,
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
    const { skills, designation } = req.query;

    // Build filter object
    const filter = {};

    if (skills) {
      const skillsArray = skills.split(",").map(skill => skill.trim());
      filter.skills = { $all: skillsArray };  // Executives must have all these skills
    }

    if (designation) {
      filter.designation = designation;
    }

    const executives = await Executive.find(filter);
    res.status(200).json(executives);
  } catch (error) {
    console.error("Error fetching executives:", error);
    res.status(500).json({ message: "Failed to fetch executives" });
  }
};

module.exports = {
  registerExecutive,
  getAllExecutives,
};
