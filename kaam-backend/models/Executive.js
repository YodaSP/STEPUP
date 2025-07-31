const mongoose = require("mongoose");

const ExecutiveSchema = new mongoose.Schema({
  // Section 1: Personal Information
  fullName: String,
  email: String,
  phone: String,
  country: { type: String, required: false },
  otherCountry: { type: String },
  state: { type: String, required: false },
  otherState: { type: String },
  city: { type: String, required: false },
  otherCity: { type: String },
  currentLocation: String,
  dateOfBirth: String,
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'], default: 'Other' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },

  // Section 2: Professional Information
  currentDesignation: String, // Current job title
  totalYearsExperience: String, // Total years of experience
  linkedinProfile: String,
  careerObjective: String, // Professional summary/objective

  // Section 3: Education
  highestQualification: String, // Bachelor's, Master's, MBA, etc.
  institutionName: String, // University/College name
  yearOfCompletion: String, // Graduation year
  specialization: String, // Field of study/Major
  additionalCertifications: String, // Professional certifications

  // Section 4: Work Experience
  workExperience: [{
    companyName: String,
    jobTitle: String,
    startDate: String,
    endDate: String, // or "Present"
    keyResponsibilities: String,
    majorAchievements: String
  }],

  // Section 5: Skills
  technicalSkills: String,
  softSkills: String,
  toolsTechnologies: String,
  languagesKnown: String,

  // Section 6: Additional Information
  awardsRecognition: String,
  hobbiesInterests: String,
  professionalMemberships: String,

  // Legacy fields (keeping for backward compatibility)
  position: String, // Alias for currentDesignation
  company: String, // Current company
  industry: String,
  experience: String, // Alias for totalYearsExperience
  preferredLocation: String,
  skills: String, // Legacy skills field
  department: String,

  // Files
  resume: String,
  photo: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Executive", ExecutiveSchema);
