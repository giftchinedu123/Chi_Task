export const STORAGE_KEY = 'my_tasks_v1';

export const TASK_ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  EDIT_TASK: 'EDIT_TASK',
  DELETE_TASK: 'DELETE_TASK',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  CLEAR_ALL: 'CLEAR_ALL',
  MARK_NOTIFIED: 'MARK_NOTIFIED',
};


export function generateTaskId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `task-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}


export function initTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          item.title.trim().length > 0 &&
          typeof item.date === 'string'
      )
      .map((item) => ({
        id: item.id,
        title: item.title.trim(),
        date: item.date,
        time: typeof item.time === 'string' ? item.time : '',
        completed: Boolean(item.completed),
        notified: Boolean(item.notified),
        createdAt:
          typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

export function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD_TASK: {
      const title = action.payload?.title?.trim();
      if (!title) return state;

      const newTask = {
        id: generateTaskId(),
        title,
        date: action.payload.date,
        time: action.payload.time || '',
        completed: false,
        notified: false,
        createdAt: Date.now(),
      };
      return [...state, newTask];
    }

    case TASK_ACTIONS.TOGGLE_TASK: {
      const targetId = action.payload?.id;
      return state.map((task) =>
        task.id === targetId ? { ...task, completed: !task.completed } : task
      );
    }

    case TASK_ACTIONS.EDIT_TASK: {
      const { id, title, time, date } = action.payload || {};
      const trimmedTitle = typeof title === 'string' ? title.trim() : '';
      if (!trimmedTitle) return state;

      return state.map((task) => {
        if (task.id !== id) return task;

        const nextTime = typeof time === 'string' ? time : task.time;
        const nextDate = typeof date === 'string' ? date : task.date;
        const scheduleChanged =
          nextTime !== task.time || nextDate !== task.date;

        return {
          ...task,
          title: trimmedTitle,
          time: nextTime,
          date: nextDate,
         
          notified: scheduleChanged ? false : task.notified,
        };
      });
    }

    case TASK_ACTIONS.DELETE_TASK: {
      const targetId = action.payload?.id;
      return state.filter((task) => task.id !== targetId);
    }

    case TASK_ACTIONS.CLEAR_COMPLETED: {
      const targetDate = action.payload?.date;
      if (targetDate) {
        return state.filter(
          (task) => !(task.date === targetDate && task.completed)
        );
      }
      return state.filter((task) => !task.completed);
    }

    case TASK_ACTIONS.CLEAR_ALL: {
      return [];
    }

    case TASK_ACTIONS.MARK_NOTIFIED: {
      const targetId = action.payload?.id;
      return state.map((task) =>
        task.id === targetId ? { ...task, notified: true } : task
      );
    }

    default:
      return state;
  }
}
