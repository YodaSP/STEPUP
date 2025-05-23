const express = require("express");
const router = express.Router();
const Executive = require("../models/Executive");

// Add new executive
router.post("/", async (req, res) => {
  try {
    const executive = new Executive(req.body);
    await executive.save();
    res.status(201).json(executive);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all executives
router.get("/", async (req, res) => {
  try {
    const executives = await Executive.find();
    res.json(executives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
