const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerExecutive, getAllExecutives, getExecutiveByEmail, getExecutiveLocationStats } = require("../controllers/executiveController");
const { updateExecutive } = require("../controllers/executiveController");
const { deleteExecutive } = require("../controllers/executiveController");

// Test route to verify executive routes are working
router.get("/test", (req, res) => {
  console.log("🧪 Executive test route called");
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
