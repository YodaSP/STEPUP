const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerExecutive, getAllExecutives, getExecutiveByEmail } = require("../controllers/executiveController");

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

// Protect GET /executives with adminAuth middleware
router.get("/", adminAuth, getAllExecutives);

module.exports = router;
