import { useRef, useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { PlusIcon } from './Icons.jsx';

export function AddTaskForm() {
  const {
    addTask,
    reminderPermission,
    requestReminderPermission,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Please enter a task before adding.');
      inputRef.current?.focus();
      return;
    }

    // Request notification permission only after a user gesture when saving a timed task
    if (time && reminderPermission === 'default') {
      requestReminderPermission();
    }

    addTask(trimmed, time);
    setTitle('');
    setTime('');
    setError('');
  };

  return (
    <footer className="add-task-footer">
      <form className="add-task-form" onSubmit={handleSubmit} noValidate>
        <div className={`add-task-bar${error ? ' has-error' : ''}`}>
          <span className="add-task-leading-icon" aria-hidden="true">
            <PlusIcon size={17} />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="add-task-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Add a new task…"
            aria-label="New task title"
            aria-invalid={Boolean(error)}
          />

          <input
            type="time"
            className="add-task-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Reminder time (optional)"
          />

          <button
            type="submit"
            className="add-task-submit"
            aria-label="Add task"
          >
            Add
          </button>
        </div>

        {error && (
          <p className="inline-error add-task-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </footer>
  );
}
