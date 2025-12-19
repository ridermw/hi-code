import React, { useEffect, useMemo, useState } from "react";
import { fetchProblems } from "../api";
import { Link } from "../router";
import { ProblemSummary } from "../types";

function sortProblems(problems: ProblemSummary[]): ProblemSummary[] {
  const difficultyOrder: Record<string, number> = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  return [...problems].sort((left, right) => {
    const categoryComparison = left.category.localeCompare(right.category);

    if (categoryComparison !== 0) {
      return categoryComparison;
    }

    const leftDifficulty = difficultyOrder[left.difficulty] ?? 99;
    const rightDifficulty = difficultyOrder[right.difficulty] ?? 99;

    if (leftDifficulty !== rightDifficulty) {
      return leftDifficulty - rightDifficulty;
    }

    return left.title.localeCompare(right.title);
  });
}

export function ProblemsPage(): JSX.Element {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems()
      .then((items) => {
        setProblems(items);
      })
      .catch((loadError: any) => {
        setError(loadError?.message ?? "Could not load problems.");
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedProblems = useMemo(() => sortProblems(problems), [problems]);

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Practice sets</p>
          <h1>Problems</h1>
        </div>
      </header>

      {loading ? <p className="muted">Loading problems...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error ? (
        <div className="problem-list">
          {sortedProblems.map((problem) => (
            <article key={problem.id} className="problem-card">
              <header className="problem-card__header">
                <div className="problem-meta">
                  <p className="eyebrow">{problem.category}</p>
                  <span className="pill">{problem.difficulty}</span>
                </div>
                <h2 className="problem-title">{problem.title}</h2>
              </header>
              <div className="problem-card__actions">
                <Link to={`/problems/${problem.id}`}>Open details</Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
