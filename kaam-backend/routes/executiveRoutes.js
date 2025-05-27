const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { registerExecutive } = require("../controllers/executiveController"); // ✅ FIXED

router.post("/", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), registerExecutive);

module.exports = router;
