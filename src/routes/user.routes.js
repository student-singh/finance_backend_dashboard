const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', protect, roleCheck('admin'), getAllUsers);
router.get('/:id', protect, roleCheck('admin'), getUserById);
router.put('/:id', protect, roleCheck('admin'), updateUser);
router.delete('/:id', protect, roleCheck('admin'), deleteUser);

module.exports = router;