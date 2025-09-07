const mongoose = require("mongoose");

const executiveSchema = new mongoose.Schema({
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
  currentLocation: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], default: 'Single' },
  currentDesignation: { type: String, required: true },
  totalYearsExperience: { type: String, required: true },
  linkedinProfile: { type: String },
  careerObjective: { type: String, required: true },
  highestQualification: { type: String, required: true },
  institutionName: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  industry: { type: String, required: true },
  resume: { type: String, required: true },
  photo: { type: String },
  // Authentication fields
  googleId: { type: String, sparse: true },
  password: { type: String },
  authMethod: { type: String, enum: ['google', 'password', 'both'], default: 'google' },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date }
}, {
  timestamps: true,
});

// Index for efficient queries
executiveSchema.index({ email: 1 });
executiveSchema.index({ googleId: 1 });

module.exports = mongoose.model("Executive", executiveSchema);
