import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  HeartHandshake,
  MessageSquare,
  Phone,
  Sparkles,
  Video,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTimeline } from '../context/TimelineContext';
import { cx, initials } from '../lib/utils';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs shadow-soft">
      <p className="font-semibold text-ink">{item.name ?? item.payload?.day}</p>
      <p className="text-ink-soft">{item.value} moments</p>
    </div>
  );
}

export default function Stats() {
  const { timelineEntries } = useTimeline();

  const summary = useMemo(() => {
    const call = timelineEntries.filter((entry) => entry.type === 'Call').length;
    const text = timelineEntries.filter((entry) => entry.type === 'Text').length;
    const video = timelineEntries.filter((entry) => entry.type === 'Video').length;
    const total = timelineEntries.length;
    const percent = (value) => (total ? Math.round((value / total) * 100) : 0);

    return {
      total,
      call,
      text,
      video,
      cards: [
        { label: 'Total moments', value: total, hint: 'All time', Icon: Sparkles, tone: 'bg-brand/10 text-brand' },
        { label: 'Calls', value: call, hint: `${percent(call)}% of moments`, Icon: Phone, tone: 'bg-emerald-50 text-emerald-700' },
        { label: 'Texts', value: text, hint: `${percent(text)}% of moments`, Icon: MessageSquare, tone: 'bg-amber-50 text-amber-700' },
        { label: 'Videos', value: video, hint: `${percent(video)}% of moments`, Icon: Video, tone: 'bg-sky-50 text-sky-700' },
      ],
    };
  }, [timelineEntries]);

  const donut = useMemo(
    () => [
      { name: 'Calls', value: summary.call, color: '#214f3b' },
      { name: 'Texts', value: summary.text, color: '#c9963f' },
      { name: 'Videos', value: summary.video, color: '#5b8ba8' },
    ],
    [summary],
  );

  const week = useMemo(() => {
    const days = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - offset);

      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const count = timelineEntries.filter((entry) => {
        const date = new Date(entry.createdAt);
        return date >= start && date < end;
      }).length;

      days.push({
        day: start.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      });
    }

    return days;
  }, [timelineEntries]);

  const leaderboard = useMemo(() => {
    const map = new Map();
    timelineEntries.forEach((entry) => {
      map.set(entry.friendName, (map.get(entry.friendName) ?? 0) + 1);
    });

    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [timelineEntries]);

  const insights = useMemo(() => {
    const activeFriends = new Set(timelineEntries.map((entry) => entry.friendName)).size;
    const busiest = [...week].sort((a, b) => b.count - a.count)[0];
    const favourite = [...donut].sort((a, b) => b.value - a.value)[0];
    const thisWeek = week.reduce((sum, day) => sum + day.count, 0);

    return [
      { label: 'Friends reached', value: activeFriends },
      { label: 'This week', value: thisWeek },
      { label: 'Favourite channel', value: favourite?.value ? favourite.name : '—' },
      { label: 'Busiest day', value: busiest?.count ? busiest.day : '—' },
    ];
  }, [donut, timelineEntries, week]);

  const maxLeader = leaderboard[0]?.count ?? 1;

  return (
    <div className="page py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <BarChart3 size={14} /> Insights
          </p>
          <h1 className="mt-2 text-3xl text-ink sm:text-4xl">Friendship analytics</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            A soft look at how you have been showing up for the people on your shelf.
          </p>
        </div>

        <Link to="/timeline" className="btn btn-outline btn-sm self-start sm:self-auto">
          View timeline
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.cards.map(({ label, value, hint, Icon, tone }) => (
          <div key={label} className="card p-5">
            <span className={cx('grid h-10 w-10 place-items-center rounded-xl', tone)}>
              <Icon size={18} />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-xs text-ink-soft/80">{hint}</p>
          </div>
        ))}
      </div>

      {summary.total === 0 ? (
        <div className="card mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-brand">
            <BarChart3 size={24} />
          </span>
          <h2 className="mt-4 text-xl text-ink">Nothing to chart just yet</h2>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            Log a call, text or video from a friend&rsquo;s profile and your analytics will bloom here.
          </p>
          <Link to="/" className="btn btn-primary mt-6">
            Find a friend
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Donut */}
            <div className="card p-6">
              <div>
                <p className="eyebrow">Channel mix</p>
                <h2 className="mt-2 text-xl text-ink">How you reach out</h2>
              </div>

              <div className="relative mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donut}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="64%"
                      outerRadius="92%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {donut.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-display text-3xl font-semibold text-ink">{summary.total}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft/70">
                    moments
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5">
                {donut.map((entry) => (
                  <li key={entry.name} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1 text-ink-soft">{entry.name}</span>
                    <span className="font-semibold text-ink">{entry.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Week */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Last seven days</p>
                  <h2 className="mt-2 text-xl text-ink">Weekly rhythm</h2>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
                  {week.reduce((sum, day) => sum + day.count, 0)} moments
                </span>
              </div>

              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week} barCategoryGap="32%">
                    <CartesianGrid vertical={false} stroke="rgba(16, 31, 24, 0.08)" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: '#4a5f54' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      width={22}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: '#4a5f54' }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(33, 79, 59, 0.06)' }} content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Moments" radius={[8, 8, 0, 0]} fill="#214f3b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Leaderboard */}
            <div className="card p-6">
              <div>
                <p className="eyebrow">Most tended</p>
                <h2 className="mt-2 text-xl text-ink">Your closest connections</h2>
              </div>

              <ul className="mt-5 space-y-4">
                {leaderboard.map((friend, index) => (
                  <li key={friend.name} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-semibold text-white">
                      {initials(friend.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-semibold text-ink">
                          {index === 0 && <span className="mr-1.5 text-gold">★</span>}
                          {friend.name}
                        </span>
                        <span className="shrink-0 text-xs text-ink-soft">{friend.count} moments</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist">
                        <span
                          className="block h-full rounded-full bg-brand"
                          style={{ width: `${Math.max((friend.count / maxLeader) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Insights */}
            <div className="card p-6">
              <div>
                <p className="eyebrow">Patterns</p>
                <h2 className="mt-2 text-xl text-ink">Your quiet habits</h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {insights.map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-cream/60 p-4">
                    <p className="font-display text-xl font-semibold text-ink">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-ink/10 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-brand">
                  <HeartHandshake size={16} />
                </span>
                <p className="text-xs leading-relaxed text-ink-soft">
                  Consistency beats intensity. Two short check-ins a week will keep more friendships warm than
                  one long catch-up a month.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
