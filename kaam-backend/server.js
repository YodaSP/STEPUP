const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const studentRoutes = require("./routes/studentRoutes");
const executiveRoutes = require("./routes/executiveRoutes");
const employerRoutes = require("./routes/employerRoutes");
const authRoutes = require("./routes/authRoutes");



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
app.use("/api/auth", authRoutes);

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

    // Function to normalize location (extract city name)
    const normalizeLocation = (location) => {
      if (!location) return null;
      
      // Special handling for Delhi variations
      const lowerLocation = location.toLowerCase();
      if (lowerLocation.includes('Delhi') || lowerLocation.includes('ncr') || lowerLocation.includes('new delhi')) {
        return 'delhi';
      }
      
      // If location contains comma, extract the city part (after comma)
      if (location.includes(',')) {
        const parts = location.split(',').map(part => part.trim());
        // Return the last part (city) and capitalize it
        const city = parts[parts.length - 1];
        const lowerCity = city.toLowerCase();
        if (lowerCity.includes('Delhi') || lowerCity.includes('ncr') || lowerCity.includes('new delhi')) {
          return 'delhi';
        }
        return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }
      
      // If no comma, return the location as is, capitalized
      return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
    };

    // Merge by normalized location
    const statsMap = {};
    
    // Process student data
    studentRes.forEach(({ location, students }) => {
      if (!location) return;
      const normalizedLoc = normalizeLocation(location);
      if (!normalizedLoc) return;
      
      if (!statsMap[normalizedLoc]) {
        statsMap[normalizedLoc] = { location: normalizedLoc, students, cxos: 0 };
      } else {
        statsMap[normalizedLoc].students += students;
      }
    });
    
    // Process executive data
    executiveRes.forEach(({ location, cxos }) => {
      if (!location) return;
      const normalizedLoc = normalizeLocation(location);
      if (!normalizedLoc) return;
      
      if (!statsMap[normalizedLoc]) {
        statsMap[normalizedLoc] = { location: normalizedLoc, students: 0, cxos };
      } else {
        statsMap[normalizedLoc].cxos += cxos;
      }
    });
    
    // Convert to array and sort by total registrations
    const merged = Object.values(statsMap).sort((a, b) => (b.students + b.cxos) - (a.students + a.cxos));
    
    console.log("📍 Location stats:", merged);
    res.json(merged);
  } catch (err) {
    console.error("Error in /api/stats/registrations-by-location:", err);
    res.status(500).json({ message: "Failed to fetch registration stats" });
  }
});

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend server is working!", timestamp: new Date().toISOString() });
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
