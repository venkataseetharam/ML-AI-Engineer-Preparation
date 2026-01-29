import { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import Button from '../common/Button';

const COMMON_TOPICS = [
  'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
  'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search', 'Breadth-First Search',
  'Tree', 'Graph', 'Backtracking', 'Sliding Window', 'Two Pointers',
  'Stack', 'Queue', 'Heap', 'Linked List', 'Binary Tree',
  'Recursion', 'Divide and Conquer', 'Bit Manipulation', 'Trie', 'Union Find'
];

export default function ProblemDetailsModal({ isOpen, onClose, onSave, existingProblem = null }) {
  const [formData, setFormData] = useState({
    problemId: '',
    name: '',
    difficulty: 'Medium',
    topics: [],
    success: true,
    attempts: 1,
    timeSpent: 0,
    notes: ''
  });

  const [customTopic, setCustomTopic] = useState('');
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  useEffect(() => {
    if (existingProblem) {
      setFormData(existingProblem);
    } else {
      // Reset form when opening for new problem
      setFormData({
        problemId: '',
        name: '',
        difficulty: 'Medium',
        topics: [],
        success: true,
        attempts: 1,
        timeSpent: 0,
        notes: ''
      });
    }
  }, [existingProblem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Problem name is required');
      return;
    }
    onSave(formData);
    onClose();
  };

  const addTopic = (topic) => {
    if (!formData.topics.includes(topic)) {
      setFormData({ ...formData, topics: [...formData.topics, topic] });
    }
    setCustomTopic('');
    setShowTopicSuggestions(false);
  };

  const removeTopic = (topic) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter(t => t !== topic)
    });
  };

  const filteredTopics = COMMON_TOPICS.filter(topic =>
    topic.toLowerCase().includes(customTopic.toLowerCase()) &&
    !formData.topics.includes(topic)
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {existingProblem ? 'Edit Problem' : 'Add Problem Details'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Problem ID and Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem ID (e.g., LC-1, 2Sum)
                </label>
                <input
                  type="text"
                  value={formData.problemId}
                  onChange={(e) => setFormData({ ...formData, problemId: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="LC-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="Two Sum"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.difficulty === level
                        ? level === 'Easy'
                          ? 'bg-green-500 text-white'
                          : level === 'Medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag size={16} className="inline mr-1" />
                Topics
              </label>

              {/* Selected Topics */}
              {formData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.topics.map(topic => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Topic Input */}
              <div className="relative">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    setShowTopicSuggestions(true);
                  }}
                  onFocus={() => setShowTopicSuggestions(true)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="Type to search topics or add custom..."
                />

                {/* Suggestions */}
                {showTopicSuggestions && customTopic && filteredTopics.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredTopics.slice(0, 10).map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => addTopic(topic)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Topic Button */}
              {customTopic && (
                <button
                  type="button"
                  onClick={() => addTopic(customTopic)}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add "{customTopic}"
                </button>
              )}
            </div>

            {/* Success, Attempts, Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.success}
                  onChange={(e) => setFormData({ ...formData, success: e.target.value === 'true' })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                >
                  <option value="true">Solved</option>
                  <option value="false">Attempted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.attempts}
                  onChange={(e) => setFormData({ ...formData, attempts: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.timeSpent}
                  onChange={(e) => setFormData({ ...formData, timeSpent: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="Key insights, approach used, mistakes made..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {existingProblem ? 'Update' : 'Add'} Problem
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
