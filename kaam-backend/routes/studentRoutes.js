const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { registerStudent } = require("../controllers/studentController");

router.post("/", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), registerStudent);

module.exports = router;
