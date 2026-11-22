export const STATUS_META = {
  'on-track': {
    label: 'On track',
    hint: 'Right on rhythm',
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-200',
    hex: '#2f7d5c',
  },
  upcoming: {
    label: 'Upcoming',
    hint: 'Due soon',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-200',
    hex: '#b58128',
  },
  overdue: {
    label: 'Overdue',
    hint: 'Needs a nudge',
    dot: 'bg-rose-500',
    text: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-200',
    hex: '#b8463f',
  },
};

export const statusMeta = (status) => STATUS_META[status] ?? STATUS_META.upcoming;

export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

export function computeStatus(days, goal) {
  const elapsed = Number(days) || 0;
  const target = Number(goal) || 14;
  if (elapsed >= target) return 'overdue';
  if (elapsed >= target * 0.65) return 'upcoming';
  return 'on-track';
}

export function goalProgress(friend) {
  const goal = Number(friend?.goal) || 14;
  const days = Number(friend?.days_since_contact) || 0;
  return Math.max(0, Math.min(100, Math.round((days / goal) * 100)));
}

export function daysLabel(days) {
  const value = Number(days) || 0;
  if (value <= 0) return 'Today';
  if (value === 1) return '1 day ago';
  return `${value} days ago`;
}

export function dueLabel(friend) {
  const goal = Number(friend?.goal) || 14;
  const days = Number(friend?.days_since_contact) || 0;
  const remaining = goal - days;
  if (remaining > 1) return `in ${remaining} days`;
  if (remaining === 1) return 'tomorrow';
  if (remaining === 0) return 'today';
  return `${Math.abs(remaining)} days overdue`;
}

export function nextDueDate(friend) {
  const goal = Number(friend?.goal) || 14;
  const days = Number(friend?.days_since_contact) || 0;
  const date = new Date();
  date.setDate(date.getDate() + (goal - days));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export function dayHeading(iso) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export const INTERACTION_META = {
  Call: { label: 'Call', hex: '#2f6a50' },
  Text: { label: 'Text', hex: '#c9963f' },
  Video: { label: 'Video', hex: '#4f7d9c' },
};

export const interactionMeta = (type) => INTERACTION_META[type] ?? INTERACTION_META.Call;

export const interactionIconPath = (type) => `/assets/${String(type).toLowerCase()}.png`;
