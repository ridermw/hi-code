import { ProblemDetail, ProblemSummary, UserProfile } from "./types";

const API_BASE = "/api";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
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
