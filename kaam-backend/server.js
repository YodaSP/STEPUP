const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const studentRoutes = require("./routes/studentRoutes");
const executiveRoutes = require("./routes/executiveRoutes");
const employerRoutes = require("./routes/employerRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// MongoDB Atlas connection
const mongoURI = "mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/executives", executiveRoutes);
app.use("/api/employers", employerRoutes);

// Combined stats endpoint for frontend trending panel
app.get("/api/stats/registrations-by-location", async (req, res) => {
  try {
    // Fetch student and executive location stats in parallel
    const [studentRes, executiveRes] = await Promise.all([
      mongoose.connection.collection("students").aggregate([
        { $group: { _id: "$currentLocation", students: { $sum: 1 } } },
        { $project: { _id: 0, location: "$_id", students: 1 } },
      ]).toArray(),
      mongoose.connection.collection("executives").aggregate([
        { $group: { _id: "$currentLocation", cxos: { $sum: 1 } } },
        { $project: { _id: 0, location: "$_id", cxos: 1 } },
      ]).toArray(),
    ]);

    // Merge by location
    const statsMap = {};
    studentRes.forEach(({ location, students }) => {
      if (!location) return;
      statsMap[location] = { location, students, cxos: 0 };
    });
    executiveRes.forEach(({ location, cxos }) => {
      if (!location) return;
      if (!statsMap[location]) statsMap[location] = { location, students: 0, cxos };
      else statsMap[location].cxos = cxos;
    });
    const merged = Object.values(statsMap).sort((a, b) => (b.students + b.cxos) - (a.students + a.cxos));
    res.json(merged);
  } catch (err) {
    console.error("Error in /api/stats/registrations-by-location:", err);
    res.status(500).json({ message: "Failed to fetch registration stats" });
  }
});

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  console.log("🧪 Test endpoint called");
  res.json({ message: "Backend server is working!", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
