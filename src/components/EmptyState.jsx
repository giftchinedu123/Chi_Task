import { EmptyTasksIcon } from './Icons.jsx';

export function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon">
        <EmptyTasksIcon size={34} />
      </div>
      <p className="empty-state-title">Nothing planned for this day</p>
      <p className="empty-state-subtitle">
        Add a task below to organize your schedule.
      </p>
    </div>
  );
}
