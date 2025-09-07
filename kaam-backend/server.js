require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const studentRoutes = require("./routes/studentRoutes");
const executiveRoutes = require("./routes/executiveRoutes");
const employerRoutes = require("./routes/employerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production' ? false : true,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection with improved configuration
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://stepupmeshlinks:stepupmeshlinks%231305@stepup.xwectwc.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Stepup";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(mongoURI, mongooseOptions)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  await mongoose.connection.close();
  process.exit(0);
});


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
    
    res.json(merged);
  } catch (err) {
    console.error("Error in /api/stats/registrations-by-location:", err);
    res.status(500).json({ message: "Failed to fetch registration stats" });
  }
});

// Test route to verify server is working



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
