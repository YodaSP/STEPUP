const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  qualification: String,
  university: String,
  specialization: String,
  passingYear: String,
  skills: String,
  jobRole: String,
  location: String,
  resume: String, // File path
  photo: String,  // File path
});

module.exports = mongoose.model("Student", studentSchema);
