# KeenKeeper

**A calm home for the friendships that matter.** KeenKeeper tracks the last time you reached out to each
friend, shows you who needs a nudge, and keeps a quiet record of every call, text and video you log.

![React](https://img.shields.io/badge/React-19-1f2d24?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-214f3b?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-214f3b?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-214f3b?style=flat-square&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-214f3b?style=flat-square)

---

## Why it exists

Most friendship apps try to be social networks. KeenKeeper is the opposite: a small, private shelf of the
people you already care about. No feeds, no followers — just a gentle reminder that a two-minute hello goes a
long way.

## Features

- **Live relationship rhythm** — every friend has a personal check-in goal. Status is derived from the days
  since your last contact, so it is always accurate: *On track*, *Upcoming* or *Overdue*.
- **Dashboard with real numbers** — friends, overdue nudges, healthy rhythms and moments logged this month are
  computed from your data, not hardcoded.
- **Search, filter and sort** — find a friend by name or tag, filter by status, and sort by whoever needs
  attention first.
- **Add friends** — a proper dialog with tags, a check-in goal and a short note. New friends persist in
  `localStorage`.
- **Friend profiles** — bio, email, days since contact, next due date, an editable rhythm and one-tap
  check-ins (call / text / video).
- **Timeline** — every logged moment grouped by day, filterable by channel.
- **Analytics** — channel mix donut, seven-day rhythm bars, most-tended connections and quiet-habit insights.
- **Polished states** — skeleton loaders, empty states, toast confirmations, a friendly 404 and a fully
  responsive layout from phone to wide desktop.

## Tech stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| UI         | React 19 + Vite 8                        |
| Styling    | Tailwind CSS 4 (`@theme` design tokens)  |
| Routing    | React Router 7                           |
| Charts     | Recharts 3                               |
| Icons      | lucide-react                             |
| Feedback   | react-hot-toast                          |
| Typography | Fraunces + Plus Jakarta Sans (Google Fonts) |

## Getting started

```bash
git clone https://github.com/fahim3101/Keenkeeper.git
cd Keenkeeper/keenkeeper
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** the project lives in the `keenkeeper/` folder, so `npm install` and `npm run dev` must be run from
> inside it.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the build
npm run lint      # eslint
```

## Project structure

```
keenkeeper/
├─ public/
│  ├─ assets/            # friend portraits + channel icons
│  └─ friends.json       # seed friend data
└─ src/
   ├─ components/        # Navbar, Footer, FriendCard, Avatar, AddFriendModal
   ├─ context/           # FriendsContext + TimelineContext (localStorage backed)
   ├─ lib/utils.js       # status, date and rhythm helpers
   ├─ pages/             # Home, FriendDetails, Timeline, Stats, NotFound
   ├─ App.jsx
   └─ index.css          # design tokens, base styles and component primitives
```

## Design notes

The palette is built around a deep garden green (`#214f3b`) on warm paper (`#fbfaf6`), with gold and clay used
only for emphasis. Headings use Fraunces for a bookish, human feel; everything else uses Plus Jakarta Sans for
clarity. Cards are softly rounded, shadows are wide and low-contrast, and motion is limited to short fade-ups —
the interface should feel like a well-kept notebook, not a dashboard.

State is intentionally local-first: friends and timeline entries live in `localStorage`, so the demo works
without a backend and resets cleanly when storage is cleared.

---

Built for the Programming Hero assignment track, with care.
