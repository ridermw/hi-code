import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createUser, fetchUser, resetUserProgress } from "./api";
import { Attempt, UserProfile } from "./types";

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  authenticate: (name: string) => Promise<void>;
  clearUser: () => void;
  recordAttempt: (problemId: string, attempt: Attempt) => void;
  resetProgress: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY = "hi-code:userId";
const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);

    if (!storedId) {
      setLoading(false);
      return;
    }

    fetchUser(storedId)
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const authenticate = useCallback(async (name: string) => {
    const profile = await createUser(name);
    localStorage.setItem(STORAGE_KEY, profile.id);
    setUser(profile);
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const recordAttempt = useCallback((problemId: string, attempt: Attempt) => {
    setUser((current) => {
      if (!current) {
        return current;
      }

      const existingAttempts = current.attempts[problemId] ?? [];

      return {
        ...current,
        attempts: {
          ...current.attempts,
          [problemId]: [...existingAttempts, attempt],
        },
      };
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    const profile = await fetchUser(user.id);
    setUser(profile);
  }, [user]);

  const resetProgress = useCallback(async () => {
    if (!user) {
      return;
    }

    const refreshed = await resetUserProgress(user.id);
    setUser(refreshed);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticate,
      clearUser,
      recordAttempt,
      resetProgress,
      refreshProfile,
    }),
    [user, loading, authenticate, clearUser, recordAttempt, resetProgress, refreshProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
