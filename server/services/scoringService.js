// =====================================================
// ALGORITHM 1: SKILL MATCHING using HashSet
// Time Complexity: O(n) instead of O(n*m) with loops
// This is the DSA you mention in interviews!
// =====================================================
exports.calculateSkillMatch = (employeeSkills, requiredSkills) => {
  if (!requiredSkills.length) return 100;

  // Convert employee skills to SET for O(1) lookup
  // Without Set: need nested loop = O(n*m) slow
  // With Set: single loop = O(n) fast
  const skillSet = new Set(employeeSkills.map(s => s.toLowerCase()));

  let matchCount = 0;
  for (const skill of requiredSkills) {
    if (skillSet.has(skill.toLowerCase())) {
      matchCount++;
    }
  }

  return Math.round((matchCount / requiredSkills.length) * 100);
};

// =====================================================
// ALGORITHM 2: EXPERIENCE SCORE
// Internal candidates get 20% relaxation
// =====================================================
exports.calculateExpScore = (empExp, requiredExp, isInternal = true) => {
  if (requiredExp === 0) return 100;

  // Internal candidates get relaxation — company rewards loyalty
  const threshold = isInternal ? requiredExp * 0.8 : requiredExp;

  if (empExp >= requiredExp) return 100;
  if (empExp >= threshold)   return 80;
  return Math.round((empExp / requiredExp) * 100);
};

// =====================================================
// ALGORITHM 3: FINAL WEIGHTED SCORE
// Skills:40% + Experience:30% + Performance:20% + Certs:10%
// This is your scoring engine — mention weights in interview!
// =====================================================
exports.calculateFinalScore = (skillMatch, expScore, perfRating, certCount) => {
  // Convert performance rating (1-5) to percentage
  const perfScore = (perfRating / 5) * 100;

  // Convert certification count to score (max 100)
  const certScore = Math.min(certCount * 20, 100);

  // Weighted combination
  const finalScore = Math.round(
    (skillMatch * 0.40) +
    (expScore   * 0.30) +
    (perfScore  * 0.20) +
    (certScore  * 0.10)
  );

  return { finalScore, perfScore, certScore };
};