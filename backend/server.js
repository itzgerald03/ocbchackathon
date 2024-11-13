const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transferRoutes = require("./routes/transferRoutes");
const pool = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

// Test Database Connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", transferRoutes);

// Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully close the pool on server shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await pool.end();
  process.exit(0);
});
