const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


export function formatLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export function parseLocalDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}


export function formatFullDate(dateOrKey) {
  const date =
    typeof dateOrKey === 'string' ? parseLocalDateKey(dateOrKey) : dateOrKey;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}


export function getCurrentWeekDays(referenceDate = new Date()) {
  const todayKey = formatLocalDateKey(referenceDate);
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const dayOfMonth = referenceDate.getDate();
  const dayOfWeek = referenceDate.getDay();

 
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  return Array.from({ length: 7 }, (_, index) => {
    const localDate = new Date(year, month, dayOfMonth + diffToMonday + index);
    const dateKey = formatLocalDateKey(localDate);
    const shortDay = SHORT_DAYS[localDate.getDay()];
    const shortDate = `${localDate.getDate()} ${SHORT_MONTHS[localDate.getMonth()]}`;
    const fullDate = formatFullDate(localDate);

    return {
      dateKey,
      shortDay,
      shortDate,
      fullDate,
      isToday: dateKey === todayKey,
    };
  });
}


export function formatTime12h(time24) {
  if (!time24 || !time24.includes(':')) return '';
  const [rawHours, rawMinutes] = time24.split(':').map(Number);
  if (Number.isNaN(rawHours) || Number.isNaN(rawMinutes)) return '';

  const period = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const minutes = String(rawMinutes).padStart(2, '0');
  return `${hours12}:${minutes} ${period}`;
}


export function getMsUntilNextMidnight(now = new Date()) {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    50
  );
  return Math.max(1000, nextMidnight.getTime() - now.getTime());
}


export function getScheduledTimestamp(dateKey, time24) {
  if (!dateKey || !time24 || !time24.includes(':')) return null;
  const [year, month, day] = dateKey.split('-').map(Number);
  const [hours, minutes] = time24.split(':').map(Number);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }
  return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
}
