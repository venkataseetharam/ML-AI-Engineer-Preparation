import { Clock, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function WeeklyTimeStats({ dailyLogs }) {
  const calculateWeeklyStats = () => {
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    currentWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(currentWeekStart.getDate() - 7);

    const lastWeekEnd = new Date(currentWeekStart);
    lastWeekEnd.setDate(currentWeekStart.getDate() - 1);

    // Calculate current week stats
    let currentWeekHours = 0;
    let currentWeekDays = 0;
    const dailyHours = {};

    dailyLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= currentWeekStart && log.timeSpent) {
        const totalHours = Object.values(log.timeSpent).reduce((sum, val) => sum + (val || 0), 0);
        if (totalHours > 0) {
          currentWeekHours += totalHours;
          currentWeekDays++;
          dailyHours[log.date] = totalHours;
        }
      }
    });

    // Calculate last week stats
    let lastWeekHours = 0;
    dailyLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= lastWeekStart && logDate <= lastWeekEnd && log.timeSpent) {
        const totalHours = Object.values(log.timeSpent).reduce((sum, val) => sum + (val || 0), 0);
        lastWeekHours += totalHours;
      }
    });

    // Find most productive day
    let mostProductiveDay = null;
    let maxHours = 0;
    Object.entries(dailyHours).forEach(([date, hours]) => {
      if (hours > maxHours) {
        maxHours = hours;
        mostProductiveDay = date;
      }
    });

    const avgHoursPerDay = currentWeekDays > 0 ? currentWeekHours / currentWeekDays : 0;
    const weekChange = lastWeekHours > 0 ? ((currentWeekHours - lastWeekHours) / lastWeekHours * 100) : 0;

    return {
      currentWeekHours,
      currentWeekDays,
      avgHoursPerDay,
      mostProductiveDay,
      maxHours,
      weekChange
    };
  };

  const stats = calculateWeeklyStats();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-green-500" size={24} />
          This Week's Time
        </h3>
        {stats.weekChange !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            stats.weekChange > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {stats.weekChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(stats.weekChange).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Hours */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-500" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.currentWeekHours.toFixed(1)}h
          </div>
        </div>

        {/* Average Per Day */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-500" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg/Day</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.avgHoursPerDay.toFixed(1)}h
          </div>
        </div>

        {/* Active Days */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-purple-500" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Active Days</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.currentWeekDays}
          </div>
        </div>

        {/* Most Productive Day */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-500" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Best Day</span>
          </div>
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400 truncate">
            {stats.mostProductiveDay ? formatDate(stats.mostProductiveDay) : 'N/A'}
          </div>
          {stats.maxHours > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.maxHours.toFixed(1)} hours
            </div>
          )}
        </div>
      </div>

      {/* Weekly Comparison */}
      {stats.weekChange !== 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.weekChange > 0 ? (
              <>
                You're up <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.weekChange.toFixed(0)}%
                </span> from last week! Keep it up! 🚀
              </>
            ) : (
              <>
                You're down <span className="font-semibold text-red-600 dark:text-red-400">
                  {Math.abs(stats.weekChange).toFixed(0)}%
                </span> from last week. Let's push harder! 💪
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
