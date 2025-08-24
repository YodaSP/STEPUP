const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  companySize: { type: String, required: true },
  website: { type: String },
  description: { type: String, required: true },
  // Authentication fields
  googleId: { type: String, sparse: true },
  password: { type: String },
  authMethod: { type: String, enum: ['google', 'password'], default: 'google' },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, {
  timestamps: true,
});

// Index for efficient queries
employerSchema.index({ email: 1 });
employerSchema.index({ googleId: 1 });

module.exports = mongoose.model("Employer", employerSchema);
