// Minimal inline icon set (24x24, stroke-based) matching the soft Osmium look.
type P = { className?: string; strokeWidth?: number };
const base = (p: P) => ({
  className: p.className ?? "w-6 h-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.strokeWidth ?? 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
});

export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.7A8 8 0 1 1 21 12Z" />
    <path d="M8.5 12h7" />
  </svg>
);

export const ClipboardIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="m8.7 13 2.2 2.2 4.4-4.4" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9.5a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5Z" />
    <path d="M10 18.5a2.1 2.1 0 0 0 4 0" />
  </svg>
);

export const ArrowLeftIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const ArrowRightIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const BookmarkIcon = ({
  className,
  filled,
}: P & { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "w-6 h-6"}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 4.5h12V21l-6-4-6 4V4.5Z" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 5 5L19 7" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 14h10l1-14M9 7V4h6v3" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
  </svg>
);

export const BookIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </svg>
);

export const CardsIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="7" y="3" width="13" height="16" rx="2" />
    <path d="M4 7v12a2 2 0 0 0 2 2h11" />
  </svg>
);

export const ChevronRightIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronDownIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const LogoutIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H15" />
    <path d="M10 12h10m0 0-3.5-3.5M20 12l-3.5 3.5" />
  </svg>
);

export const SendIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m4 12 16-7-4.5 14L11 13.5 4 12Z" />
    <path d="M11 13.5 20 5" />
  </svg>
);

export const FireIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3s1 2.5-1 5c-1.2 1.5-2.5 2.6-2.5 5A5.5 5.5 0 0 0 12 18.5 5.5 5.5 0 0 0 17.5 13c0-2-1-3.5-2-4.5 0 1-.5 2-1.5 2.5.5-2.5-.5-6-2-8Z" />
  </svg>
);

export const GemLogo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className ?? "w-6 h-6"} fill="none">
    <defs>
      <linearGradient id="gemg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0a868" />
        <stop offset="100%" stopColor="#d96f45" />
      </linearGradient>
    </defs>
    <path d="M12 2 5.5 8.5 12 22l6.5-13.5L12 2Z" fill="url(#gemg)" />
    <path
      d="M12 2 5.5 8.5 12 22l6.5-13.5L12 2Z"
      stroke="#b95c38"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <path d="m8.5 8.5 3.5 3 3.5-3" stroke="#fbe3cd" strokeWidth="0.8" fill="none" />
  </svg>
);
