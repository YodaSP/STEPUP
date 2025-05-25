const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  university: String,
  degree: String, // Replaces qualification and specialization
  passingDate: String, // Can also be Date type if needed
  skills: String,
  jobRole: String,
  preferredLocation: String,
  currentLocation: String, // NEW
  resume: String,
  photo: String,
});

module.exports = mongoose.model("Student", studentSchema);
