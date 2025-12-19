import {
  AttemptEvaluation,
  AttemptSelections,
  ProblemDetail,
  ProblemSummary,
  UserProfile,
} from "./types";

const API_BASE = "/api";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "string"
        ? data
        : data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Request failed";

    throw new Error(errorMessage);
  }

  return data as T;
}

export async function createUser(name: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return handleJsonResponse<UserProfile>(response);
}

export async function fetchUser(userId: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`);
  return handleJsonResponse<UserProfile>(response);
}

export async function fetchProblems(): Promise<ProblemSummary[]> {
  const response = await fetch(`${API_BASE}/problems`);
  const data = await handleJsonResponse<{ problems: ProblemSummary[] }>(response);
  return data.problems;
}

export async function fetchProblem(problemId: string): Promise<ProblemDetail> {
  const response = await fetch(`${API_BASE}/problems/${encodeURIComponent(problemId)}`);
  return handleJsonResponse<ProblemDetail>(response);
}

export async function submitAttempt(
  userId: string,
  problemId: string,
  selections: AttemptSelections
): Promise<AttemptEvaluation> {
  const response = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/attempts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ problemId, selections }),
  });

  return handleJsonResponse<AttemptEvaluation>(response);
}

export async function resetUserProgress(userId: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/reset`, {
    method: "POST",
  });

  const data = await handleJsonResponse<{ attempts: UserProfile["attempts"]; id: string; name: string; createdAt: string }>(
    response
  );

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    attempts: data.attempts,
  };
}
