import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Clock3, Home, Menu, PieChart, UserPlus, X } from 'lucide-react';
import { cx } from '../lib/utils';

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/timeline', label: 'Timeline', icon: Clock3 },
  { to: '/stats', label: 'Stats', icon: PieChart },
];

const linkClass = ({ isActive }) =>
  cx(
    'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition',
    isActive ? 'bg-brand text-white shadow-sm' : 'text-ink-soft hover:bg-mist hover:text-brand',
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/80 backdrop-blur-xl">
      <div className="page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="KeenKeeper home">
          <img src="/assets/logo.png" alt="KeenKeeper" className="h-6 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/70 p-1 shadow-sm md:flex">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/?add=1" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <UserPlus size={16} />
            Add a friend
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink-soft transition hover:text-brand md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-ink/5 bg-paper/95 px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive ? 'bg-brand text-white' : 'text-ink-soft hover:bg-mist hover:text-brand',
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <Link to="/?add=1" className="btn btn-primary mt-3 w-full">
            <UserPlus size={16} />
            Add a friend
          </Link>
        </div>
      )}
    </header>
  );
}
