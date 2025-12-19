import React, { useEffect, useMemo, useState } from "react";
import { fetchProblem, submitAttempt } from "../api";
import { Link, useNavigation, useRouteParams } from "../router";
import { AttemptCorrectness, AttemptSelections, ProblemDetail, ProblemSection } from "../types";
import { useUser } from "../user";

const SECTION_COPY: Record<ProblemSection, { title: string; helper: string }> = {
  algorithms: {
    title: "Algorithm",
    helper: "Pick the overall approach for solving Two Sum.",
  },
  implementations: {
    title: "Implementation",
    helper: "Choose the concrete implementation strategy.",
  },
  timeComplexities: {
    title: "Time complexity",
    helper: "How efficient is the algorithm as input grows?",
  },
  spaceComplexities: {
    title: "Space complexity",
    helper: "Select the extra memory requirements.",
  },
};

const SECTION_ORDER: ProblemSection[] = [
  "algorithms",
  "implementations",
  "timeComplexities",
  "spaceComplexities",
];

type SelectionState = Record<ProblemSection, string | null>;

const EMPTY_SELECTIONS: SelectionState = {
  algorithms: null,
  implementations: null,
  timeComplexities: null,
  spaceComplexities: null,
};

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function countCorrect(correctness: AttemptCorrectness): number {
  return Object.values(correctness).filter(Boolean).length;
}

