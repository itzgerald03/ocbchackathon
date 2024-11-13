const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const pool = require("./config");
const dashboardRoutes = require("./routes/dashboardRoutes")

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
  // Do NOT call pool.end() here
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await pool.end(); // Close the database pool when the server shuts down
  process.exit(0);
});
