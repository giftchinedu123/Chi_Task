import { useEffect, useRef, useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { MoreDotsIcon } from './Icons.jsx';

export function MenuDropdown() {
  const {
    selectedDayStats,
    totalTaskCount,
    clearCompletedForSelectedDay,
    clearAllTasks,
  } = useTasks();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const closeMenu = () => {
    setIsOpen(false);
    setConfirmClearAll(false);
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) setConfirmClearAll(false);
      return !prev;
    });
  };

  const handleClearCompleted = () => {
    clearCompletedForSelectedDay();
    closeMenu();
  };

  const handleConfirmClearAll = () => {
    clearAllTasks();
    closeMenu();
  };

  const hasCompletedOnSelectedDay = selectedDayStats.completed > 0;
  const hasAnyTasks = totalTaskCount > 0;

  return (
    <div className="menu-wrapper" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="icon-btn menu-trigger"
        onClick={handleToggle}
        aria-label="Task actions menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreDotsIcon size={20} />
      </button>

      {isOpen && (
        <div className="menu-dropdown" role="menu" aria-label="Task actions">
          {!confirmClearAll ? (
            <>
              <button
                type="button"
                role="menuitem"
                className="menu-item"
                disabled={!hasCompletedOnSelectedDay}
                onClick={handleClearCompleted}
              >
                Clear completed tasks
              </button>
              <button
                type="button"
                role="menuitem"
                className="menu-item menu-item-danger"
                disabled={!hasAnyTasks}
                onClick={() => setConfirmClearAll(true)}
              >
                Clear all tasks
              </button>
            </>
          ) : (
            <div className="menu-confirm" role="alertdialog" aria-label="Confirm clear all tasks">
              <p className="menu-confirm-text">
                Delete all tasks across every day?
              </p>
              <div className="menu-confirm-actions">
                <button
                  type="button"
                  className="menu-confirm-btn menu-confirm-cancel"
                  onClick={() => setConfirmClearAll(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="menu-confirm-btn menu-confirm-yes"
                  onClick={handleConfirmClearAll}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
