const express = require("express");
const { login, register } = require("../controllers/authController"); // Include the register controller
const router = express.Router();

router.post("/login", login);
router.post("/register", register); // Add register endpoint

module.exports = router;
