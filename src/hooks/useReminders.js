import { useCallback, useEffect, useState } from 'react';
import { formatTime12h, getScheduledTimestamp } from '../utils/dates.js';

const CHECK_INTERVAL_MS = 25 * 1000;
const REMINDER_WINDOW_MS = 5 * 60 * 1000;

function getInitialPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    return window.Notification.permission;
  } catch {
    return 'unsupported';
  }
}

/**
 * Schedules gentle one-time browser notifications for tasks due today.
 * Note: Browser Notification API timers only run while this page/tab remains open.
 */
export function useReminders(tasks, todayKey, markNotified) {
  const [permission, setPermission] = useState(getInitialPermission);

  const notificationsSupported = permission !== 'unsupported';

  // Sync permission state if the user changes browser settings while the tab is open
  useEffect(() => {
    if (!notificationsSupported) return undefined;

    const syncPermission = () => {
      try {
        setPermission(window.Notification.permission);
      } catch {
        setPermission('unsupported');
      }
    };

    document.addEventListener('visibilitychange', syncPermission);
    return () => {
      document.removeEventListener('visibilitychange', syncPermission);
    };
  }, [notificationsSupported]);

  // Must only be called in response to a direct user gesture (e.g., saving a timed task or clicking "Enable reminders")
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported';
    }

    try {
      const current = window.Notification.permission;
      if (current === 'granted' || current === 'denied') {
        setPermission(current);
        return current;
      }

      const result = await window.Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return permission;
    }
  }, [permission]);

  // Check every 25 seconds for due tasks scheduled today within a 5-minute window
  useEffect(() => {
    if (!notificationsSupported || permission !== 'granted') {
      return undefined;
    }

    const checkDueTasks = () => {
      const nowMs = Date.now();

      tasks.forEach((task) => {
        if (
          task.date !== todayKey ||
          !task.time ||
          task.completed ||
          task.notified
        ) {
          return;
        }

        const scheduledMs = getScheduledTimestamp(task.date, task.time);
        if (scheduledMs === null) return;

        const elapsedMs = nowMs - scheduledMs;
        if (elapsedMs >= 0 && elapsedMs <= REMINDER_WINDOW_MS) {
          try {
            new window.Notification(`Time to start: ${task.title}`, {
              body: `Scheduled for ${formatTime12h(task.time)}`,
              silent: false,
            });
          } catch {
            // Fail gracefully if the browser blocks Notification construction
          }
          markNotified(task.id);
        }
      });
    };

    checkDueTasks();
    const intervalId = window.setInterval(checkDueTasks, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [tasks, todayKey, permission, notificationsSupported, markNotified]);

  return {
    permission,
    notificationsSupported,
    requestPermission,
  };
}
