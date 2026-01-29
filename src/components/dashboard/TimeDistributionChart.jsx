import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Clock } from 'lucide-react';

const COLORS = {
  leetcode: '#3B82F6',      // Blue
  systemDesign: '#10B981',  // Green
  mlTheory: '#F59E0B',      // Orange
  projects: '#EF4444',      // Red
  reading: '#8B5CF6',       // Purple
  other: '#EC4899'          // Pink
};

const LABELS = {
  leetcode: 'LeetCode',
  systemDesign: 'System Design',
  mlTheory: 'ML Theory',
  projects: 'Projects',
  reading: 'Reading',
  other: 'Other'
};

export default function TimeDistributionChart({ dailyLogs, period = 'week' }) {
  // Calculate time distribution based on period
  const calculateTimeDistribution = () => {
    const now = new Date();
    let daysToInclude = 7; // default to week

    if (period === 'month') daysToInclude = 30;
    else if (period === 'all') daysToInclude = 365;

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToInclude);

    const totals = {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0,
      reading: 0,
      other: 0
    };

    dailyLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= cutoffDate && log.timeSpent) {
        Object.keys(totals).forEach(key => {
          totals[key] += log.timeSpent[key] || 0;
        });
      }
    });

    // Convert to chart data format
    const chartData = Object.keys(totals)
      .map(key => ({
        name: LABELS[key],
        value: Number(totals[key].toFixed(1)),
        color: COLORS[key]
      }))
      .filter(item => item.value > 0); // Only show categories with time

    return chartData;
  };

  const data = calculateTimeDistribution();
  const totalHours = data.reduce((sum, item) => sum + item.value, 0);

  // Custom label for pie chart
  const renderLabel = (entry) => {
    const percent = ((entry.value / totalHours) * 100).toFixed(0);
    return `${percent}%`;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="text-blue-500" size={24} />
            Time Distribution
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No time tracking data for this period
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="text-blue-500" size={24} />
          Time Distribution
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-bold text-blue-500">{totalHours.toFixed(1)}h</span>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value} hours`}
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.name}: {item.value}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
