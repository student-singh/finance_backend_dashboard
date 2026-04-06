const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', protect, roleCheck('viewer', 'analyst', 'admin'), getTransactions);
router.get('/:id', protect, roleCheck('viewer', 'analyst', 'admin'), getTransactionById);
router.post('/', protect, roleCheck('admin'), createTransaction);
router.put('/:id', protect, roleCheck('admin'), updateTransaction);
router.delete('/:id', protect, roleCheck('admin'), deleteTransaction);

module.exports = router;