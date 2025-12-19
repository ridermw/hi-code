import React from "react";
import { Link, useNavigation } from "../router";
import { ThemeToggle } from "./ThemeToggle";
import { useUser } from "../user";

export function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const { path } = useNavigation();
  const { user, clearUser } = useUser();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <Link to="/problems">HI Code</Link>
        </div>
        <nav className="nav-links">
          <Link to="/problems" className={path.startsWith("/problems") ? "active" : ""}>
            Problems
          </Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {user ? (
            <div className="user-chip">
              <span className="user-name">{user.name}</span>
              <button type="button" className="ghost-button" onClick={clearUser}>
                Switch user
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
