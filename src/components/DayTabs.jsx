import { useRef } from 'react';
import { useTasks } from '../context/TaskContext.jsx';

export function DayTabs() {
  const { weekDays, selectedDate, setSelectedDate, countsByDay } = useTasks();
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % weekDays.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + weekDays.length) % weekDays.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = weekDays.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const targetDay = weekDays[nextIndex];
      setSelectedDate(targetDay.dateKey);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <nav className="day-tabs-nav" aria-label="Current week">
      <div className="day-tabs-track" role="tablist" aria-label="Days of the week">
        {weekDays.map((day, index) => {
          const isSelected = day.dateKey === selectedDate;
          const dayCounts = countsByDay[day.dateKey];
          const hasTasks = Boolean(dayCounts && dayCounts.total > 0);

          const ariaLabelParts = [day.fullDate];
          if (day.isToday) ariaLabelParts.push('Today');
          if (hasTasks) {
            ariaLabelParts.push(
              `${dayCounts.total} ${dayCounts.total === 1 ? 'task' : 'tasks'}`
            );
          }

          return (
            <button
              key={day.dateKey}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={ariaLabelParts.join(', ')}
              tabIndex={isSelected ? 0 : -1}
              className={`day-tab${isSelected ? ' is-selected' : ''}${
                day.isToday ? ' is-today' : ''
              }`}
              onClick={() => setSelectedDate(day.dateKey)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="day-tab-name">
                {day.shortDay}
                {day.isToday && (
                  <span className="today-dot" aria-hidden="true" />
                )}
              </span>
              <span className="day-tab-date">{day.shortDate}</span>
              <span
                className={`tasks-dot${hasTasks ? ' is-visible' : ''}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
