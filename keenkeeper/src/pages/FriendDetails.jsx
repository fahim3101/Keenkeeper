import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Archive,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Target,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useFriends } from '../context/FriendsContext';
import { useTimeline } from '../context/TimelineContext';
import Avatar from '../components/Avatar';
import {
  cx,
  dayHeading,
  daysLabel,
  dueLabel,
  formatTime,
  goalProgress,
  interactionIconPath,
  nextDueDate,
  statusMeta,
} from '../lib/utils';

const CHECK_INS = [
  { type: 'Call', label: 'Phone call', hint: 'Catch up out loud', Icon: Phone },
  { type: 'Text', label: 'Text', hint: 'A quick hello', Icon: MessageSquare },
  { type: 'Video', label: 'Video', hint: 'Face to face', Icon: Video },
];

export default function FriendDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { friends, loading, removeFriend, snoozeFriend, updateFriend } = useFriends();
  const { timelineEntries, addInteraction } = useTimeline();

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState('');
  const [logging, setLogging] = useState(null);

  const friend = friends.find((item) => String(item.id) === String(id));

  const moments = useMemo(
    () => timelineEntries.filter((entry) => entry.friendName === friend?.name).slice(0, 5),
    [timelineEntries, friend?.name],
  );

  const handleCheckIn = (type) => {
    if (!friend || logging) return;
    setLogging(type);
    addInteraction(type, friend.name);
    toast.success(`${type} with ${friend.name} logged`);
    window.setTimeout(() => setLogging(null), 900);
  };

  const handleSnooze = () => {
    snoozeFriend(friend.id, 14);
    toast.success(`${friend.name} snoozed for two weeks`);
  };

  const handleArchive = () => {
    removeFriend(friend.id);
    toast.success(`${friend.name} archived`);
    navigate('/');
  };

  const handleDelete = () => {
    if (!window.confirm(`Remove ${friend.name} from your shelf? This cannot be undone.`)) return;
    removeFriend(friend.id);
    toast.success(`${friend.name} removed`);
    navigate('/');
  };

  const startEditing = () => {
    setGoalDraft(String(friend.goal));
    setEditingGoal(true);
  };

  const saveGoal = (event) => {
    event.preventDefault();
    const nextGoal = Math.max(1, Number(goalDraft) || friend.goal);
    updateFriend(friend.id, { goal: nextGoal });
    setEditingGoal(false);
    toast.success(`Rhythm updated to every ${nextGoal} days`);
  };

  if (loading) {
    return (
      <div className="page py-14">
        <div className="skeleton h-4 w-40" />
        <div className="mt-6 h-56 rounded-4xl skeleton" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="h-32 skeleton lg:col-span-2" />
          <div className="h-32 skeleton" />
        </div>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="page py-20">
        <div className="card mx-auto max-w-lg px-6 py-14 text-center">
          <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-mist text-brand">
            <Clock3 size={24} />
          </span>
          <h1 className="mt-4 text-2xl">This friend is not on your shelf</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            They may have been archived or the link is out of date.
          </p>
          <Link to="/" className="btn btn-primary mt-6">
            <ArrowLeft size={16} />
            Back to your friends
          </Link>
        </div>
      </div>
    );
  }

  const meta = statusMeta(friend.status);
  const progress = goalProgress(friend);

  return (
    <div className="page py-10 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-brand"
      >
        <ArrowLeft size={16} />
        Back to your friends
      </Link>

      {/* Profile header */}
      <div className="relative mt-5 overflow-hidden rounded-4xl bg-brand text-white shadow-lift">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-7 sm:p-10 md:flex-row md:items-center">
          <Avatar friend={friend} size="xl" className="ring-4 ring-white/15" />

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
              <span className={cx('h-1.5 w-1.5 rounded-full', meta.dot)} />
              {meta.label} · {meta.hint}
            </span>

            <h1 className="mt-3 text-3xl text-white sm:text-4xl">{friend.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">{friend.bio}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {friend.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80"
                >
                  {tag}
                </span>
              ))}

              {friend.email && (
                <a
                  href={`mailto:${friend.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70 transition hover:border-white/40 hover:text-white"
                >
                  <Mail size={12} />
                  {friend.email}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:w-48 md:flex-col">
            <button
              type="button"
              onClick={handleSnooze}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <Clock3 size={14} />
              Snooze 2 weeks
            </button>
            <button
              type="button"
              onClick={handleArchive}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <Archive size={14} />
              Archive
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* Quick facts */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Days since contact',
                value: friend.days_since_contact,
                hint: daysLabel(friend.days_since_contact),
                Icon: Clock3,
              },
              {
                label: 'Relationship goal',
                value: `${friend.goal}d`,
                hint: 'Between hellos',
                Icon: Target,
              },
              {
                label: 'Next due',
                value: nextDueDate(friend),
                hint: dueLabel(friend),
                Icon: CalendarDays,
              },
            ].map(({ label, value, hint, Icon }) => (
              <div key={label} className="card p-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-brand">
                  <Icon size={16} />
                </span>
                <p className="mt-3 font-display text-xl font-semibold text-ink">{value}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                  {label}
                </p>
                <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>
              </div>
            ))}
          </div>

          {/* Relationship rhythm */}
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Relationship rhythm</p>
                <h2 className="mt-2 text-xl text-ink">Contact every {friend.goal} days</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  You are at {progress}% of this cycle — {dueLabel(friend)}.
                </p>
              </div>

              {!editingGoal && (
                <button type="button" onClick={startEditing} className="btn btn-outline btn-sm">
                  <Pencil size={14} />
                  Edit
                </button>
              )}
            </div>

            {editingGoal ? (
              <form onSubmit={saveGoal} className="mt-5 flex flex-wrap items-end gap-3">
                <div>
                  <label htmlFor="goal-days" className="label">
                    New rhythm (days)
                  </label>
                  <input
                    id="goal-days"
                    type="number"
                    min="1"
                    max="365"
                    value={goalDraft}
                    onChange={(event) => setGoalDraft(event.target.value)}
                    className="field w-32"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={14} />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGoal(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={14} />
                  Cancel
                </button>
              </form>
            ) : (
              <div className="mt-6">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist">
                  <span
                    className={cx('block h-full rounded-full transition-all duration-700', meta.dot)}
                    style={{ width: `${Math.max(progress, 3)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/60">
                  <span>Last hello</span>
                  <span>{friend.goal} day goal</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick check-in */}
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Quick check-in</p>
                <h2 className="mt-2 text-xl text-ink">Reach out to {friend.name.split(' ')[0]}</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {CHECK_INS.map(({ type, label, hint, Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleCheckIn(type)}
                  disabled={Boolean(logging)}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-mist/40 disabled:opacity-70"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-mist text-brand transition group-hover:bg-brand group-hover:text-white">
                    {logging === type ? <Check size={18} /> : <Icon size={18} />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{label}</span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent moments */}
        <div className="card h-fit p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Recent moments</p>
              <h2 className="mt-2 text-xl text-ink">Your last hellos</h2>
            </div>
            <Link to="/timeline" className="text-xs font-semibold text-brand hover:underline">
              All
            </Link>
          </div>

          {moments.length > 0 ? (
            <ul className="mt-5 space-y-4">
              {moments.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream">
                    <img
                      src={interactionIconPath(entry.type)}
                      alt=""
                      className="h-4 w-4 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{entry.type}</p>
                    <p className="text-xs text-ink-soft">
                      {dayHeading(entry.createdAt)} · {formatTime(entry.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-ink/10 px-4 py-8 text-center text-sm text-ink-soft">
              No moments logged yet. A quick check-in will show up here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
