import React from "react";
import "./App.css";
import { Router, RouteSwitch, useNavigation } from "./router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemDetailPage } from "./pages/ProblemDetailPage";
import { ThemeProvider } from "./theme";
import { UserProvider, useUser } from "./user";

function ProtectedRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const { user, loading } = useUser();
  const { path, navigate } = useNavigation();

  if (loading) {
    return <p className="muted">Loading profile...</p>;
  }

  if (!user) {
    if (path !== "/login") {
      navigate("/login");
    }
    return <LoginPage />;
  }

  return <>{children}</>;
}

function AppShell(): JSX.Element {
  return (
    <Layout>
      <RouteSwitch
        routes={[
          { path: "/login", element: <LoginPage /> },
          { path: "/problems", element: <ProtectedRoute><ProblemsPage /></ProtectedRoute> },
          { path: "/problems/:id", element: <ProtectedRoute><ProblemDetailPage /></ProtectedRoute> },
          { path: "/", element: <ProtectedRoute><ProblemsPage /></ProtectedRoute> },
        ]}
        fallback={<LoginPage />}
      />
    </Layout>
  );
}

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <AppShell />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
