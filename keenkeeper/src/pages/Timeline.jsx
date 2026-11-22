import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MessageSquare, Phone, Sparkles, Trash2, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTimeline } from '../context/TimelineContext';
import { cx, dayHeading, formatTime, interactionIconPath } from '../lib/utils';

const FILTERS = [
  { key: 'All', label: 'All moments', Icon: Layers },
  { key: 'Call', label: 'Calls', Icon: Phone },
  { key: 'Text', label: 'Texts', Icon: MessageSquare },
  { key: 'Video', label: 'Videos', Icon: Video },
];

export default function Timeline() {
  const { timelineEntries, clearTimeline } = useTimeline();
  const [filter, setFilter] = useState('All');

  const counts = useMemo(
    () => ({
      All: timelineEntries.length,
      Call: timelineEntries.filter((entry) => entry.type === 'Call').length,
      Text: timelineEntries.filter((entry) => entry.type === 'Text').length,
      Video: timelineEntries.filter((entry) => entry.type === 'Video').length,
    }),
    [timelineEntries],
  );

  const groups = useMemo(() => {
    const filtered =
      filter === 'All' ? timelineEntries : timelineEntries.filter((entry) => entry.type === filter);

    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const map = new Map();

    sorted.forEach((entry) => {
      const key = new Date(entry.createdAt).toDateString();
      if (!map.has(key)) {
        map.set(key, { key, label: dayHeading(entry.createdAt), entries: [] });
      }
      map.get(key).entries.push(entry);
    });

    return [...map.values()];
  }, [timelineEntries, filter]);

  const handleClear = () => {
    if (!window.confirm('Clear every logged moment? This cannot be undone.')) return;
    clearTimeline();
    toast.success('Timeline cleared');
  };

  const total = timelineEntries.length;

  return (
    <div className="page py-10 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> Activity
          </p>
          <h1 className="mt-2 text-3xl text-ink sm:text-4xl">Your timeline</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Every call, text and video you log lands here — a quiet record of the friendships you are keeping
            warm.
          </p>
        </div>

        {total > 0 && (
          <button type="button" onClick={handleClear} className="btn btn-outline btn-sm self-start sm:self-auto">
            <Trash2 size={14} />
            Clear timeline
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            data-active={filter === key}
            className="chip"
          >
            <Icon size={14} />
            {label}
            <span
              className={cx(
                'rounded-full px-1.5 text-[10px] font-bold',
                filter === key ? 'bg-white/20 text-white' : 'bg-ink/5 text-ink-soft',
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {groups.length > 0 ? (
        <div className="mt-9 space-y-10">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="flex items-center gap-3">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft/70">
                  {group.label}
                </h2>
                <span className="h-px flex-1 bg-ink/10" />
                <span className="text-[11px] font-medium text-ink-soft/60">
                  {group.entries.length} {group.entries.length === 1 ? 'moment' : 'moments'}
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="card flex items-center gap-4 p-4 sm:p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream">
                      <img src={interactionIconPath(entry.type)} alt="" className="h-5 w-5 object-contain" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink sm:text-base">{entry.title}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {formatTime(entry.createdAt)} · {group.label}
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-mist px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand sm:inline-flex">
                      {entry.type}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="card mt-9 flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-brand">
            <Layers size={24} />
          </span>
          <h2 className="mt-4 text-xl text-ink">
            {total === 0 ? 'No moments logged yet' : `No ${filter.toLowerCase()} moments yet`}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            Open a friend&rsquo;s profile and tap a check-in button — it takes five seconds and keeps a
            friendship alive.
          </p>
          <Link to="/" className="btn btn-primary mt-6">
            Go to your friends
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
