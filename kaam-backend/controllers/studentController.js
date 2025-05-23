const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  try {
    const { body, files } = req;

    const newStudent = new Student({
      ...body,
      resume: files.resume?.[0].path || "",
      photo: files.photo?.[0].path || "",
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Error registering student" });
  }
};

module.exports = { registerStudent };
