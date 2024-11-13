const express = require("express");
const { transferFunds } = require("../controllers/transferController");
const router = express.Router();

router.post("/transfer", transferFunds);

module.exports = router;
