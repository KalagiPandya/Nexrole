const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicants,
  updateStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply for a job — employee only
router.post('/:jobId/apply', protect, applyForJob);

// Get my applications — any logged in user
router.get('/mine', protect, getMyApplications);

// Get all applicants for a job — HR only
router.get('/:jobId/applicants', protect, authorize('hr', 'admin'), getApplicants);

// Update application status — HR only
router.patch('/:id/status', protect, authorize('hr', 'admin'), updateStatus);

module.exports = router;