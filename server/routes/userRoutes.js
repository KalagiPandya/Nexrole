const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET own profile — any logged in user can access
router.get('/profile', protect, getProfile);

// UPDATE own profile — any logged in user can access
router.put('/profile', protect, updateProfile);

// GET all users — ADMIN ONLY
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;