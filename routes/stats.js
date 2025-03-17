// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWeeklySummary, getMonthlySummary } = require('../controllers/stats');

router.get('/weekly-summary', protect, getWeeklySummary);
router.get('/monthly-summary', protect, getMonthlySummary);

module.exports = router;