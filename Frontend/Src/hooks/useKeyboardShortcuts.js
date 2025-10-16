import { useEffect } from 'react';

export function useKeyboardShortcuts({
  onUndo,
  onResign,
  onRematch,
  onToggleChat,
  onFindGame,
  isGameActive,
  isPlayerTurn
}) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle shortcuts if no input is focused
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            onUndo?.();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            onResign?.();
          }
          break;
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            onRematch?.();
          }
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            onToggleChat?.();
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onFindGame?.();
          }
          break;
        // Arrow keys for navigating moves when it's not player's turn
        case 'arrowleft':
          if (!isPlayerTurn) {
            e.preventDefault();
            // Previous move logic
          }
          break;
        case 'arrowright':
          if (!isPlayerTurn) {
            e.preventDefault();
            // Next move logic
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onUndo, onResign, onRematch, onToggleChat, onFindGame, isGameActive, isPlayerTurn]);
}