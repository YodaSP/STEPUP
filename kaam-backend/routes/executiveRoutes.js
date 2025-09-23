const express = require("express");
const router = express.Router();
const upload = require("../middleware/s3Upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerExecutive, getAllExecutives, getExecutiveByEmail, getExecutiveLocationStats } = require("../controllers/executiveController");
const { updateExecutive } = require("../controllers/executiveController");
const { deleteExecutive } = require("../controllers/executiveController");
const { getPresignedUrlFromUrl } = require("../utils/s3Utils");
const Executive = require("../models/Executive");

// Test route to verify executive routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Executive routes are working!", timestamp: new Date().toISOString() });
});

router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  registerExecutive
);

// Public route to get executive by email (for CXO login) - MUST come before the general route
router.get("/email/:email", getExecutiveByEmail);

// Public route for executive location stats
router.get("/location-stats", getExecutiveLocationStats);

// Protect GET /executives with adminAuth middleware
router.get("/", adminAuth, getAllExecutives);

// Update executive by ID (no admin required)
router.put(
  "/:id",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  updateExecutive
);

// Delete executive by ID (admin only)
router.delete("/:id", adminAuth, deleteExecutive);

module.exports = router;

// Download endpoints (presigned URLs)
router.get("/:id/resume", async (req, res) => {
  try {
    const e = await Executive.findById(req.params.id);
    if (!e || !e.resume) return res.status(404).json({ message: "Not found" });
    const url = await getPresignedUrlFromUrl(e.resume);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/photo", async (req, res) => {
  try {
    const e = await Executive.findById(req.params.id);
    if (!e || !e.photo) return res.status(404).json({ message: "Not found" });
    const url = await getPresignedUrlFromUrl(e.photo);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
