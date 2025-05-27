const Executive = require("../models/Executive");

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
      skills,
      resume: resumePath,
      photo: photoPath,
    });

    await executive.save(); // ✅ Save to MongoDB

    res.status(200).json({ message: "Executive registered successfully!" });
  } catch (error) {
    console.error("❌ Executive registration failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerExecutive };
