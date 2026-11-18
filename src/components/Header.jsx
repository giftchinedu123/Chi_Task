import { useTasks } from '../context/TaskContext.jsx';
import { MenuDropdown } from './MenuDropdown.jsx';

export function Header() {
  const {
    selectedDayInfo,
    selectedDayStats,
    reminderPermission,
    notificationsSupported,
    requestReminderPermission,
  } = useTasks();

  const progressText =
    selectedDayStats.total === 0
      ? '0 tasks'
      : `${selectedDayStats.completed} of ${selectedDayStats.total} done`;

  const remindersUnavailable =
    !notificationsSupported || reminderPermission === 'denied';

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="header-title-group">
          <h1 className="app-title">My Tasks</h1>
          <p className="app-date">{selectedDayInfo.fullDate}</p>
        </div>
        <MenuDropdown />
      </div>

      <div className="header-meta-row">
        <p className="progress-line">{progressText}</p>

        {reminderPermission === 'default' && (
          <button
            type="button"
            className="reminder-enable-btn"
            onClick={requestReminderPermission}
          >
            Enable reminders
          </button>
        )}
      </div>

      {remindersUnavailable && (
        <p className="reminder-off-note">
          Reminders are off. Enable notifications in your browser settings.
        </p>
      )}
    </header>
  );
}
