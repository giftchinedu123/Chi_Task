import { useEffect, useRef, useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { formatTime12h } from '../utils/dates.js';
import {
  CircleCheckIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from './Icons.jsx';

export function TaskItem({ task }) {
  const {
    toggleTask,
    editTask,
    deleteTask,
    reminderPermission,
    requestReminderPermission,
  } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.time);
  const [editError, setEditError] = useState('');

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditTitle(task.title);
    setEditTime(task.time || '');
    setEditError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditTitle(task.title);
    setEditTime(task.time || '');
    setEditError('');
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditError('Task title cannot be empty.');
      titleInputRef.current?.focus();
      return;
    }

    if (editTime && reminderPermission === 'default') {
      requestReminderPermission();
    }

    editTask(task.id, trimmed, editTime, task.date);
    setEditError('');
    setIsEditing(false);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <li className="task-card is-editing">
        <form
          className="task-edit-form"
          onSubmit={handleSave}
          onKeyDown={handleEditKeyDown}
          noValidate
        >
          <div className="task-edit-fields">
            <input
              ref={titleInputRef}
              type="text"
              className="task-edit-title-input"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError('');
              }}
              placeholder="Task title"
              aria-label="Edit task title"
            />
            <input
              type="time"
              className="task-edit-time-input"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              aria-label="Edit task time"
            />
          </div>

          {editError && (
            <p className="inline-error" role="alert">
              {editError}
            </p>
          )}

          <div className="task-edit-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={cancelEditing}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </li>
    );
  }

  const formattedTime = formatTime12h(task.time);

  return (
    <li className={`task-card${task.completed ? ' is-completed' : ''}`}>
      <div
        className="task-card-body"
        onClick={() => toggleTask(task.id)}
      >
        <p className="task-title">{task.title}</p>
        {formattedTime && (
          <div className="task-time">
            <ClockIcon size={13} />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn task-action-btn"
          onClick={startEditing}
          aria-label={`Edit "${task.title}"`}
        >
          <PencilIcon size={16} />
        </button>

        <button
          type="button"
          className="icon-btn task-action-btn"
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          <TrashIcon size={16} />
        </button>

        <button
          type="button"
          className="icon-btn task-check-btn"
          aria-pressed={task.completed}
          aria-label={
            task.completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as complete`
          }
          onClick={() => toggleTask(task.id)}
        >
          <CircleCheckIcon completed={task.completed} size={22} />
        </button>
      </div>
    </li>
  );
}
