const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerStudent, getAllStudents } = require("../controllers/studentController");

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

module.exports = router;
