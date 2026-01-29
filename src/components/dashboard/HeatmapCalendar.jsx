import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Flame } from 'lucide-react';

export default function HeatmapCalendar({ dailyLogs }) {
  // Calculate activity score for each day
  const calculateActivityScore = (log) => {
    // Support both old and new data formats
    const leetcodeCount = log.leetcode ||
      (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0);
    const systemDesignCount = log.systemDesign || 0;
    const contentCount = [
      log.mockInterview, log.researchPaper, log.blogPost, log.linkedinPost
    ].filter(Boolean).length;

    // Time spent indicator (hours)
    const timeSpent = log.timeSpent ? Object.values(log.timeSpent).reduce((a, b) => a + b, 0) : 0;

    // Weighted scoring: LeetCode + System Design + Content + Time
    return leetcodeCount * 2 + systemDesignCount * 3 + contentCount * 2 + timeSpent;
  };

  // Get date range (last 365 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 365);

  // Transform dailyLogs into heatmap data
  const heatmapData = dailyLogs.map(log => ({
    date: log.date,
    count: calculateActivityScore(log),
    details: {
      leetcode: log.leetcode ||
        (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
      systemDesign: log.systemDesign || 0,
      timeSpent: log.timeSpent ? Object.values(log.timeSpent).reduce((a, b) => a + b, 0) : 0,
    }
  }));

  // Get color class based on activity count
  const getColorClass = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    if (value.count < 5) return 'color-scale-1';
    if (value.count < 10) return 'color-scale-2';
    if (value.count < 15) return 'color-scale-3';
    return 'color-scale-4';
  };

  // Format tooltip
  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
      return { 'data-tip': 'No activity' };
    }

    const date = new Date(value.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (value.count === 0) {
      return { 'data-tip': `${date}: No activity` };
    }

    const details = value.details || {};
    const parts = [];
    if (details.leetcode > 0) parts.push(`${details.leetcode} LeetCode`);
    if (details.systemDesign > 0) parts.push(`${details.systemDesign} System Design`);
    if (details.timeSpent > 0) parts.push(`${details.timeSpent.toFixed(1)}h study time`);

    return {
      'data-tip': `${date}\n${parts.join(', ') || 'Activity'}`
    };
  };

  // Calculate current streak
  const calculateStreak = () => {
    if (dailyLogs.length === 0) return 0;

    const sortedLogs = [...dailyLogs]
      .filter(log => calculateActivityScore(log) > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedLogs.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();
  const totalActiveDays = heatmapData.filter(d => d.count > 0).length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Flame className="text-orange-500" size={24} />
          Activity Heatmap
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
            <div className="text-gray-500 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{totalActiveDays}</div>
            <div className="text-gray-500 dark:text-gray-400">Active Days</div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={getColorClass}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels={true}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500"></div>
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
