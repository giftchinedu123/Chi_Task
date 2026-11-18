import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  STORAGE_KEY,
  TASK_ACTIONS,
  initTasks,
  taskReducer,
} from '../reducers/taskReducer.js';
import {
  formatLocalDateKey,
  getCurrentWeekDays,
  getMsUntilNextMidnight,
} from '../utils/dates.js';
import { useReminders } from '../hooks/useReminders.js';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, initTasks);

  // Track current local day so the week and "today" stay accurate across midnight and tab switches
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const todayKey = useMemo(
    () => formatLocalDateKey(referenceDate),
    [referenceDate]
  );

  const [selectedDate, setSelectedDate] = useState(() =>
    formatLocalDateKey(new Date())
  );

  // Persist tasks to localStorage on every state update
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota or private browsing errors gracefully
    }
  }, [tasks]);

  // Recompute week & today at local midnight and when the tab becomes visible again
  useEffect(() => {
    let midnightTimeoutId;

    const refreshClock = () => {
      const now = new Date();
      const nextTodayKey = formatLocalDateKey(now);

      setReferenceDate((prevDate) => {
        const prevTodayKey = formatLocalDateKey(prevDate);
        if (prevTodayKey !== nextTodayKey) {
          // If the user was viewing the previous "today", move selection forward to the new today
          setSelectedDate((prevSelected) =>
            prevSelected === prevTodayKey ? nextTodayKey : prevSelected
          );
          return now;
        }
        return prevDate;
      });
    };

    const scheduleMidnightRefresh = () => {
      const msUntilMidnight = getMsUntilNextMidnight(new Date());
      midnightTimeoutId = window.setTimeout(() => {
        refreshClock();
        scheduleMidnightRefresh();
      }, msUntilMidnight);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshClock();
      }
    };

    scheduleMidnightRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(midnightTimeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const weekDays = useMemo(
    () => getCurrentWeekDays(referenceDate),
    [referenceDate]
  );

  // Ensure selectedDate stays within the visible week if the week rolls over
  useEffect(() => {
    const isInCurrentWeek = weekDays.some((d) => d.dateKey === selectedDate);
    if (!isInCurrentWeek) {
      setSelectedDate(todayKey);
    }
  }, [weekDays, selectedDate, todayKey]);

  // Meaningful reduce: compute total & completed counts per day across the whole task list
  const countsByDay = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = { total: 0, completed: 0 };
      }
      acc[task.date].total += 1;
      if (task.completed) {
        acc[task.date].completed += 1;
      }
      return acc;
    }, {});
  }, [tasks]);

  // Meaningful filter + sort: tasks for the selected day sorted chronologically (untimed tasks last)
  const tasksForSelectedDay = useMemo(() => {
    return tasks
      .filter((task) => task.date === selectedDate)
      .sort((a, b) => {
        if (a.time && b.time) {
          const cmp = a.time.localeCompare(b.time);
          return cmp !== 0 ? cmp : a.createdAt - b.createdAt;
        }
        if (a.time && !b.time) return -1;
        if (!a.time && b.time) return 1;
        return a.createdAt - b.createdAt;
      });
  }, [tasks, selectedDate]);

  // Meaningful reduce: completed count for the selected day
  const selectedDayStats = useMemo(() => {
    return tasksForSelectedDay.reduce(
      (acc, task) => {
        acc.total += 1;
        if (task.completed) {
          acc.completed += 1;
        }
        return acc;
      },
      { total: 0, completed: 0 }
    );
  }, [tasksForSelectedDay]);

  const selectedDayInfo = useMemo(() => {
    return (
      weekDays.find((day) => day.dateKey === selectedDate) ||
      weekDays.find((day) => day.isToday) ||
      weekDays[0]
    );
  }, [weekDays, selectedDate]);

  const addTask = useCallback(
    (title, time = '') => {
      dispatch({
        type: TASK_ACTIONS.ADD_TASK,
        payload: { title, time, date: selectedDate },
      });
    },
    [selectedDate]
  );

  const toggleTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE_TASK, payload: { id } });
  }, []);

  const editTask = useCallback((id, title, time, date) => {
    dispatch({
      type: TASK_ACTIONS.EDIT_TASK,
      payload: { id, title, time, date },
    });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: { id } });
  }, []);

  const clearCompletedForSelectedDay = useCallback(() => {
    dispatch({
      type: TASK_ACTIONS.CLEAR_COMPLETED,
      payload: { date: selectedDate },
    });
  }, [selectedDate]);

  const clearAllTasks = useCallback(() => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ALL });
  }, []);

  const markNotified = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.MARK_NOTIFIED, payload: { id } });
  }, []);

  const { permission, notificationsSupported, requestPermission } =
    useReminders(tasks, todayKey, markNotified);

  const value = useMemo(
    () => ({
      tasks,
      totalTaskCount: tasks.length,
      weekDays,
      todayKey,
      selectedDate,
      setSelectedDate,
      selectedDayInfo,
      tasksForSelectedDay,
      selectedDayStats,
      countsByDay,
      addTask,
      toggleTask,
      editTask,
      deleteTask,
      clearCompletedForSelectedDay,
      clearAllTasks,
      reminderPermission: permission,
      notificationsSupported,
      requestReminderPermission: requestPermission,
    }),
    [
      tasks,
      weekDays,
      todayKey,
      selectedDate,
      selectedDayInfo,
      tasksForSelectedDay,
      selectedDayStats,
      countsByDay,
      addTask,
      toggleTask,
      editTask,
      deleteTask,
      clearCompletedForSelectedDay,
      clearAllTasks,
      permission,
      notificationsSupported,
      requestPermission,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
