const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const adminAuth = require("../middleware/adminAuth");

const employerController = require("../controllers/employerController");

// Ensure the upload directory exists
const uploadPath = path.join(__dirname, "../uploads/employerLogos");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Register employer route with logo upload
router.post("/", upload.single("logo"), employerController.registerEmployer);

// Admin-protected GET route (you need to create getAllEmployers in your controller)
router.get("/", adminAuth, employerController.getAllEmployers);

// Update employer by ID (admin only)
router.put("/:id", adminAuth, employerController.updateEmployer);

// Delete employer by ID (admin only)
router.delete("/:id", adminAuth, employerController.deleteEmployer);

module.exports = router;
