const mongoose = require("mongoose");

const ExecutiveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
   phone: { type: String, required: true },
   designation: { type: String },
   department: { type: String },
   experience: { type: String },
   company: { type: String, required: true },
    location: { type: String },
    skills: { type: String },
    resume: { type: String }, // URL or path to the resume file
    photo: { type: String }, // URL or path to the photo file
    
    
    
  
  
  // Add more if you want
});

module.exports = mongoose.model("Executive", ExecutiveSchema);
