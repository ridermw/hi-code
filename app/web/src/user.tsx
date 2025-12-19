import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createUser, fetchUser } from "./api";
import { UserProfile } from "./types";

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  authenticate: (name: string) => Promise<void>;
  clearUser: () => void;
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

  const authenticate = async (name: string) => {
    const profile = await createUser(name);
    localStorage.setItem(STORAGE_KEY, profile.id);
    setUser(profile);
  };

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticate,
      clearUser,
    }),
    [user, loading]
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
