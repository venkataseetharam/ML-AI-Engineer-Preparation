// Calculation utilities extracted from App.jsx

export const calculateTotals = (dailyLogs = []) => {
  return dailyLogs.reduce((acc, log) => ({
    leetcode: acc.leetcode + (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
    leetcodeEasy: acc.leetcodeEasy + (log.leetcodeEasy || 0),
    leetcodeMedium: acc.leetcodeMedium + (log.leetcodeMedium || 0),
    leetcodeHard: acc.leetcodeHard + (log.leetcodeHard || 0),
    systemDesign: acc.systemDesign + (log.systemDesign || 0),
    mlTheory: acc.mlTheory + (log.mlTheory || 0),
    projects: acc.projects + (log.projectML ? 1 : 0) + (log.projectDL ? 1 : 0) + (log.projectRAG ? 1 : 0) +
              (log.projectAgents ? 1 : 0) + (log.projectFineTuning ? 1 : 0) + (log.projectLLM ? 1 : 0),
    mockInterviews: acc.mockInterviews + (log.mockInterview ? 1 : 0),
    researchPapers: acc.researchPapers + (log.researchPaper ? 1 : 0),
    blogPosts: acc.blogPosts + (log.blogPost ? 1 : 0),
    linkedinPosts: acc.linkedinPosts + (log.linkedinPost ? 1 : 0)
  }), {
    leetcode: 0, leetcodeEasy: 0, leetcodeMedium: 0, leetcodeHard: 0,
    systemDesign: 0, mlTheory: 0, projects: 0,
    mockInterviews: 0, researchPapers: 0,
    blogPosts: 0, linkedinPosts: 0
  });
};

export const calculateStreak = (dailyLogs = []) => {
  if (dailyLogs.length === 0) return 0;

  const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      const hasActivity = (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0) > 0 ||
                        log.systemDesign > 0 || log.mlTheory > 0 || log.projectML || log.projectDL ||
                        log.projectRAG || log.projectAgents || log.projectFineTuning || log.projectLLM;
      if (hasActivity) {
        streak++;
        currentDate = logDate;
      } else break;
    } else break;
  }
  return streak;
};

export const getWeekNumber = (startDate) => {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(12, Math.ceil(diffDays / 7) || 1);
};

export const calculateWeeklyProgress = (dailyLogs = []) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get Monday of current week
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const weekLogs = dailyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= monday && logDate <= now;
  });

  return weekLogs.reduce((acc, log) => ({
    leetcode: acc.leetcode + (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
    systemDesign: acc.systemDesign + (log.systemDesign || 0),
    mlTheory: acc.mlTheory + (log.mlTheory || 0),
    projects: acc.projects + (log.projectML ? 1 : 0) + (log.projectDL ? 1 : 0) + (log.projectRAG ? 1 : 0) +
              (log.projectAgents ? 1 : 0) + (log.projectFineTuning ? 1 : 0) + (log.projectLLM ? 1 : 0)
  }), {
    leetcode: 0,
    systemDesign: 0,
    mlTheory: 0,
    projects: 0
  });
};
