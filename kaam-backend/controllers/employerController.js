const Employer = require("../models/Employer");

// Controller function to handle Employer registration
exports.registerEmployer = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      companySize,
      website,
      location,
    } = req.body;

    const logo = req.files?.resume?.[0]?.path;

    if (!companyName || !contactPerson || !email || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newEmployer = new Employer({
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      companySize,
      website,
      location,
      logo,
    });

    await newEmployer.save();

    return res.status(201).json({ message: "Employer registered successfully" });
  } catch (error) {
    console.error("Employer registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Now correctly defined outside and exported
exports.getAllEmployers = async (req, res) => {
  try {
    console.log("🏢 getAllEmployers controller called");
    const employers = await Employer.find().sort({ createdAt: -1 });
    console.log("📊 Found", employers.length, "employers");
    console.log("📋 Employers data:", employers);
    res.status(200).json(employers);
  } catch (error) {
    console.error("❌ Error fetching employers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
