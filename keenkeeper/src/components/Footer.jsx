import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SOCIALS = [
  { label: 'Twitter', href: '#', icon: '/assets/twitter.png' },
  { label: 'Facebook', href: '#', icon: '/assets/facebook.png' },
  { label: 'Instagram', href: '#', icon: '/assets/instagram.png' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.success('You are on the list — we will nudge you gently.');
    setEmail('');
  };

  return (
    <footer className="mt-24 bg-brand-dark text-white">
      <div className="page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight">
                KeenKeeper<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Your personal shelf of meaningful connections. Browse, tend and nurture the relationships that
              matter most.
            </p>

            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 transition hover:border-white/40 hover:bg-white/10"
                >
                  <img src={icon} alt="" className="h-4 w-4 invert opacity-70 transition hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Your friends
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="transition hover:text-white">
                  Timeline
                </Link>
              </li>
              <li>
                <Link to="/stats" className="transition hover:text-white">
                  Friendship stats
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Good to know</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
              A gentle reminder
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              One short message a week keeps a friendship from fading. We will remind you when it is time.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5 flex items-center gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="h-11 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 focus:border-sage focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-brand-dark transition hover:bg-white"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} KeenKeeper. Crafted with care.</p>
          <p>Built with React, Tailwind CSS and a lot of remembered birthdays.</p>
        </div>
      </div>
    </footer>
  );
}
