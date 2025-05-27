const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // import the middleware

const { registerExecutive, getAllExecutives } = require("../controllers/executiveController");

router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  registerExecutive
);

// Protect GET /executives with adminAuth middleware
router.get("/", adminAuth, getAllExecutives);

module.exports = router;
