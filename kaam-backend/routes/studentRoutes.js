const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerStudent, getAllStudents, getStudentByEmail, getStudentLocationStats } = require("../controllers/studentController");

router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  registerStudent
);

// Protect GET /students with adminAuth middleware
router.get("/", adminAuth, getAllStudents);

// Public route to get student by email (for student login)
router.get("/email/:email", getStudentByEmail);

// Public route for student location stats
router.get("/location-stats", getStudentLocationStats);

module.exports = router;
