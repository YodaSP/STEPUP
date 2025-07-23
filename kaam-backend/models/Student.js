const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  country: { type: String, required: false },
  otherCountry: { type: String },
  state: { type: String, required: false },
  otherState: { type: String },
  city: { type: String, required: false },
  otherCity: { type: String },
  university: { type: String, required: true },
  degree: { type: String, required: true },
  specialization: { type: String },
  passingDate: { type: String, required: true },
  cgpa: { type: String },
  skills: { type: String, required: true },
  jobRole: { type: String, required: true },
  preferredLocation: { type: String, required: true },
  currentLocation: { type: String, required: true },
  resume: { type: String, required: true },
  photo: { type: String },
  linkedin: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Student", studentSchema);
