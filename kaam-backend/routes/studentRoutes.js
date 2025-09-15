const express = require("express");
const router = express.Router();
const upload = require("../middleware/s3Upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerStudent, getAllStudents, getStudentByEmail, getStudentLocationStats } = require("../controllers/studentController");
const { updateStudent } = require("../controllers/studentController");
const { deleteStudent } = require("../controllers/studentController");
const { getPresignedUrlFromUrl } = require("../utils/s3Utils");
const Student = require("../models/Student");

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

// Update student by ID (no admin required)
router.put(
  "/:id",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  updateStudent
);

// Delete student by ID (admin only)
router.delete("/:id", adminAuth, deleteStudent);

// Public route to get student by email (for student login)
router.get("/email/:email", getStudentByEmail);

// Public route for student location stats
router.get("/location-stats", getStudentLocationStats);

module.exports = router;

// Download endpoints (presigned URLs)
router.get("/:id/resume", async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s || !s.resume) return res.status(404).json({ message: "Not found" });
    const url = await getPresignedUrlFromUrl(s.resume);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id/photo", async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s || !s.photo) return res.status(404).json({ message: "Not found" });
    const url = await getPresignedUrlFromUrl(s.photo);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

