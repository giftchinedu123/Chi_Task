export function MoreDotsIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="19" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ size = 13 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <polyline points="12 7 12 12 15.25 13.75" />
    </svg>
  );
}

export function CircleCheckIcon({ completed = false, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`circle-check-svg${completed ? ' is-completed' : ''}`}
    >
      <circle
        cx="12"
        cy="12"
        r="9.75"
        className="circle-check-ring"
        strokeWidth="1.5"
      />
      <path
        d="M8.25 12.25L10.75 14.75L15.75 9.5"
        className="circle-check-mark"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PencilIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L7.5 18.79l-4.2 1.05 1.05-4.2L16.862 3.487Z" />
      <path d="M14.5 5.85l3.65 3.65" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V4.75A1.25 1.25 0 0 1 10.75 3.5h2.5A1.25 1.25 0 0 1 14.5 4.75V6.5" />
      <path d="M6.5 6.5l.85 12.25A1.5 1.5 0 0 0 8.85 20h6.3a1.5 1.5 0 0 0 1.5-1.25L17.5 6.5" />
      <path d="M10 10.5v5.5" />
      <path d="M14 10.5v5.5" />
    </svg>
  );
}

export function PlusIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function EmptyTasksIcon({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4.5" width="16" height="15.5" rx="3" />
      <path d="M8 2.75v3" />
      <path d="M16 2.75v3" />
      <path d="M4 9h16" />
      <path d="M9.25 14l1.85 1.85 3.75-3.85" />
    </svg>
  );
}
