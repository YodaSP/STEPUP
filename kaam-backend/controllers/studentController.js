const Student = require("../models/Student");

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

