const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { calculateSkillMatch, calculateExpScore, calculateFinalScore } = require('../services/scoringService');

// ================================
// APPLY FOR A JOB — Employee only
// ================================
exports.applyForJob = async (req, res) => {
  try {
    const job  = await Job.findById(req.params.jobId);
    const user = await User.findById(req.user.userId);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.isOpen) return res.status(400).json({ message: 'Job is closed' });

    // Check if already applied
    const existing = await Application.findOne({
      userId: user._id,
      jobId: job._id
    });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });

    // Run all 3 algorithms
    const skillScore = calculateSkillMatch(user.skills, job.requiredSkills);
    const expScore   = calculateExpScore(user.experience, job.minExperience);
    const { finalScore, perfScore, certScore } = calculateFinalScore(
      skillScore,
      expScore,
      user.performanceRating,
      user.certifications.length
    );

    // Save application with all scores
    const application = await Application.create({
      userId: user._id,
      jobId:  job._id,
      skillScore,
      expScore,
      perfScore,
      certScore,
      finalScore
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
      scoreBreakdown: {
        skillScore,
        expScore,
        perfScore: Math.round(perfScore),
        certScore: Math.round(certScore),
        finalScore
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// GET MY APPLICATIONS — Employee
// ================================
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.userId })
      .populate('jobId', 'title department requiredSkills minExperience')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// GET ALL APPLICANTS FOR A JOB — HR only
// Ranked by finalScore (highest first = Max Heap behaviour)
// ================================
exports.getApplicants = async (req, res) => {
  try {
    const applicants = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email department skills experience performanceRating certifications')
      .sort({ finalScore: -1 }); // -1 = descending = highest score first
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// UPDATE APPLICATION STATUS — HR only
// ================================
exports.updateStatus = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};