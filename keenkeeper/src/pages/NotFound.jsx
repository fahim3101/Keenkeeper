import { Link } from 'react-router-dom';
import { ArrowLeft, Clock3 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page py-20">
      <div className="card relative mx-auto max-w-2xl overflow-hidden px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sage/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative">
          <p className="eyebrow justify-center">Error 404</p>
          <p className="mt-4 font-display text-7xl font-semibold tracking-tight text-brand sm:text-8xl">404</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
            This page wandered off the shelf
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            The link you followed does not exist anymore. Your friends, however, are still right where you left
            them.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to your friends
            </Link>
            <Link to="/timeline" className="btn btn-outline">
              <Clock3 size={16} />
              View timeline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
