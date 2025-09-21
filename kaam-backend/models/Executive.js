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
  age: { type: Number },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], default: 'Single' },
  currentDesignation: { type: String, required: true },
  totalYearsExperience: { type: String, required: true },
  linkedinProfile: { type: String },
  careerObjective: { type: String, required: true },
  highestQualification: { type: String, required: true },
  institutionName: { type: String, required: true },
  yearOfCompletion: { type: String },
  specialization: { type: String },
  additionalCertifications: { type: String },
  workExperience: { type: [mongoose.Schema.Types.Mixed], default: [] },
  technicalSkills: { type: String },
  softSkills: { type: String },
  toolsTechnologies: { type: String },
  languagesKnown: { type: String },
  awardsRecognition: { type: String },
  hobbiesInterests: { type: String },
  professionalMemberships: { type: String },
  company: { type: String, required: true },
  position: { type: String, required: true },
  industry: { type: String, required: true },
  experience: { type: String },
  preferredLocation: { type: String },
  skills: { type: String },
  department: { type: String },
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

// Index for efficient queries (email already has unique index from unique: true)
executiveSchema.index({ googleId: 1 });

module.exports = mongoose.model("Executive", executiveSchema);
