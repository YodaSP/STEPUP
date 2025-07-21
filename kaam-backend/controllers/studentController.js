const Student = require("../models/Student");

// POST /api/students
exports.registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      university,
      degree,
      passingDate,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
    } = req.body;

    const resume = req.files?.resume?.[0]?.path;
    const photo = req.files?.photo?.[0]?.path;

    const student = new Student({
      fullName,
      email,
      phone,
      university,
      degree,
      passingDate,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
      resume,
      photo,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/students
exports.getAllStudents = async (req, res) => {
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

// GET /api/students/email/:email - Get student by email (for student login)
exports.getStudentByEmail = async (req, res) => {
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
exports.getStudentLocationStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
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
    console.error("Error aggregating student location stats:", error);
    res.status(500).json({ message: "Failed to fetch student location stats" });
  }
};
