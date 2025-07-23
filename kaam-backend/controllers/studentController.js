const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  try {
    console.log('Received student registration:', req.body, req.files);
    const {
      fullName,
      email,
      phone,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      university,
      degree,
      specialization,
      passingDate,
      cgpa,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
      linkedin,
      gender,
    } = req.body;

    const resume = req.files?.resume?.[0]?.path;
    const photo = req.files?.photo?.[0]?.path;

    // Validate required fields (add country, state, city for new registrations)
    if (!fullName || !email || !phone || !country || !state || !city || !university || !degree || !passingDate || !skills || !jobRole || !preferredLocation || !currentLocation || !resume || !gender) {
      return res.status(400).json({ message: "All required fields must be provided, including gender." });
    }
    // Defensive gender check
    const allowedGenders = ['Male', 'Female', 'Other'];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ message: "Gender must be one of: Male, Female, Other." });
    }
    // Validate resume file type
    if (req.files?.resume && req.files.resume[0]?.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Resume must be a PDF." });
    }
    // Validate photo file type if present
    if (req.files?.photo && req.files.photo[0]?.mimetype && !req.files.photo[0].mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Profile photo must be an image." });
    }

    const student = new Student({
      fullName,
      email,
      phone,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      university,
      degree,
      specialization,
      passingDate,
      cgpa,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
      resume,
      photo,
      linkedin,
      gender,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error registering student:", error);
    // Return actual error message for development
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    console.log("📚 getAllStudents controller called");
    const students = await Student.find();
    console.log("📊 Found", students.length, "students");
    console.log("📋 Students data:", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by email:", error);
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

// GET /api/students/location-stats - Get student count grouped by location
const getStudentLocationStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      { $group: { _id: "$currentLocation", count: { $sum: 1 } } },
      { $project: { _id: 0, location: "$_id", count: 1 } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting student location stats:", error);
    res.status(500).json({ message: "Failed to get location stats" });
  }
};

// PUT /api/students/:id - Update student by ID
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (req.body.gender) update.gender = req.body.gender;
    // If files are present, add them
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
    // Allow updating all new fields
    const updated = await Student.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
};

// DELETE /api/students/:id - Delete student by ID
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentByEmail,
  getStudentLocationStats,
  updateStudent,
  deleteStudent,
};
