import { X } from 'lucide-react';
import { getShortcutsByCategory } from '../../config/shortcuts';

export default function ShortcutsPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = getShortcutsByCategory();

  const formatKey = (key) => {
    return key
      .split('+')
      .map(k => {
        const keyMap = {
          'ctrl': '⌃',
          'shift': '⇧',
          'alt': '⌥',
          'cmd': '⌘'
        };
        return keyMap[k] || k.toUpperCase();
      })
      .join(' + ');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Shortcuts by Category */}
          <div className="space-y-6">
            {Object.entries(shortcuts).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2">
                  {items.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.label}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded">
                        {formatKey(shortcut.key)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press <kbd className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded">?</kbd> anytime to toggle this panel
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
