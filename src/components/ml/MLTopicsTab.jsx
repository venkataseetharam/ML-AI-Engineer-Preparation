import { useState } from 'react';
import { Plus, Brain, Book, Clock, Trash2, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const COMMON_TOPICS = [
  'Neural Networks', 'Deep Learning', 'Transformers', 'Computer Vision', 'NLP',
  'Reinforcement Learning', 'CNNs', 'RNNs', 'LSTMs', 'GANs',
  'Attention Mechanisms', 'BERT', 'GPT', 'Diffusion Models', 'MLOps',
  'Feature Engineering', 'Hyperparameter Tuning', 'Model Deployment', 'A/B Testing',
  'Ensemble Methods', 'Gradient Boosting', 'Random Forests', 'SVM', 'Decision Trees'
];

const MASTERY_LEVELS = ['Learning', 'Practicing', 'Comfortable', 'Mastered'];
const MASTERY_COLORS = {
  'Learning': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', icon: Circle },
  'Practicing': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: AlertCircle },
  'Comfortable': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: CheckCircle2 },
  'Mastered': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: CheckCircle2 }
};

export default function MLTopicsTab({ topics, onSave }) {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Core ML',
    masteryLevel: 'Learning',
    hoursStudied: 0,
    resources: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Core ML',
      masteryLevel: 'Learning',
      hoursStudied: 0,
      resources: '',
      notes: ''
    });
    setEditingIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let updatedTopics;
    if (editingIndex !== null) {
      updatedTopics = [...topics];
      updatedTopics[editingIndex] = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedTopics = [...topics, {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }

    onSave(updatedTopics);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(topics[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (confirm('Delete this topic?')) {
      const updated = topics.filter((_, i) => i !== index);
      onSave(updated);
    }
  };

  const handleQuickAdd = (topicName) => {
    const newTopic = {
      name: topicName,
      category: 'Core ML',
      masteryLevel: 'Learning',
      hoursStudied: 0,
      resources: '',
      notes: '',
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave([...topics, newTopic]);
  };

  // Group by mastery level
  const groupedTopics = MASTERY_LEVELS.reduce((acc, level) => {
    acc[level] = topics.filter(t => t.masteryLevel === level);
    return acc;
  }, {});

  const totalHours = topics.reduce((sum, t) => sum + (t.hoursStudied || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="text-indigo-500" size={28} />
            ML Topics & Concepts
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning journey across ML topics
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Topic
        </Button>
      </div>

      {/* Stats */}
      {topics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MASTERY_LEVELS.map(level => {
            const count = groupedTopics[level].length;
            const hours = groupedTopics[level].reduce((sum, t) => sum + (t.hoursStudied || 0), 0);
            return (
              <div
                key={level}
                className={`p-4 rounded-lg border-2 ${MASTERY_COLORS[level].bg} border-gray-200 dark:border-gray-700`}
              >
                <div className={`text-sm font-medium ${MASTERY_COLORS[level].text} mb-1`}>
                  {level}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {hours.toFixed(1)}h studied
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Topics Grid */}
      {topics.length > 0 ? (
        <div className="space-y-6">
          {MASTERY_LEVELS.map(level => {
            const levelTopics = groupedTopics[level];
            if (levelTopics.length === 0) return null;

            return (
              <div key={level}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  {React.createElement(MASTERY_COLORS[level].icon, {
                    size: 20,
                    className: MASTERY_COLORS[level].text.split(' ')[0]
                  })}
                  {level} ({levelTopics.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelTopics.map((topic, index) => (
                    <TopicCard
                      key={topic.id || index}
                      topic={topic}
                      onEdit={() => handleEdit(topics.indexOf(topic))}
                      onDelete={() => handleDelete(topics.indexOf(topic))}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State with Quick Add */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <Brain size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No topics tracked yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start tracking ML topics to monitor your learning progress
            </p>
          </div>

          {/* Quick Add Suggestions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Add Popular Topics:
            </h4>
            <div className="flex flex-wrap gap-2">
              {COMMON_TOPICS.slice(0, 12).map(topic => (
                <button
                  key={topic}
                  onClick={() => handleQuickAdd(topic)}
                  className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              variant="primary"
            >
              Add Custom Topic
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TopicModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          isEditing={editingIndex !== null}
          suggestedTopics={COMMON_TOPICS}
        />
      )}
    </div>
  );
}

function TopicCard({ topic, onEdit, onDelete }) {
  const { bg, text, icon: Icon } = MASTERY_COLORS[topic.masteryLevel];

  return (
    <div className={`${bg} p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
            {topic.name}
          </h4>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${text}`}>
            <Icon size={12} />
            {topic.masteryLevel}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors"
          >
            <Edit2 size={14} className="text-blue-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock size={14} />
          <span>{topic.hoursStudied}h studied</span>
        </div>
        {topic.resources && (
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Book size={14} />
            <span className="truncate">{topic.resources.split(',')[0]}...</span>
          </div>
        )}
      </div>

      {/* Notes Preview */}
      {topic.notes && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic">
          "{topic.notes}"
        </p>
      )}
    </div>
  );
}

function TopicModal({ formData, setFormData, onSubmit, onClose, isEditing, suggestedTopics }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredTopics = suggestedTopics.filter(t =>
    t.toLowerCase().includes(formData.name.toLowerCase()) && t.toLowerCase() !== formData.name.toLowerCase()
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
          <form onSubmit={onSubmit}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Topic' : 'Add ML Topic'}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Topic Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="Neural Networks"
                />
                {/* Suggestions */}
                {showSuggestions && formData.name && filteredTopics.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredTopics.slice(0, 5).map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, name: topic });
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mastery Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mastery Level
                </label>
                <select
                  value={formData.masteryLevel}
                  onChange={(e) => setFormData({ ...formData, masteryLevel: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                >
                  {MASTERY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Hours Studied */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hours Studied
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.hoursStudied}
                  onChange={(e) => setFormData({ ...formData, hoursStudied: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>

              {/* Resources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resources (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="Coursera course, Stanford CS230, DeepLearning.ai"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="Key concepts, implementation details, gotchas..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                {isEditing ? 'Update' : 'Add'} Topic
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
