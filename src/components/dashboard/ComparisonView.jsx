import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function ComparisonView({ dailyLogs }) {
  const [period, setPeriod] = useState('week'); // 'week' or 'month'

  const calculateComparison = () => {
    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    if (period === 'week') {
      // Current week (Sunday to Saturday)
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - now.getDay());
      currentStart.setHours(0, 0, 0, 0);

      // Previous week
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousEnd.getDate() - 1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousEnd.getDate() - 6);
      previousStart.setHours(0, 0, 0, 0);
    } else {
      // Current month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now);

      // Previous month
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    const currentStats = {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0,
      content: 0,
      activeDays: 0
    };

    const previousStats = {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0,
      content: 0,
      activeDays: 0
    };

    dailyLogs.forEach(log => {
      const logDate = new Date(log.date);

      const leetcodeCount = (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0);
      const projectCount = [
        log.projectML, log.projectDL, log.projectRAG,
        log.projectAgents, log.projectFineTuning, log.projectLLM
      ].filter(Boolean).length;
      const contentCount = [
        log.mockInterview, log.researchPaper, log.blogPost, log.linkedinPost
      ].filter(Boolean).length;

      if (logDate >= currentStart && logDate <= currentEnd) {
        currentStats.leetcode += leetcodeCount;
        currentStats.systemDesign += log.systemDesign || 0;
        currentStats.mlTheory += log.mlTheory || 0;
        currentStats.projects += projectCount;
        currentStats.content += contentCount;
        if (leetcodeCount > 0 || log.systemDesign > 0 || log.mlTheory > 0) {
          currentStats.activeDays++;
        }
      } else if (logDate >= previousStart && logDate <= previousEnd) {
        previousStats.leetcode += leetcodeCount;
        previousStats.systemDesign += log.systemDesign || 0;
        previousStats.mlTheory += log.mlTheory || 0;
        previousStats.projects += projectCount;
        previousStats.content += contentCount;
        if (leetcodeCount > 0 || log.systemDesign > 0 || log.mlTheory > 0) {
          previousStats.activeDays++;
        }
      }
    });

    // Calculate changes
    const changes = {};
    Object.keys(currentStats).forEach(key => {
      const diff = currentStats[key] - previousStats[key];
      const percentChange = previousStats[key] > 0
        ? ((diff / previousStats[key]) * 100)
        : (currentStats[key] > 0 ? 100 : 0);
      changes[key] = { diff, percentChange };
    });

    // Prepare chart data
    const chartData = [
      {
        category: 'LeetCode',
        current: currentStats.leetcode,
        previous: previousStats.leetcode
      },
      {
        category: 'System Design',
        current: currentStats.systemDesign,
        previous: previousStats.systemDesign
      },
      {
        category: 'ML Theory',
        current: currentStats.mlTheory,
        previous: previousStats.mlTheory
      },
      {
        category: 'Projects',
        current: currentStats.projects,
        previous: previousStats.projects
      },
      {
        category: 'Content',
        current: currentStats.content,
        previous: previousStats.content
      }
    ];

    return { currentStats, previousStats, changes, chartData };
  };

  const { currentStats, previousStats, changes, chartData } = calculateComparison();

  const formatLabel = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const renderStatCard = (key, label, icon, color) => {
    const current = currentStats[key];
    const previous = previousStats[key];
    const change = changes[key];

    return (
      <div className={`p-4 rounded-lg border-2 bg-${color}-50 dark:bg-${color}-900/20 border-${color}-200 dark:border-${color}-800`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {icon}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>
            {current}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs {previous}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {change.diff !== 0 && (
            <>
              {change.diff > 0 ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-semibold ${
                change.diff > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {change.diff > 0 ? '+' : ''}{change.diff} ({change.percentChange > 0 ? '+' : ''}{change.percentChange.toFixed(0)}%)
              </span>
            </>
          )}
          {change.diff === 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">No change</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header with Period Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-cyan-500" size={24} />
          Period Comparison
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'week'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'month'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {renderStatCard('leetcode', 'LeetCode', <Code className="text-blue-500" size={18} />, 'blue')}
        {renderStatCard('systemDesign', 'System Design', <Brain className="text-green-500" size={18} />, 'green')}
        {renderStatCard('mlTheory', 'ML Theory', <BookOpen className="text-orange-500" size={18} />, 'orange')}
        {renderStatCard('projects', 'Projects', <Target className="text-purple-500" size={18} />, 'purple')}
        {renderStatCard('content', 'Content', <FileText className="text-pink-500" size={18} />, 'pink')}
        {renderStatCard('activeDays', 'Active Days', <Calendar className="text-cyan-500" size={18} />, 'cyan')}
      </div>

      {/* Comparison Bar Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="category"
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
            <Bar
              dataKey="previous"
              fill="#6B7280"
              name={period === 'week' ? 'Last Week' : 'Last Month'}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="current"
              fill="#06B6D4"
              name={period === 'week' ? 'This Week' : 'This Month'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Import required icons at the top
import { Code, Brain, BookOpen, Target, FileText } from 'lucide-react';
