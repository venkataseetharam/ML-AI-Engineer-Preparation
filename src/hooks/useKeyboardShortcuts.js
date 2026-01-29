import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts, enabled = true) {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Build the key combination string
    const parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');

    // Add the key itself (lowercase)
    const key = event.key.toLowerCase();
    parts.push(key);

    const combination = parts.join('+');

    // Check if this combination has a handler
    const handler = shortcuts[combination];

    if (handler) {
      // Prevent default browser behavior
      event.preventDefault();
      event.stopPropagation();

      // Execute the handler
      if (typeof handler === 'function') {
        handler();
      } else if (handler.action && typeof handler.action === 'function') {
        handler.action();
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcuts;
