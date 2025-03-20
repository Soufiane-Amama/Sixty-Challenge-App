const express = require("express");
const { calculateWeeklyResults } = require("../controllers/badgePunishmentController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// مسارات الشارات والعقوبات
router.get("/weekly-results", protect, calculateWeeklyResults);

module.exports = router;
