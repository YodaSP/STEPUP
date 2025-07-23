const mongoose = require("mongoose");

const ExecutiveSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  country: { type: String, required: false },
  otherCountry: { type: String },
  state: { type: String, required: false },
  otherState: { type: String },
  city: { type: String, required: false },
  otherCity: { type: String },
  position: String, // Changed from designation to match frontend
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  department: String,
  experience: String,
  company: String,
  currentLocation: String, // Changed from location to match frontend
  industry: String, // Added missing field
  preferredLocation: String, // Added missing field
  linkedinProfile: String, // Added missing field
  skills: String,
  resume: String,
  photo: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Executive", ExecutiveSchema);
