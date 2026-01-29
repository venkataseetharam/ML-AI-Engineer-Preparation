import { Target, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const TARGETS = {
  leetcode: 150,
  systemDesign: 15,
  mlTheory: 12,
  projects: 6,
  mockInterviews: 12,
  researchPapers: 10,
  blogPosts: 6,
  linkedinPosts: 48
};

const TWELVE_WEEKS_DAYS = 84;

export default function ProgressPredictions({ dailyLogs, startDate }) {
  const calculatePredictions = () => {
    // Calculate current progress
    const totals = {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0,
      mockInterviews: 0,
      researchPapers: 0,
      blogPosts: 0,
      linkedinPosts: 0
    };

    dailyLogs.forEach(log => {
      totals.leetcode += (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0);
      totals.systemDesign += log.systemDesign || 0;
      totals.mlTheory += log.mlTheory || 0;
      totals.projects += [
        log.projectML, log.projectDL, log.projectRAG,
        log.projectAgents, log.projectFineTuning, log.projectLLM
      ].filter(Boolean).length;
      totals.mockInterviews += log.mockInterview ? 1 : 0;
      totals.researchPapers += log.researchPaper ? 1 : 0;
      totals.blogPosts += log.blogPost ? 1 : 0;
      totals.linkedinPosts += log.linkedinPost ? 1 : 0;
    });

    // Calculate days elapsed
    const start = new Date(startDate);
    const now = new Date();
    const daysElapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const weeksElapsed = daysElapsed / 7;

    // Calculate velocity (per week)
    const velocity = {};
    Object.keys(totals).forEach(key => {
      velocity[key] = weeksElapsed > 0 ? totals[key] / weeksElapsed : 0;
    });

    // Calculate predictions
    const predictions = [];
    Object.keys(TARGETS).forEach(key => {
      const current = totals[key];
      const target = TARGETS[key];
      const remaining = Math.max(0, target - current);
      const weeklyVelocity = velocity[key];

      let weeksNeeded = 0;
      let estimatedDate = null;
      let status = 'on-track';

      if (remaining > 0 && weeklyVelocity > 0) {
        weeksNeeded = remaining / weeklyVelocity;
        estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + Math.ceil(weeksNeeded * 7));

        // Check if on track for 12 weeks
        const daysRemaining = TWELVE_WEEKS_DAYS - daysElapsed;
        const weeksRemaining = daysRemaining / 7;

        if (weeksNeeded > weeksRemaining) {
          status = 'behind';
        } else if (weeksNeeded < weeksRemaining * 0.8) {
          status = 'ahead';
        }
      } else if (remaining === 0) {
        status = 'completed';
      } else {
        status = 'no-progress';
      }

      predictions.push({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        current,
        target,
        remaining,
        velocity: weeklyVelocity,
        weeksNeeded,
        estimatedDate,
        status
      });
    });

    // Calculate overall progress
    const daysRemaining = Math.max(0, TWELVE_WEEKS_DAYS - daysElapsed);
    const targetDate = new Date(start);
    targetDate.setDate(targetDate.getDate() + TWELVE_WEEKS_DAYS);

    return { predictions, daysElapsed, daysRemaining, targetDate };
  };

  const { predictions, daysElapsed, daysRemaining, targetDate } = calculatePredictions();

  const primaryGoals = predictions.filter(p =>
    ['leetcode', 'systemDesign', 'mlTheory', 'projects'].includes(p.key)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'ahead': return 'blue';
      case 'on-track': return 'yellow';
      case 'behind': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <Target size={16} className="text-green-500" />;
      case 'ahead': return <TrendingUp size={16} className="text-blue-500" />;
      case 'on-track': return <Calendar size={16} className="text-yellow-500" />;
      case 'behind': return <AlertCircle size={16} className="text-red-500" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'ahead': return 'Ahead of Schedule';
      case 'on-track': return 'On Track';
      case 'behind': return 'Behind Schedule';
      default: return 'No Progress';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="text-violet-500" size={24} />
          Progress Predictions
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">12-Week Target</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Days Elapsed</span>
          <span className="font-bold text-gray-900 dark:text-white">{daysElapsed} / 84 days</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, (daysElapsed / TWELVE_WEEKS_DAYS) * 100)}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Goal period completed'}
        </div>
      </div>

      {/* Primary Goals Predictions */}
      <div className="space-y-3">
        {primaryGoals.map(pred => (
          <div
            key={pred.key}
            className={`p-4 rounded-lg border-2 border-${getStatusColor(pred.status)}-200 dark:border-${getStatusColor(pred.status)}-800 bg-${getStatusColor(pred.status)}-50 dark:bg-${getStatusColor(pred.status)}-900/20`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{pred.label}</span>
                  {getStatusIcon(pred.status)}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pred.current}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {pred.target}
                  </span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-semibold bg-${getStatusColor(pred.status)}-100 dark:bg-${getStatusColor(pred.status)}-900 text-${getStatusColor(pred.status)}-700 dark:text-${getStatusColor(pred.status)}-300`}>
                    {getStatusLabel(pred.status)}
                  </span>
                </div>

                {pred.status !== 'completed' && pred.status !== 'no-progress' && (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Velocity:</span>
                      <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                        {pred.velocity.toFixed(1)}/week
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Est. Completion:</span>
                      <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                        {pred.weeksNeeded.toFixed(1)} weeks
                      </span>
                    </div>
                  </div>
                )}

                {pred.status === 'no-progress' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Start tracking to see predictions
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
          <TrendingUp size={16} />
          Recommendations
        </h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          {primaryGoals.filter(p => p.status === 'behind').length > 0 ? (
            <>
              {primaryGoals
                .filter(p => p.status === 'behind')
                .map(pred => (
                  <li key={pred.key}>
                    • <strong>{pred.label}:</strong> Increase velocity to{' '}
                    {(pred.remaining / (daysRemaining / 7)).toFixed(1)}/week to reach target
                  </li>
                ))}
            </>
          ) : (
            <li>• Great progress! Keep up the current pace to reach all goals on time.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
