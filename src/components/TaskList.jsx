import { useTasks } from '../context/TaskContext.jsx';
import { EmptyState } from './EmptyState.jsx';
import { TaskItem } from './TaskItem.jsx';

export function TaskList() {
  const { tasksForSelectedDay, selectedDayInfo } = useTasks();

  return (
    <section
      className="task-list-section"
      aria-label={`Tasks for ${selectedDayInfo.fullDate}`}
    >
      {tasksForSelectedDay.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="task-list">
          {tasksForSelectedDay.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  );
}
