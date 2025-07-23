const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  industry: String,
  companySize: String,
  website: String,
  location: String,
  logo: String, // Path to logo file
}, {
  timestamps: true,
});

module.exports = mongoose.model("Employer", employerSchema);
