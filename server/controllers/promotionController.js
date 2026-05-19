const Application = require('../models/Application');
const User = require('../models/User');
const { analyzeVacancyChain } = require('../services/vacancyChainService');

// ================================
// GET VACANCY IMPACT REPORT — HR Only
// This is the STAR feature of NexRole!
// ================================
exports.getImpactReport = async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Run the Graph + DFS vacancy chain analysis
    const report = await analyzeVacancyChain(
      application.userId,
      application.jobId
    );

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// APPROVE PROMOTION — HR Only
// ================================
exports.approvePromotion = async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status to approved
    application.status = 'approved';
    await application.save();

    // Update user role if specified
    if (req.body.newRole) {
      await User.findByIdAndUpdate(
        application.userId,
        { role: req.body.newRole }
      );
    }

    res.json({
      message: 'Promotion approved successfully! 🎉',
      applicationId: application._id,
      status: 'approved'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// REJECT PROMOTION — HR Only
// ================================
exports.rejectPromotion = async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    res.json({
      message: 'Application rejected.',
      applicationId: application._id,
      status: 'rejected'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};