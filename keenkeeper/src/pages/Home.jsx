import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  HeartHandshake,
  Phone,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useFriends } from '../context/FriendsContext';
import { useTimeline } from '../context/TimelineContext';
import Avatar from '../components/Avatar';
import FriendCard from '../components/FriendCard';
import AddFriendModal from '../components/AddFriendModal';
import { cx, daysLabel, dueLabel, goalProgress, statusMeta } from '../lib/utils';

const TONES = {
  brand: 'bg-brand/10 text-brand',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-700',
  gold: 'bg-amber-50 text-amber-700',
};

const SORTS = {
  attention: 'needs attention',
  recent: 'most recent',
  name: 'name',
};

export default function Home() {
  const { friends, loading } = useFriends();
  const { timelineEntries } = useTimeline();

  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('attention');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(params.get('add') === '1');
  }, [params]);

  const openModal = () =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('add', '1');
      return next;
    });

  const closeModal = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('add');
        return next;
      },
      { replace: true },
    );

  const counts = useMemo(
    () => ({
      all: friends.length,
      'on-track': friends.filter((friend) => friend.status === 'on-track').length,
      upcoming: friends.filter((friend) => friend.status === 'upcoming').length,
      overdue: friends.filter((friend) => friend.status === 'overdue').length,
    }),
    [friends],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = timelineEntries.filter((entry) => {
      const date = new Date(entry.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        label: 'Friends on the shelf',
        value: counts.all,
        hint: `${counts['on-track']} in a healthy rhythm`,
        icon: Users,
        tone: 'brand',
      },
      {
        label: 'Need a nudge',
        value: counts.overdue,
        hint: counts.overdue ? 'A short hello goes a long way' : 'Everyone is up to date',
        icon: HeartHandshake,
        tone: 'rose',
      },
      {
        label: 'On track',
        value: counts['on-track'],
        hint: 'Recently in touch',
        icon: Sparkles,
        tone: 'emerald',
      },
      {
        label: 'Moments this month',
        value: thisMonth,
        hint: 'Calls, texts and videos',
        icon: TrendingUp,
        tone: 'gold',
      },
    ];
  }, [counts, timelineEntries]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const order = { overdue: 0, upcoming: 1, 'on-track': 2 };

    return friends
      .filter((friend) => {
        const matchesStatus = statusFilter === 'all' || friend.status === statusFilter;
        const matchesTerm =
          !term ||
          friend.name.toLowerCase().includes(term) ||
          friend.tags.some((tag) => tag.toLowerCase().includes(term));
        return matchesStatus && matchesTerm;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'recent') return a.days_since_contact - b.days_since_contact;
        return (
          order[a.status] - order[b.status] || b.days_since_contact - a.days_since_contact
        );
      });
  }, [friends, query, sort, statusFilter]);

  const spotlight = friends.find((friend) => friend.status === 'overdue') ?? friends[0];
  const dueSoon = friends
    .filter((friend) => friend.status !== 'on-track' && friend.id !== spotlight?.id)
    .sort((a, b) => b.days_since_contact - a.days_since_contact)
    .slice(0, 3);

  const filters = [
    { key: 'all', label: 'Everyone', count: counts.all },
    { key: 'on-track', label: 'On track', count: counts['on-track'], dot: 'bg-emerald-500' },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming, dot: 'bg-amber-500' },
    { key: 'overdue', label: 'Overdue', count: counts.overdue, dot: 'bg-rose-500' },
  ];

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setSort('attention');
  };

  return (
    <>
      {/* Hero */}
      <section className="page relative overflow-hidden pb-12 pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <Sparkles size={14} /> A quieter way to stay close
            </span>

            <h1 className="mt-4 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Friends to keep <em className="not-italic text-brand">close</em> in your life
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
              KeenKeeper is your personal shelf of meaningful connections. Notice the last hello, spot who needs
              a nudge, and give the friendships that matter a little room to breathe.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={openModal} className="btn btn-primary">
                <Plus size={18} />
                Add a friend
              </button>
              <a href="#friends" className="btn btn-outline">
                Browse your shelf
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-3">
                {friends.slice(0, 5).map((friend) => (
                  <Avatar key={friend.id} friend={friend} size="sm" className="ring-2 ring-paper" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-ink-soft">
                <strong className="font-semibold text-ink">{counts.all} friends</strong> tended with care
                {counts.overdue > 0 && (
                  <>
                    {' · '}
                    <span className="font-medium text-clay">{counts.overdue} waiting for a hello</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Spotlight card */}
          <div className="animate-fade-up relative mx-auto w-full max-w-md" style={{ animationDelay: '120ms' }}>
            <div className="pointer-events-none absolute -left-10 top-6 h-44 w-44 rounded-full bg-sage/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-4 h-48 w-48 rounded-full bg-gold/25 blur-3xl" />

            <div className="card relative p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Today&rsquo;s nudge</p>
                  <h2 className="mt-2 text-xl">Say a small hello</h2>
                </div>
                <span className="rounded-full bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
                  Live
                </span>
              </div>

              {spotlight ? (
                <>
                  <div className="mt-5 flex items-center gap-4 rounded-2xl bg-cream/70 p-4">
                    <Avatar friend={spotlight} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-ink">{spotlight.name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {daysLabel(spotlight.days_since_contact)}
                        {spotlight.tags[0] ? ` · ${spotlight.tags[0]}` : ''}
                      </p>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white">
                        <span
                          className="block h-full rounded-full bg-clay"
                          style={{ width: `${Math.max(goalProgress(spotlight), 8)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {dueSoon.length > 0 && (
                    <div className="mt-5 space-y-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft/60">
                        Also due soon
                      </p>
                      {dueSoon.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-3">
                          <Avatar friend={friend} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="truncate font-semibold text-ink">{friend.name}</span>
                              <span className="shrink-0 text-ink-soft">{dueLabel(friend)}</span>
                            </div>
                            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-mist">
                              <span
                                className={cx('block h-full rounded-full', statusMeta(friend.status).dot)}
                                style={{ width: `${goalProgress(friend)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-6 text-sm text-ink-soft">
                  Add your first friend and KeenKeeper will start nudging you gently.
                </p>
              )}

              <Link
                to="/timeline"
                className="mt-6 flex items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 text-xs font-semibold text-ink-soft transition hover:border-brand/30 hover:text-brand"
              >
                See what you have been up to
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="animate-float card absolute -bottom-6 -left-2 hidden items-center gap-2 px-4 py-3 text-xs font-semibold text-brand sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-mist">
                <Phone size={13} />
              </span>
              Call logged just now
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="page">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, hint, icon: Icon, tone }, index) => (
            <div
              key={label}
              className="card animate-fade-up p-5"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className={cx('grid h-10 w-10 place-items-center rounded-xl', TONES[tone])}>
                  <Icon size={18} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft/40">live</span>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
              <p className="mt-1 text-xs text-ink-soft/80">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Friends */}
      <section id="friends" className="page mt-16 scroll-mt-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Your shelf</p>
            <h2 className="mt-2 text-2xl text-ink sm:text-3xl">Your friends</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {filtered.length} of {friends.length} shown · sorted by {SORTS[sort]}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search friends or tags"
                aria-label="Search friends"
                className="field pl-10 sm:w-64"
              />
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort friends"
              className="field sm:w-48"
            >
              <option value="attention">Needs attention</option>
              <option value="recent">Most recent</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              data-active={statusFilter === filter.key}
              className="chip"
            >
              {filter.dot && <span className={cx('h-1.5 w-1.5 rounded-full', filter.dot)} />}
              {filter.label}
              <span
                className={cx(
                  'rounded-full px-1.5 text-[10px] font-bold',
                  statusFilter === filter.key ? 'bg-white/20 text-white' : 'bg-ink/5 text-ink-soft',
                )}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card p-6">
                <div className="mx-auto h-20 w-20 skeleton rounded-full" />
                <div className="mx-auto mt-4 h-4 w-24 skeleton" />
                <div className="mx-auto mt-2 h-3 w-32 skeleton" />
                <div className="mx-auto mt-5 h-1.5 w-full skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((friend, index) => (
              <FriendCard key={friend.id} friend={friend} index={index} />
            ))}
          </div>
        ) : (
          <div className="card mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-brand">
              <Search size={24} />
            </span>
            <h3 className="mt-4 text-lg text-ink">No friends match that</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-soft">
              Try a different name, tag or status filter — or add someone new to your shelf.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={resetFilters} className="btn btn-outline btn-sm">
                Clear filters
              </button>
              <button type="button" onClick={openModal} className="btn btn-primary btn-sm">
                <Plus size={14} />
                Add a friend
              </button>
            </div>
          </div>
        )}
      </section>

      <AddFriendModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
