import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { computeStatus } from '../lib/utils';

export const FriendsContext = createContext(null);

const USER_KEY = 'kk.friends.v1';
const EMPTY_STATE = { custom: [], removed: [], overrides: {} };

function readUserData() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
      overrides: parsed.overrides ?? {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function FriendsProvider({ children }) {
  const [baseFriends, setBaseFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(readUserData);

  useEffect(() => {
    let cancelled = false;

    fetch('/friends.json')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load friends');
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setBaseFriends(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setBaseFriends([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {
      /* storage is optional */
    }
  }, [userData]);

  const friends = useMemo(() => {
    const all = [...baseFriends, ...userData.custom];

    return all
      .filter((friend) => !userData.removed.includes(friend.id))
      .map((friend) => {
        const merged = { ...friend, ...(userData.overrides[friend.id] ?? {}) };
        const goal = Number(merged.goal) || 14;
        return {
          ...merged,
          goal,
          tags: Array.isArray(merged.tags) ? merged.tags : [],
          status: computeStatus(merged.days_since_contact, goal),
        };
      });
  }, [baseFriends, userData]);

  const addFriend = (payload) => {
    const friend = {
      id: Date.now(),
      name: payload.name.trim(),
      days_since_contact: 0,
      tags: payload.tags ?? [],
      picture: payload.picture ?? '',
      goal: Number(payload.goal) || 14,
      email: payload.email?.trim() ?? '',
      bio: payload.bio?.trim() ?? 'A new connection to keep close.',
    };

    setUserData((prev) => ({ ...prev, custom: [...prev.custom, friend] }));
    return friend;
  };

  const removeFriend = (id) => {
    setUserData((prev) => ({
      ...prev,
      custom: prev.custom.filter((friend) => friend.id !== id),
      removed: prev.removed.includes(id) ? prev.removed : [...prev.removed, id],
    }));
  };

  const snoozeFriend = (id, days = 14) => {
    const current = friends.find((friend) => friend.id === id);
    const nextGoal = (Number(current?.goal) || 14) + days;

    setUserData((prev) => ({
      ...prev,
      overrides: { ...prev.overrides, [id]: { ...(prev.overrides[id] ?? {}), goal: nextGoal } },
    }));
  };

  const updateFriend = (id, patch) => {
    setUserData((prev) => ({
      ...prev,
      overrides: { ...prev.overrides, [id]: { ...(prev.overrides[id] ?? {}), ...patch } },
    }));
  };

  const value = useMemo(
    () => ({ friends, loading, addFriend, removeFriend, snoozeFriend, updateFriend }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [friends, loading],
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}

export const useFriends = () => useContext(FriendsContext);