export function ProblemDetailPage(): JSX.Element {
  const params = useRouteParams();
  const { navigate } = useNavigation();
  const { user, recordAttempt, resetProgress } = useUser();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selections, setSelections] = useState<SelectionState>(EMPTY_SELECTIONS);
  const [lastCorrectness, setLastCorrectness] = useState<AttemptCorrectness | null>(null);
  const [overallResult, setOverallResult] = useState<boolean | null>(null);

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

  useEffect(() => {
    setSelections(EMPTY_SELECTIONS);
    setLastCorrectness(null);
    setOverallResult(null);
    setValidationError(null);
    setSubmitError(null);
  }, [problemId]);

  const attemptHistory = useMemo(
    () => (user && problemId ? user.attempts[problemId] ?? [] : []),
    [user, problemId]
  );

  const updateSelection = (section: ProblemSection, optionId: string) => {
    setSelections((current) => ({
      ...current,
      [section]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("Please sign in again to submit.");
      return;
    }

    if (!problem) {
      setSubmitError("Problem could not be found.");
      return;
    }

    const missingSection = SECTION_ORDER.find((section) => !selections[section]);

    if (missingSection) {
      setValidationError(`Please choose an option for ${SECTION_COPY[missingSection].title}.`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setValidationError(null);

    try {
      const preparedSelections = selections as AttemptSelections;

      const evaluation = await submitAttempt(user.id, problem.id, preparedSelections);

      recordAttempt(problem.id, evaluation.attempt);
      setLastCorrectness(evaluation.attempt.correctness);
      setOverallResult(evaluation.overallCorrect);
    } catch (submitIssue: any) {
      setSubmitError(submitIssue?.message ?? "Could not submit attempt.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setSelections(EMPTY_SELECTIONS);
    setLastCorrectness(null);
    setOverallResult(null);
    setValidationError(null);
    setSubmitError(null);
  };

  const handleResetHistory = async () => {
    if (!user) {
      return;
    }

    if (!window.confirm("This will clear attempts for all problems. Continue?")) {
      return;
    }

    setResetting(true);
    setSubmitError(null);
    setValidationError(null);

    try {
      await resetProgress();
      setSelections(EMPTY_SELECTIONS);
      setLastCorrectness(null);
      setOverallResult(null);
    } catch (resetIssue: any) {
      setSubmitError(resetIssue?.message ?? "Could not reset attempts.");
    } finally {
      setResetting(false);
    }
  };

  const lastAttempt = attemptHistory[attemptHistory.length - 1] ?? null;

  return (
    <section className="panel">
      <header className="panel-header">
        <div className="stack">
          <p className="eyebrow">Flash card quiz</p>
          {problem ? <h1>{problem.title}</h1> : <h1>Loading problem</h1>}
        </div>
        <button type="button" className="ghost-button" onClick={() => navigate("/problems")}>
          Back to list
        </button>
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
            <div className="panel-header">
              <h3>Quiz selections</h3>
              <p className="muted">Choose one option per section, then submit once.</p>
            </div>
            <div className="section-grid quiz-grid">
              {SECTION_ORDER.map((section) => {
                const options = problem.sections[section];
                const selected = selections[section];
                const sectionCorrectness = lastCorrectness?.[section];
                const cardStatusClass =
                  sectionCorrectness === undefined
                    ? ""
                    : sectionCorrectness
                    ? "is-correct"
                    : "is-incorrect";

                return (
                  <div key={section} className={`section-card quiz-card ${cardStatusClass}`}>
                    <div className="section-card__header">
                      <div className="stack">
                        <p className="eyebrow">{SECTION_COPY[section].title}</p>
                        <p className="muted">{SECTION_COPY[section].helper}</p>
                      </div>
                      {sectionCorrectness !== undefined ? (
                        <span className={`status-pill ${sectionCorrectness ? "status-pill--success" : "status-pill--error"}`}>
                          {sectionCorrectness ? "Correct" : "Incorrect"}
                        </span>
                      ) : null}
                    </div>
                    <div className="option-list" role="radiogroup" aria-label={SECTION_COPY[section].title}>
                      {options.map((option) => {
                        const isSelected = selected === option.id;
                        const showEvaluation = sectionCorrectness !== undefined && isSelected;
                        const optionStateClass = showEvaluation
                          ? sectionCorrectness
                            ? "option-button--correct"
                            : "option-button--incorrect"
                          : "";

                        return (
                          <button
                            key={option.id}
                            type="button"
                            className={`option-button ${isSelected ? "option-button--selected" : ""} ${optionStateClass}`}
                            onClick={() => updateSelection(section, option.id)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <span className="option-label">{option.label}</span>
                            {showEvaluation ? (
                              <span className="option-feedback">{sectionCorrectness ? "You nailed it" : "Not quite"}</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {validationError ? <p className="error-text">{validationError}</p> : null}
          {submitError ? <p className="error-text">{submitError}</p> : null}
          {overallResult !== null ? (
            <p className={overallResult ? "success-text" : "muted"}>
              {overallResult
                ? "Great job! All sections are correct."
                : "Review the sections marked incorrect and try again."}
            </p>
          ) : null}

          <div className="quiz-actions">
            <div className="stack">
              <p className="muted">Submit when all four sections are filled. Feedback appears after submission.</p>
              {lastAttempt ? (
                <p className="muted">Last attempt: {formatDateTime(lastAttempt.timestamp)}</p>
              ) : (
                <p className="muted">No attempts yet. Your progress will be saved automatically.</p>
              )}
            </div>
            <div className="quiz-buttons">
              <button type="button" className="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit answers"}
              </button>
              <button type="button" className="ghost-button" onClick={handleTryAgain} disabled={submitting || resetting}>
                Try again
              </button>
              <button
                type="button"
                className="ghost-button danger"
                onClick={handleResetHistory}
                disabled={submitting || resetting}
              >
                {resetting ? "Clearing..." : "Reset all history"}
              </button>
            </div>
          </div>

          <div className="stack">
            <div className="panel-header">
              <h3>Attempt history</h3>
              <p className="muted">Attempts are stored on the backend. Resetting clears all problems.</p>
            </div>
            {attemptHistory.length === 0 ? (
              <p className="muted">You have not submitted any attempts yet.</p>
            ) : (
              <ul className="attempt-list">
                {attemptHistory.map((attempt, index) => {
                  const score = countCorrect(attempt.correctness);
                  const sectionCount = Object.keys(attempt.correctness).length;
                  const isLatest = index === attemptHistory.length - 1;

                  return (
                    <li key={`${attempt.timestamp}-${index}`} className={`attempt-row ${isLatest ? "attempt-row--latest" : ""}`}>
                      <div className="stack">
                        <p className="eyebrow">Attempt {index + 1}</p>
                        <p className="muted">{formatDateTime(attempt.timestamp)}</p>
                      </div>
                      <div className="attempt-score">
                        <span className="pill">{score}/{sectionCount} correct</span>
                        <span className="muted">{sectionCount} sections scored</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="muted">
            <p>
              Explore more problems from the <Link to="/problems">practice list</Link> when you're ready.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
