import { cx, initials } from '../lib/utils';

const SIZES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-3xl',
};

export default function Avatar({ friend, size = 'md', className = '' }) {
  const classes = cx('shrink-0 rounded-full bg-mist object-cover', SIZES[size] ?? SIZES.md, className);

  if (friend?.picture) {
    return <img src={friend.picture} alt={friend.name} loading="lazy" className={classes} />;
  }

  return (
    <span
      aria-label={friend?.name}
      className={cx(
        'grid place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark font-semibold tracking-wide text-white',
        SIZES[size] ?? SIZES.md,
        className,
      )}
    >
      {initials(friend?.name)}
    </span>
  );
}
