import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import Avatar from './Avatar';
import { cx, daysLabel, goalProgress, statusMeta } from '../lib/utils';

export default function FriendCard({ friend, index = 0 }) {
  const meta = statusMeta(friend.status);
  const progress = goalProgress(friend);

  return (
    <Link
      to={`/friend/${friend.id}`}
      style={{ animationDelay: `${Math.min(index, 9) * 55}ms` }}
      className="card card-hover group animate-fade-up relative flex flex-col items-center p-6 text-center"
    >
      <span className="absolute right-5 top-5 text-ink/15 transition group-hover:text-brand">
        <ArrowUpRight size={18} />
      </span>

      <div className={cx('relative rounded-full p-1 ring-2 ring-offset-2 ring-offset-white', meta.ring)}>
        <Avatar friend={friend} size="lg" />
        <span
          className={cx('absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white', meta.dot)}
        />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ink">{friend.name}</h3>

      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft/80">
        <Clock3 size={12} /> {daysLabel(friend.days_since_contact)}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {friend.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 w-full">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
          <span>Rhythm</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <span className={cx('block h-full rounded-full', meta.dot)} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <span
        className={cx(
          'mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]',
          meta.bg,
          meta.text,
        )}
      >
        <span className={cx('h-1.5 w-1.5 rounded-full', meta.dot)} />
        {meta.label}
      </span>
    </Link>
  );
}
