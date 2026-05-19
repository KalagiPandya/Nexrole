const express = require('express');
const router = express.Router();
const {
  getImpactReport,
  approvePromotion,
  rejectPromotion
} = require('../controllers/promotionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET vacancy chain impact report — HR only
router.get('/impact/:appId', protect, authorize('hr', 'admin'), getImpactReport);

// APPROVE promotion — HR only
router.post('/approve/:appId', protect, authorize('hr', 'admin'), approvePromotion);

// REJECT promotion — HR only
router.post('/reject/:appId', protect, authorize('hr', 'admin'), rejectPromotion);

module.exports = router;