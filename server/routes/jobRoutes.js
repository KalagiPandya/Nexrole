const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// CREATE job — HR and Admin only
router.post('/', protect, authorize('hr', 'admin'), createJob);

// GET all open jobs — any logged in user
router.get('/', protect, getAllJobs);

// GET single job — any logged in user
router.get('/:id', protect, getJob);

// UPDATE job — HR and Admin only
router.put('/:id', protect, authorize('hr', 'admin'), updateJob);

// DELETE job — HR and Admin only
router.delete('/:id', protect, authorize('hr', 'admin'), deleteJob);

module.exports = router;