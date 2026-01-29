// Keyboard shortcuts configuration

export const shortcuts = {
  'ctrl+d': { action: 'navigateToDashboard', label: 'Go to Dashboard' },
  'ctrl+l': { action: 'navigateToLog', label: 'Go to Daily Log' },
  'ctrl+h': { action: 'navigateToHistory', label: 'Go to History' },
  'ctrl+s': { action: 'saveLog', label: 'Save Current Log' },
  'ctrl+e': { action: 'exportData', label: 'Export Data' },
  'ctrl+k': { action: 'openCommandPalette', label: 'Command Palette' },
  'ctrl+shift+a': { action: 'viewAchievements', label: 'View Achievements' },
  'ctrl+shift+s': { action: 'openSettings', label: 'Open Settings' },
  'ctrl+shift+t': { action: 'toggleTheme', label: 'Toggle Dark/Light Mode' },
  'esc': { action: 'closeModal', label: 'Close Modal' },
  '?': { action: 'showShortcuts', label: 'Show Shortcuts Help' }
};

export const getShortcutLabel = (key) => {
  return shortcuts[key]?.label || '';
};

export const getShortcutsByCategory = () => {
  return {
    navigation: [
      { key: 'ctrl+d', ...shortcuts['ctrl+d'] },
      { key: 'ctrl+l', ...shortcuts['ctrl+l'] },
      { key: 'ctrl+h', ...shortcuts['ctrl+h'] }
    ],
    actions: [
      { key: 'ctrl+s', ...shortcuts['ctrl+s'] },
      { key: 'ctrl+e', ...shortcuts['ctrl+e'] }
    ],
    views: [
      { key: 'ctrl+k', ...shortcuts['ctrl+k'] },
      { key: 'ctrl+shift+a', ...shortcuts['ctrl+shift+a'] },
      { key: 'ctrl+shift+s', ...shortcuts['ctrl+shift+s'] }
    ],
    general: [
      { key: 'ctrl+shift+t', ...shortcuts['ctrl+shift+t'] },
      { key: 'esc', ...shortcuts['esc'] },
      { key: '?', ...shortcuts['?'] }
    ]
  };
};
