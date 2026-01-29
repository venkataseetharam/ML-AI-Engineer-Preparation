import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tag } from 'lucide-react';

export default function TopicTrackingChart({ dailyLogs }) {
  const analyzeTopics = () => {
    const topicCounts = {};

    dailyLogs.forEach(log => {
      if (log.problemDetails && log.problemDetails.length > 0) {
        log.problemDetails.forEach(problem => {
          if (problem.topics && problem.topics.length > 0) {
            problem.topics.forEach(topic => {
              if (topicCounts[topic]) {
                topicCounts[topic]++;
              } else {
                topicCounts[topic] = 1;
              }
            });
          }
        });
      }
    });

    // Convert to array and sort by count
    const sortedTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 topics

    return sortedTopics;
  };

  const topicsData = analyzeTopics();

  if (topicsData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="text-indigo-500" size={24} />
            Topic Distribution
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No topic data available. Add topics when logging problems!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Tag className="text-indigo-500" size={24} />
          Top Topics
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {topicsData.length} topics tracked
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topicsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
            <YAxis
              dataKey="topic"
              type="category"
              width={120}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#E5E7EB' }}
              formatter={(value) => [`${value} problems`, 'Count']}
            />
            <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {topicsData.slice(0, 5).map(({ topic, count }) => (
          <div
            key={topic}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium flex items-center gap-2"
          >
            {topic}
            <span className="px-1.5 py-0.5 bg-indigo-200 dark:bg-indigo-800 rounded text-xs">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
