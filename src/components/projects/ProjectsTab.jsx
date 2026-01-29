import { useState } from 'react';
import { Plus, Folder, Github, Clock, Trash2, Edit2, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const STATUS_OPTIONS = ['Planning', 'In Progress', 'Testing', 'Completed'];
const STATUS_COLORS = {
  'Planning': 'bg-gray-500',
  'In Progress': 'bg-blue-500',
  'Testing': 'bg-yellow-500',
  'Completed': 'bg-green-500'
};

export default function ProjectsTab({ projects, onSave }) {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    techStack: '',
    githubUrl: '',
    status: 'Planning',
    progress: 0,
    hoursLogged: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      techStack: '',
      githubUrl: '',
      status: 'Planning',
      progress: 0,
      hoursLogged: 0
    });
    setEditingIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let updatedProjects;
    if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedProjects = [...projects, {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }

    onSave(updatedProjects);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(projects[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (confirm('Delete this project?')) {
      const updated = projects.filter((_, i) => i !== index);
      onSave(updated);
    }
  };

  const activeProjects = projects.filter(p => p.status !== 'Completed');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="text-purple-500" size={28} />
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your ML/AI projects with milestones and progress
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
          New Project
        </Button>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Projects ({activeProjects.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                onEdit={() => handleEdit(projects.indexOf(project))}
                onDelete={() => handleDelete(projects.indexOf(project))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed Projects ({completedProjects.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                onEdit={() => handleEdit(projects.indexOf(project))}
                onDelete={() => handleDelete(projects.indexOf(project))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Folder size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start tracking your ML/AI projects to monitor progress
          </p>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            variant="primary"
          >
            Create Your First Project
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          isEditing={editingIndex !== null}
        />
      )}
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {project.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${STATUS_COLORS[project.status]}`}>
              {project.status}
            </span>
            {project.status === 'Completed' && (
              <CheckCircle size={16} className="text-green-500" />
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit2 size={16} className="text-blue-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Tech Stack */}
      {project.techStack && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.techStack.split(',').map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{project.hoursLogged}h logged</span>
        </div>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
          >
            <Github size={14} />
            <span>View Code</span>
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectModal({ formData, setFormData, onSubmit, onClose, isEditing }) {
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
                {isEditing ? 'Edit Project' : 'New Project'}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="AI Chatbot with RAG"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="Building a chatbot with retrieval-augmented generation..."
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="Python, LangChain, OpenAI, Pinecone"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Status & Progress */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                  />
                </div>
              </div>

              {/* Hours Logged */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hours Logged
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.hoursLogged}
                  onChange={(e) => setFormData({ ...formData, hoursLogged: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                {isEditing ? 'Update' : 'Create'} Project
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
