import React, { useEffect, useState } from "react";
import { fetchProblem } from "../api";
import { Link, useNavigation, useRouteParams } from "../router";
import { ProblemDetail } from "../types";

export function ProblemDetailPage(): JSX.Element {
  const params = useRouteParams();
  const { navigate } = useNavigation();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const problemId = params.id;

  useEffect(() => {
    if (!problemId) {
      setError("Problem id missing");
      setLoading(false);
      return;
    }

    fetchProblem(problemId)
      .then((data) => setProblem(data))
      .catch((loadError: any) => setError(loadError?.message ?? "Could not load problem."))
      .finally(() => setLoading(false));
  }, [problemId]);

  return (
    <section className="panel">
      <header className="panel-header">
        <div className="stack">
          <p className="eyebrow">Problem detail</p>
          {problem ? <h1>{problem.title}</h1> : <h1>Loading problem</h1>}
        </div>
        <button type="button" className="ghost-button" onClick={() => navigate("/problems")}>Back to list</button>
      </header>

      {loading ? <p className="muted">Loading problem...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && problem ? (
        <div className="stack gap-md">
          <div className="problem-meta">
            <span className="pill">{problem.category}</span>
            <span className="pill">{problem.difficulty}</span>
          </div>
          <div className="stack">
            <h2>Prompt</h2>
            <p>{problem.statement}</p>
          </div>
          <div className="stack">
            <h3>Function signature</h3>
            <code className="code-block">{problem.signature}</code>
          </div>
          <div className="stack">
            <h3>Sections</h3>
            <div className="section-grid">
              {Object.entries(problem.sections).map(([section, options]) => (
                <div key={section} className="section-card">
                  <p className="eyebrow">{section}</p>
                  <ul>
                    {options.map((option) => (
                      <li key={option.id}>{option.label}</li>
                    ))}
                  </ul>
                  <p className="muted">Selections will be enabled in a later update.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="muted">
            <p>
              This page previews the problem content. Submission and scoring flows will be added soon.
            </p>
            <p>
              <Link to="/problems">Return to the list</Link> to pick another challenge.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
