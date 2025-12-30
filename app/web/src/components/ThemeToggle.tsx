import React from "react";
import { useTheme } from "../theme";

export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "light" ? "Switch to dark" : "Switch to light";

  return (
    <button
      className="ghost-button"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
    >
      {theme === "light" ? "🌞" : "🌜"}
    </button>
  );
}
