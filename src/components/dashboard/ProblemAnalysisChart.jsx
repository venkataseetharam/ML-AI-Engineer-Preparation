import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function ProblemAnalysisChart({ dailyLogs }) {
  const analyzeProblemData = () => {
    const stats = {
      Easy: { total: 0, solved: 0, attempts: 0, timeSpent: 0 },
      Medium: { total: 0, solved: 0, attempts: 0, timeSpent: 0 },
      Hard: { total: 0, solved: 0, attempts: 0, timeSpent: 0 }
    };

    dailyLogs.forEach(log => {
      if (log.problemDetails && log.problemDetails.length > 0) {
        log.problemDetails.forEach(problem => {
          const difficulty = problem.difficulty;
          if (stats[difficulty]) {
            stats[difficulty].total++;
            if (problem.success) stats[difficulty].solved++;
            stats[difficulty].attempts += problem.attempts || 1;
            stats[difficulty].timeSpent += problem.timeSpent || 0;
          }
        });
      }
    });

    // Calculate success rates and average attempts
    const chartData = Object.keys(stats).map(difficulty => {
      const data = stats[difficulty];
      return {
        difficulty,
        total: data.total,
        solved: data.solved,
        successRate: data.total > 0 ? ((data.solved / data.total) * 100).toFixed(1) : 0,
        avgAttempts: data.total > 0 ? (data.attempts / data.total).toFixed(1) : 0,
        avgTime: data.total > 0 ? (data.timeSpent / data.total).toFixed(0) : 0
      };
    });

    return { chartData, stats };
  };

  const { chartData, stats } = analyzeProblemData();
  const totalProblems = chartData.reduce((sum, item) => sum + item.total, 0);
  const totalSolved = chartData.reduce((sum, item) => sum + item.solved, 0);

  if (totalProblems === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-purple-500" size={24} />
            Problem Difficulty Analysis
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No problem data available. Add problem details when logging!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-purple-500" size={24} />
          Problem Difficulty Analysis
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalSolved} / {totalProblems} solved
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {chartData.map(item => (
          <div
            key={item.difficulty}
            className={`p-4 rounded-lg border-2 ${
              item.difficulty === 'Easy'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : item.difficulty === 'Medium'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {item.difficulty}
            </div>
            <div className={`text-2xl font-bold mb-2 ${
              item.difficulty === 'Easy'
                ? 'text-green-600 dark:text-green-400'
                : item.difficulty === 'Medium'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {item.solved}/{item.total}
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} />
                {item.successRate}% success
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} />
                {item.avgAttempts} avg attempts
              </div>
              {item.avgTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.avgTime} min avg
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart - Success vs Total */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="difficulty"
              tick={{ fill: '#9CA3AF' }}
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
            <Legend
              wrapperStyle={{ color: '#9CA3AF' }}
            />
            <Bar dataKey="total" fill="#6B7280" name="Total Problems" />
            <Bar dataKey="solved" fill="#10B981" name="Solved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Overall Success Rate</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalProblems > 0 ? ((totalSolved / totalProblems) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Problems Tracked</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalProblems}
          </div>
        </div>
      </div>
    </div>
  );
}
