import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function useNavigation(): RouterContextValue {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error("useNavigation must be used within a Router");
  }

  return context;
}

export function Router({ children }: { children: React.ReactNode }): JSX.Element {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to === path) {
      return;
    }

    window.history.pushState({}, "", to);
    setPath(to);
  };

  const value = useMemo(() => ({ path, navigate }), [path]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export interface RouteDefinition {
  path: string;
  element: React.ReactNode;
}

const RouteParamsContext = createContext<Record<string, string>>({});

export function useRouteParams(): Record<string, string> {
  return useContext(RouteParamsContext);
}

function matchPath(pattern: string, target: string): Record<string, string> | null {
  if (pattern === "*") {
    return {};
  }

  const patternParts = pattern.split("/").filter(Boolean);
  const targetParts = target.split("/").filter(Boolean);

  if (patternParts.length !== targetParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const targetPart = targetParts[index];

    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = decodeURIComponent(targetPart);
      continue;
    }

    if (patternPart !== targetPart) {
      return null;
    }
  }

  return params;
}

export function RouteSwitch({
  routes,
  fallback,
}: {
  routes: RouteDefinition[];
  fallback: React.ReactNode;
}): JSX.Element {
  const { path } = useNavigation();

  for (const route of routes) {
    const params = matchPath(route.path, path);

    if (params) {
      return <RouteParamsContext.Provider value={params}>{route.element}</RouteParamsContext.Provider>;
    }
  }

  return <>{fallback}</>;
}

export function Link({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const { navigate } = useNavigation();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
