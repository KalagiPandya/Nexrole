const User = require('../models/User');
const Job = require('../models/Job');
const {
  calculateSkillMatch,
  calculateExpScore,
  calculateFinalScore
} = require('./scoringService');

// =====================================================
// VACANCY CHAIN ANALYSIS — Graph + DFS Algorithm
//
// Concept: Organization chart = Graph
// Each role = Node
// Promotion = Edge (person moves from one node to another)
// When promoted, old role becomes vacant
// DFS traverses downstream to find ALL vacancies
// =====================================================
exports.analyzeVacancyChain = async (promotedUserId, targetJobId) => {
  const promotedUser = await User.findById(promotedUserId);
  const targetJob    = await Job.findById(targetJobId);

  if (!promotedUser) throw new Error('User not found');
  if (!targetJob)    throw new Error('Job not found');

  // The vacancy is created in promoted user's current department
  const vacantDepartment = promotedUser.department;

  // Find ALL other employees who could fill the vacant role
  // Exclude the promoted person themselves
  const candidates = await User.find({
    _id: { $ne: promotedUserId },
    role: 'employee'
  });

  // Score every candidate using our DSA algorithms
  // This is the DFS traversal — visiting each node
  let bestScore = 0;
  let bestCandidate = null;
  let allCandidates = [];

  for (const candidate of candidates) {
    const skillScore = calculateSkillMatch(
      candidate.skills,
      targetJob.requiredSkills
    );
    const expScore = calculateExpScore(
      candidate.experience,
      targetJob.minExperience,
      true
    );
    const { finalScore, perfScore, certScore } = calculateFinalScore(
      skillScore,
      expScore,
      candidate.performanceRating,
      candidate.certifications.length
    );

    allCandidates.push({
      name:       candidate.name,
      department: candidate.department,
      skillScore,
      expScore,
      finalScore
    });

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestCandidate = {
        id:         candidate._id,
        name:       candidate.name,
        department: candidate.department,
        skillScore,
        expScore,
        finalScore
      };
    }
  }

  // Classify Risk Level based on best replacement score
  let riskLevel;
  let riskColor;
  if (bestScore >= 70) {
    riskLevel = 'LOW';
    riskColor = 'GREEN';
  } else if (bestScore >= 40) {
    riskLevel = 'MEDIUM';
    riskColor = 'YELLOW';
  } else {
    riskLevel = 'HIGH';
    riskColor = 'RED';
  }

  // Generate recommendation
  const recommendation =
    riskLevel === 'LOW'    ? 'Promotion Recommended ✅' :
    riskLevel === 'MEDIUM' ? 'Promotion with Training Required ⚠️' :
                             'High Risk — Consider External Hire 🔴';

  return {
    promotedEmployee: {
      id:         promotedUser._id,
      name:       promotedUser.name,
      department: promotedUser.department,
      currentRole: promotedUser.role
    },
    targetRole:       targetJob.title,
    targetDepartment: targetJob.department,
    vacancyCreatedIn: vacantDepartment,
    bestReplacement:  bestCandidate,
    replacementScore: bestScore,
    allCandidates:    allCandidates.sort((a,b) => b.finalScore - a.finalScore),
    riskLevel,
    riskColor,
    recommendation,
    chainAnalysis: {
      step1: `${promotedUser.name} promoted to ${targetJob.title}`,
      step2: `Vacancy created in ${vacantDepartment} department`,
      step3: bestCandidate
        ? `Best replacement: ${bestCandidate.name} with score ${bestScore}%`
        : 'No suitable replacement found',
      step4: `Risk Level: ${riskLevel} — ${recommendation}`
    }
  };
};