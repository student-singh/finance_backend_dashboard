const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
  getRecentTransactions
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/summary', protect, roleCheck('analyst', 'admin'), getSummary);
router.get('/category-wise', protect, roleCheck('analyst', 'admin'), getCategoryWise);
router.get('/monthly-trends', protect, roleCheck('analyst', 'admin'), getMonthlyTrends);
router.get('/recent', protect, roleCheck('analyst', 'admin'), getRecentTransactions);

module.exports = router;