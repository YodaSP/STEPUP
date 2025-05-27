const mongoose = require("mongoose");

const ExecutiveSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  designation: String,
  department: String,
  experience: String,
  company: String,
  location: String,
  skills: String,
  resume: String,
  photo: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Executive", ExecutiveSchema);
