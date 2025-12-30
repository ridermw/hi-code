import React, { FormEvent, useEffect, useState } from "react";
import { useNavigation } from "../router";
import { useUser } from "../user";

export function LoginPage(): JSX.Element {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { navigate } = useNavigation();
  const { user, loading, authenticate } = useUser();

  useEffect(() => {
    if (!loading && user) {
      navigate("/problems");
    }
  }, [loading, navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a username to continue.");
      return;
    }

    setSubmitting(true);

    try {
      await authenticate(name.trim());
    } catch (submitError: any) {
      setError(submitError?.message ?? "Could not create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <header>
        <p className="eyebrow">Welcome</p>
        <h1>Create or continue your session</h1>
        <p className="muted">Enter a username to start exploring the problems.</p>
      </header>
      <form className="stack" onSubmit={handleSubmit}>
        <label className="stack" htmlFor="username">
          <span className="muted">Username</span>
          <input
            id="username"
            name="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type a username"
            autoComplete="off"
          />
        </label>
        {error ? <div className="error-text">{error}</div> : null}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
