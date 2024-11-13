const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const router = express.Router();

// Dashboard route with query parameters for userId and accountId
router.get("/dashboard", getDashboardData);

module.exports = router;
