const Employer = require("../models/Employer");

// Controller function to handle Employer registration
const registerEmployer = async (req, res) => {
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

    const logo = (req.files?.logo?.[0]?.location || req.files?.logo?.[0]?.path);

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
const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    res.status(200).json(employers);
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/employers/:id - Update employer by ID
const updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Employer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating employer:", error);
    res.status(500).json({ message: "Failed to update employer" });
  }
};

// DELETE /api/employers/:id - Delete employer by ID
const deleteEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employer.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json({ message: "Employer deleted successfully" });
  } catch (error) {
    console.error("Error deleting employer:", error);
    res.status(500).json({ message: "Failed to delete employer" });
  }
};

module.exports = {
  registerEmployer,
  getAllEmployers,
  updateEmployer,
  deleteEmployer,
};
