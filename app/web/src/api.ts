import {
  AttemptEvaluation,
  AttemptSelections,
  FlashcardCategory,
  FlashcardSet,
  ProblemDetail,
  ProblemSummary,
  UserProfile,
} from "./types";

const API_BASE = "/api";

type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";

const LOG_LEVELS: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

function normalizeLogLevel(value: string | undefined): LogLevel {
  const normalized = (value ?? "info").toLowerCase() as LogLevel;
  return normalized in LOG_LEVELS ? normalized : "info";
}

const CURRENT_LOG_LEVEL = normalizeLogLevel(import.meta.env.VITE_LOG_LEVEL);

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[CURRENT_LOG_LEVEL];
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const logger =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : level === "debug" || level === "trace"
          ? console.debug
          : console.info;

  if (meta !== undefined) {
    logger(message, meta);
    return;
  }

  logger(message);
}

function formatLogValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === "string") {
    return value.length > 500 ? `${value.slice(0, 500)}...` : value;
  }

  if (typeof value === "object") {
    try {
      const serialized = JSON.stringify(value);
      return serialized.length > 500 ? `${serialized.slice(0, 500)}...` : value;
    } catch {
      return value;
    }
  }

  return value;
}

async function handleJsonResponse<T>(
  response: Response,
  context?: { method: string; url: string; startTime: number },
): Promise<T> {
  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    data = text;
  }

  if (context) {
    const duration = Math.round(performance.now() - context.startTime);
    const statusMessage = `[api] ${context.method} ${context.url} -> ${response.status} (${duration}ms)`;
    log(response.ok ? "info" : "warn", statusMessage);

    if (shouldLog("trace")) {
      log("trace", "[api] response", formatLogValue(data ?? text));
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "string"
        ? data
        : data &&
            typeof data === "object" &&
            "error" in data &&
            typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : "Request failed";

    throw new Error(errorMessage);
  }

  return data as T;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";
  const startTime = performance.now();
  let response: Response | null = null;

  log("info", `[api] ${method} ${url}`);

  if (shouldLog("trace")) {
    log("trace", "[api] request", {
      headers: formatLogValue(init?.headers),
      body: formatLogValue(init?.body),
    });
  }

  try {
    response = await fetch(url, init);
    return await handleJsonResponse<T>(response, { method, url, startTime });
  } catch (error) {
    if (!response) {
      const duration = Math.round(performance.now() - startTime);
      log(
        "error",
        `[api] ${method} ${url} -> network error (${duration}ms)`,
        error,
      );
    }
    throw error;
  }
}

export async function createUser(name: string): Promise<UserProfile> {
  return requestJson<UserProfile>(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

export async function fetchUser(userId: string): Promise<UserProfile> {
  return requestJson<UserProfile>(
    `${API_BASE}/users/${encodeURIComponent(userId)}/progress`,
  );
}

export async function fetchProblems(): Promise<ProblemSummary[]> {
  const data = await requestJson<{ problems: ProblemSummary[] }>(
    `${API_BASE}/problems`,
  );
  return data.problems;
}

export async function fetchFlashcardCategories(): Promise<FlashcardCategory[]> {
  const data = await requestJson<{ categories: FlashcardCategory[] }>(
    `${API_BASE}/flashcards`,
  );
  return data.categories;
}

export async function fetchFlashcards(
  categoryId: string,
): Promise<FlashcardSet> {
  return requestJson<FlashcardSet>(
    `${API_BASE}/flashcards/${encodeURIComponent(categoryId)}`,
  );
}

export async function fetchFlashcardStars(
  userId: string,
  categoryId: string,
): Promise<string[]> {
  const data = await requestJson<{ starredIds: string[] }>(
    `${API_BASE}/users/${encodeURIComponent(userId)}/flashcards/${encodeURIComponent(categoryId)}`,
  );
  return data.starredIds;
}

export async function updateFlashcardStar(
  userId: string,
  categoryId: string,
  cardId: string,
  starred: boolean,
): Promise<string[]> {
  const data = await requestJson<{ starredIds: string[] }>(
    `${API_BASE}/users/${encodeURIComponent(userId)}/flashcards/${encodeURIComponent(categoryId)}/star`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardId, starred }),
    },
  );
  return data.starredIds;
}

export async function fetchProblem(problemId: string): Promise<ProblemDetail> {
  return requestJson<ProblemDetail>(
    `${API_BASE}/problems/${encodeURIComponent(problemId)}`,
  );
}

export async function submitAttempt(
  userId: string,
  problemId: string,
  selections: AttemptSelections,
): Promise<AttemptEvaluation> {
  return requestJson<AttemptEvaluation>(
    `${API_BASE}/users/${encodeURIComponent(userId)}/attempts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problemId, selections }),
    },
  );
}

export async function resetUserProgress(userId: string): Promise<UserProfile> {
  const data = await requestJson<{
    attempts: UserProfile["attempts"];
    id: string;
    name: string;
    createdAt: string;
    flashcardStars: UserProfile["flashcardStars"];
  }>(`${API_BASE}/users/${encodeURIComponent(userId)}/reset`, {
    method: "POST",
  });

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    attempts: data.attempts,
    flashcardStars: data.flashcardStars,
  };
}
