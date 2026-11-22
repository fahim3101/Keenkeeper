import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { formatDate } from '../lib/utils';

export const TimelineContext = createContext(null);

const STORAGE_KEY = 'kk.timeline.v1';

const SEED = [
  ['Call', 'Sajid', 0.3],
  ['Text', 'Adnan', 1.2],
  ['Video', 'Tanvir', 2.4],
  ['Call', 'Nabil', 3.1],
  ['Text', 'Ishraq', 4.6],
  ['Video', 'Sakib', 5.3],
  ['Call', 'Abrar', 6.4],
  ['Text', 'Zayan', 8.2],
  ['Call', 'Rayhan', 9.5],
  ['Text', 'Muntasir', 11.4],
];

function buildEntry(type, friendName, daysAgo, id) {
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return {
    id,
    type,
    friendName,
    title: `${type} with ${friendName}`,
    createdAt,
    date: formatDate(createdAt),
  };
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through to the seeded demo timeline */
  }

  return SEED.map(([type, name, daysAgo], index) => buildEntry(type, name, daysAgo, `seed-${index}`));
}

export function TimelineProvider({ children }) {
  const [timelineEntries, setTimelineEntries] = useState(loadEntries);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineEntries));
    } catch {
      /* storage is optional */
    }
  }, [timelineEntries]);

  const addInteraction = useCallback((interactionType, friendName) => {
    const createdAt = new Date().toISOString();
    const entry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: interactionType,
      friendName,
      title: `${interactionType} with ${friendName}`,
      createdAt,
      date: formatDate(createdAt),
    };

    setTimelineEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const clearTimeline = useCallback(() => setTimelineEntries([]), []);

  const value = useMemo(
    () => ({ timelineEntries, addInteraction, clearTimeline }),
    [timelineEntries, addInteraction, clearTimeline],
  );

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export const useTimeline = () => useContext(TimelineContext);
