import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

export default function VelocityChart({ dailyLogs }) {
  const calculateVelocity = () => {
    // Group logs by week
    const weeklyData = {};
    const now = new Date();

    dailyLogs.forEach(log => {
      const logDate = new Date(log.date);
      // Calculate week number from start of year
      const startOfYear = new Date(logDate.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((logDate - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      const weekKey = `${logDate.getFullYear()}-W${weekNumber}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          leetcode: 0,
          systemDesign: 0,
          mlTheory: 0,
          totalProblems: 0,
          startDate: logDate
        };
      }

      const leetcodeCount = (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0);
      weeklyData[weekKey].leetcode += leetcodeCount;
      weeklyData[weekKey].systemDesign += log.systemDesign || 0;
      weeklyData[weekKey].mlTheory += log.mlTheory || 0;
      weeklyData[weekKey].totalProblems += leetcodeCount + (log.systemDesign || 0) + (log.mlTheory || 0);
    });

    // Convert to array and sort by date
    const sortedData = Object.values(weeklyData)
      .sort((a, b) => a.startDate - b.startDate)
      .slice(-12) // Last 12 weeks
      .map(item => ({
        ...item,
        weekLabel: `W${item.week.split('-W')[1]}`
      }));

    // Calculate moving average (3-week)
    const dataWithMA = sortedData.map((item, index) => {
      let sum = item.totalProblems;
      let count = 1;

      if (index > 0) {
        sum += sortedData[index - 1].totalProblems;
        count++;
      }
      if (index > 1) {
        sum += sortedData[index - 2].totalProblems;
        count++;
      }

      return {
        ...item,
        movingAverage: Number((sum / count).toFixed(1))
      };
    });

    return dataWithMA;
  };

  const velocityData = calculateVelocity();

  if (velocityData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={24} />
            Velocity Tracking
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available. Start logging to see your velocity!
        </div>
      </div>
    );
  }

  // Calculate stats
  const currentWeek = velocityData[velocityData.length - 1];
  const previousWeek = velocityData.length > 1 ? velocityData[velocityData.length - 2] : null;
  const avgVelocity = velocityData.reduce((sum, w) => sum + w.totalProblems, 0) / velocityData.length;
  const targetVelocity = 13; // From weekly goals (LeetCode)

  const velocityChange = previousWeek
    ? ((currentWeek.totalProblems - previousWeek.totalProblems) / previousWeek.totalProblems * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-500" size={24} />
          Velocity Tracking
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last 12 weeks
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Week</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentWeek.totalProblems}
          </div>
          {velocityChange !== 0 && (
            <div className={`text-xs font-semibold mt-1 ${
              velocityChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {velocityChange > 0 ? '+' : ''}{velocityChange.toFixed(0)}% from last week
            </div>
          )}
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg/Week</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {avgVelocity.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {velocityData.length} weeks tracked
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
            <Target size={12} />
            Target
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {targetVelocity}
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            avgVelocity >= targetVelocity
              ? 'text-green-600 dark:text-green-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {avgVelocity >= targetVelocity ? '✓ On Track' : `${(targetVelocity - avgVelocity).toFixed(1)} behind`}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />

            {/* Target Line */}
            <ReferenceLine
              y={targetVelocity}
              stroke="#F59E0B"
              strokeDasharray="5 5"
              label={{ value: 'Target', fill: '#F59E0B', fontSize: 12 }}
            />

            {/* Actual Problems */}
            <Line
              type="monotone"
              dataKey="totalProblems"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name="Problems/Week"
            />

            {/* Moving Average */}
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="3-Week MA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <div className="text-gray-600 dark:text-gray-400 text-xs">LeetCode</div>
          <div className="font-bold text-blue-600 dark:text-blue-400">
            {currentWeek.leetcode}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <div className="text-gray-600 dark:text-gray-400 text-xs">System Design</div>
          <div className="font-bold text-green-600 dark:text-green-400">
            {currentWeek.systemDesign}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <div className="text-gray-600 dark:text-gray-400 text-xs">ML Theory</div>
          <div className="font-bold text-orange-600 dark:text-orange-400">
            {currentWeek.mlTheory}
          </div>
        </div>
      </div>
    </div>
  );
}
