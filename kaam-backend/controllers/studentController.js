const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

const registerStudent = async (req, res) => {
  try {
    console.log('Received student registration:', req.body, req.files);
    const {
      fullName,
      email,
      phone,
      password,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      university,
      degree,
      specialization,
      passingDate,
      cgpa,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
      linkedin,
      gender,
    } = req.body;

    // With multer-s3, locations are available at .location (public URL) and .key/.bucket
    const resume = req.files?.resume?.[0]?.location || req.files?.resume?.[0]?.path;
    const photo = req.files?.photo?.[0]?.location || req.files?.photo?.[0]?.path;

    // Validate required fields (add country, state, city for new registrations)
    if (!fullName || !email || !phone || !country || !state || !city || !university || !degree || !passingDate || !skills || !jobRole || !preferredLocation || !currentLocation || !resume || !gender) {
      return res.status(400).json({ message: "All required fields must be provided, including gender." });
    }
    
    // Password validation - simplified (no strict requirements)
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    // Defensive gender check
    const allowedGenders = ['Male', 'Female', 'Other'];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ message: "Gender must be one of: Male, Female, Other." });
    }
    // Validate resume file type
    if (req.files?.resume && req.files.resume[0]?.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Resume must be a PDF." });
    }
    // Validate photo file type if present
    if (req.files?.photo && req.files.photo[0]?.mimetype && !req.files.photo[0].mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Profile photo must be an image." });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const student = new Student({
      fullName,
      email,
      phone,
      password: hashedPassword,
      country,
      otherCountry,
      state,
      otherState,
      city,
      otherCity,
      university,
      degree,
      specialization,
      passingDate,
      cgpa,
      skills,
      jobRole,
      preferredLocation,
      currentLocation,
      resume,
      photo,
      linkedin,
      gender,
      authMethod: 'password',
      isEmailVerified: true, // Since they're registering with password
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error registering student:", error);
    // Return actual error message for development
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    console.log("📚 getAllStudents controller called");
    const students = await Student.find();
    console.log("📊 Found", students.length, "students");
    console.log("📋 Students data:", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by email:", error);
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

// GET /api/students/location-stats - Get student count grouped by location
const getStudentLocationStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      { $group: { _id: "$currentLocation", count: { $sum: 1 } } },
      { $project: { _id: 0, location: "$_id", count: 1 } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting student location stats:", error);
    res.status(500).json({ message: "Failed to get location stats" });
  }
};

// PUT /api/students/:id - Update student by ID
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, resume, ...bodyWithoutFiles } = req.body;
    const update = { ...bodyWithoutFiles };
    
    console.log('🔍 Update Student Debug - ID:', id);
    console.log('🔍 Update Student Debug - Request body:', req.body);
    console.log('🔍 Update Student Debug - Request files:', req.files);
    console.log('🔍 Update Student Debug - Body without files:', bodyWithoutFiles);
    console.log('🔍 Update Student Debug - Photo from body:', photo, typeof photo);
    console.log('🔍 Update Student Debug - Resume from body:', resume, typeof resume);
    
    // Handle password update if provided
    if (update.password && update.password.trim() !== '') {
      console.log('🔍 Update Student Debug - Password provided, hashing...');
      const saltRounds = 12;
      update.password = await bcrypt.hash(update.password, saltRounds);
      update.authMethod = 'both'; // Allow both Google and password after setting password
      console.log('🔍 Update Student Debug - Password hashed, authMethod set to both');
    } else if (update.password === '') {
      console.log('🔍 Update Student Debug - Empty password, removing from update');
      delete update.password; // Don't update password if empty
    }
    
    if (req.body.gender) update.gender = req.body.gender;
    // If files are present, add them
    if (req.files?.resume) {
      if (req.files.resume[0]?.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF." });
      }
      // Delete old resume from S3 if replacing
      try {
        const { deleteObjectFromUrl } = require('../utils/s3Utils');
        if (update.resume && req.body.currentResumeUrl) {
          await deleteObjectFromUrl(req.body.currentResumeUrl);
        }
      } catch (_e) {}
      update.resume = req.files.resume[0].location || req.files.resume[0].path;
    }
    if (req.files?.photo) {
      if (req.files.photo[0]?.mimetype && !req.files.photo[0].mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Profile photo must be an image." });
      }
      // Delete old photo from S3 if replacing
      try {
        const { deleteObjectFromUrl } = require('../utils/s3Utils');
        if (update.photo && req.body.currentPhotoUrl) {
          await deleteObjectFromUrl(req.body.currentPhotoUrl);
        }
      } catch (_e) {}
      update.photo = req.files.photo[0].location || req.files.photo[0].path;
    }
    
    console.log('🔍 Update Student Debug - Final update object:', update);
    
    // Allow updating all new fields
    const updated = await Student.findByIdAndUpdate(id, update, { new: true, runValidators: false });
    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log('🔍 Update Student Debug - Student updated successfully');
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating student:", error);
    console.error("❌ Error details:", error.message);
    if (error.name === 'ValidationError') {
      console.error("❌ Validation errors:", error.errors);
    }
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

// DELETE /api/students/:id - Delete student by ID
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentByEmail,
  getStudentLocationStats,
  updateStudent,
  deleteStudent,
};
