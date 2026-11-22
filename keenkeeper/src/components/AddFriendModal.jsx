import { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFriends } from '../context/FriendsContext';

const EMPTY_FORM = { name: '', email: '', tags: '', goal: '14', bio: '' };

export default function AddFriendModal({ onClose }) {
  const { addFriend } = useFriends();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('A name is the one thing we really need.');
      return;
    }

    addFriend({
      name: form.name,
      email: form.email,
      goal: form.goal,
      bio: form.bio,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 4),
    });

    toast.success(`${form.name.trim()} joined your shelf`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
        className="animate-fade-up relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-4xl bg-white p-6 shadow-lift sm:rounded-4xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">
              <UserPlus size={14} /> New connection
            </span>
            <h2 id="add-friend-title" className="mt-2 text-2xl">
              Add a friend
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Give them a name and a rhythm — you can refine the details later.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-ink-soft transition hover:bg-mist hover:text-brand"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="friend-name" className="label">
              Name <span className="text-clay">*</span>
            </label>
            <input
              id="friend-name"
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Nusrat"
              className="field"
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs font-medium text-clay">{error}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="friend-email" className="label">
                Email
              </label>
              <input
                id="friend-email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="friend@email.com"
                className="field"
              />
            </div>

            <div>
              <label htmlFor="friend-goal" className="label">
                Check in every
              </label>
              <select id="friend-goal" value={form.goal} onChange={update('goal')} className="field">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="21">21 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="friend-tags" className="label">
              Tags
            </label>
            <input
              id="friend-tags"
              value={form.tags}
              onChange={update('tags')}
              placeholder="School, CSE, Football"
              className="field"
            />
            <p className="mt-1.5 text-[11px] text-ink-soft/70">Separate up to four tags with commas.</p>
          </div>

          <div>
            <label htmlFor="friend-bio" className="label">
              A little note
            </label>
            <textarea
              id="friend-bio"
              value={form.bio}
              onChange={update('bio')}
              rows={3}
              placeholder="How do you know them? What do you usually talk about?"
              className="field resize-none"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} />
              Add to shelf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
