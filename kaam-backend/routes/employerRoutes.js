const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/s3Upload");
const adminAuth = require("../middleware/adminAuth");

const employerController = require("../controllers/employerController");
const { getPresignedUrlFromUrl } = require("../utils/s3Utils");
const Employer = require("../models/Employer");

// Ensure the upload directory exists
const uploadPath = path.join(__dirname, "../uploads/employerLogos");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// S3-based upload (no local storage)

// Register employer route with logo upload
router.post("/", upload.fields([{ name: "logo", maxCount: 1 }]), employerController.registerEmployer);

// Admin-protected GET route (you need to create getAllEmployers in your controller)
router.get("/", adminAuth, employerController.getAllEmployers);

// Update employer by ID (admin only)
router.put("/:id", adminAuth, employerController.updateEmployer);

// Delete employer by ID (admin only)
router.delete("/:id", adminAuth, employerController.deleteEmployer);

module.exports = router;

// Download endpoint for employer logo
router.get("/:id/logo", async (req, res) => {
  try {
    const emp = await Employer.findById(req.params.id);
    if (!emp || !emp.logo) return res.status(404).json({ message: "Not found" });
    const url = await getPresignedUrlFromUrl(emp.logo);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
