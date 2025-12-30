import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve: (value: T) => void = () => undefined;
  let reject: (error: unknown) => void = () => undefined;

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return { promise, resolve, reject };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function setupFetch(responder: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const mockFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    return responder(url, init);
  });

  globalThis.fetch = mockFetch as unknown as typeof fetch;
  return mockFetch;
}

function buildProblemDetail() {
  return {
    id: "two_sum",
    title: "Two Sum",
    statement: "Find two numbers.",
    signature: "int[] twoSum(int[] nums, int target)",
    category: "Arrays",
    difficulty: "Easy",
    sections: {
      algorithms: [
        { id: "alg-1", label: "Traverse the array once while storing complements in a hash map." },
        { id: "alg-2", label: "Check every pair with a double nested loop." },
      ],
      implementations: [
        { id: "impl-1", label: "Use a dictionary to find complements." },
        { id: "impl-2", label: "Brute force search." },
      ],
      timeComplexities: [
        { id: "time-1", label: "O(n) time using a single pass hash map." },
        { id: "time-2", label: "O(n^2) time from evaluating all pairs." },
      ],
      spaceComplexities: [
        { id: "space-1", label: "O(n) space for the hash map of seen values." },
        { id: "space-2", label: "O(1) extra space by scanning the array in-place." },
      ],
    },
  };
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/login");
    vi.restoreAllMocks();
  });

  it("creates a user and loads the problems list", async () => {
    const userDeferred = createDeferred<Response>();
    const problemsDeferred = createDeferred<Response>();
    const fetchMock = setupFetch((url, init) => {
      if (url.endsWith("/api/users") && init?.method === "POST") {
        return userDeferred.promise;
      }

      if (url.endsWith("/api/problems")) {
        return problemsDeferred.promise;
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /continue/i });

    await user.type(screen.getByLabelText(/username/i), "Ada");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    let userResolved = false;
    await waitFor(async () => {
      const hasUserRequest = fetchMock.mock.calls.some(
        (call) => call[0].toString().includes("/api/users") && call[1]?.method === "POST"
      );

      if (hasUserRequest && !userResolved) {
        userResolved = true;
        userDeferred.resolve(
          jsonResponse(
            { id: "user-1", name: "Ada", createdAt: new Date().toISOString(), attempts: {}, flashcardStars: {} },
            201
          )
        );
        await Promise.resolve();
      }

      expect(hasUserRequest).toBe(true);
    });

    let problemsResolved = false;
    await waitFor(async () => {
      const hasProblemsRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes("/api/problems")
      );

      if (hasProblemsRequest && !problemsResolved) {
        problemsResolved = true;
        problemsDeferred.resolve(
          jsonResponse({
            problems: [
              {
                id: "two_sum",
                title: "Two Sum",
                category: "Arrays",
                difficulty: "Easy",
              },
            ],
          })
        );
        await Promise.resolve();
      }

      expect(hasProblemsRequest).toBe(true);
      expect(screen.getByText(/Two Sum/)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/users"),
      expect.objectContaining({ method: "POST" })
    );
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/problems"), undefined);
  });

  it("walks through an attempt flow and reset", async () => {
    const problem = buildProblemDetail();
    const userDeferred = createDeferred<Response>();
    const problemsDeferred = createDeferred<Response>();
    const problemDeferred = createDeferred<Response>();
    const attemptDeferred = createDeferred<Response>();
    const resetDeferred = createDeferred<Response>();
    const fetchMock = setupFetch((url, init) => {
      if (url.endsWith("/api/users") && init?.method === "POST") {
        return userDeferred.promise;
      }

      if (url.endsWith("/api/problems")) {
        return problemsDeferred.promise;
      }

      if (url.endsWith(`/api/problems/${problem.id}`)) {
        return problemDeferred.promise;
      }

      if (url.includes(`/api/users/user-2/attempts`)) {
        return attemptDeferred.promise;
      }

      if (url.includes(`/api/users/user-2/reset`)) {
        return resetDeferred.promise;
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /continue/i });

    await user.type(screen.getByLabelText(/username/i), "Neo");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    let userResolved = false;
    await waitFor(async () => {
      const hasUserRequest = fetchMock.mock.calls.some(
        (call) => call[0].toString().includes("/api/users") && call[1]?.method === "POST"
      );

      if (hasUserRequest && !userResolved) {
        userResolved = true;
        userDeferred.resolve(
          jsonResponse(
            { id: "user-2", name: "Neo", createdAt: new Date().toISOString(), attempts: {}, flashcardStars: {} },
            201
          )
        );
        await Promise.resolve();
      }

      expect(hasUserRequest).toBe(true);
    });

    let problemsResolved = false;
    await waitFor(async () => {
      const hasProblemsRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes("/api/problems")
      );

      if (hasProblemsRequest && !problemsResolved) {
        problemsResolved = true;
        problemsDeferred.resolve(
          jsonResponse({
            problems: [
              {
                id: problem.id,
                title: problem.title,
                category: problem.category,
                difficulty: problem.difficulty,
              },
            ],
          })
        );
        await Promise.resolve();
      }

      expect(hasProblemsRequest).toBe(true);
      expect(screen.getByRole("heading", { name: /Problems/i })).toBeInTheDocument();
    });

    await user.click(await screen.findByText(/Open details/i));
    let problemResolved = false;
    await waitFor(async () => {
      const hasProblemRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes(`/api/problems/${problem.id}`)
      );

      if (hasProblemRequest && !problemResolved) {
        problemResolved = true;
        problemDeferred.resolve(jsonResponse(problem));
        await Promise.resolve();
      }

      expect(hasProblemRequest).toBe(true);
      expect(screen.getByText(problem.title)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Submit answers/i }));
    await screen.findByText(/Please choose an option/);

    await user.click(await screen.findByRole("radio", { name: problem.sections.algorithms[0].label }));
    await user.click(await screen.findByRole("radio", { name: problem.sections.implementations[0].label }));
    await user.click(await screen.findByRole("radio", { name: problem.sections.timeComplexities[0].label }));
    await user.click(await screen.findByRole("radio", { name: problem.sections.spaceComplexities[0].label }));

    await user.click(screen.getByRole("button", { name: /Submit answers/i }));
    let attemptResolved = false;
    await waitFor(async () => {
      const hasAttemptRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes(`/api/users/user-2/attempts`)
      );

      if (hasAttemptRequest && !attemptResolved) {
        attemptResolved = true;
        attemptDeferred.resolve(
          jsonResponse(
            {
              attempt: {
                timestamp: new Date().toISOString(),
                selections: {
                  algorithms: "alg-1",
                  implementations: "impl-1",
                  timeComplexities: "time-1",
                  spaceComplexities: "space-1",
                },
                correctness: {
                  algorithms: true,
                  implementations: true,
                  timeComplexities: true,
                  spaceComplexities: true,
                },
              },
              overallCorrect: true,
            },
            201
          )
        );
        await Promise.resolve();
      }

      expect(hasAttemptRequest).toBe(true);
      expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
      expect(screen.getByText(/Attempt 1/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Reset all history/i }));
    let resetResolved = false;
    await waitFor(async () => {
      const hasResetRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes(`/api/users/user-2/reset`)
      );

      if (hasResetRequest && !resetResolved) {
        resetResolved = true;
        resetDeferred.resolve(
          jsonResponse({
            message: "Progress reset for user.",
            id: "user-2",
            name: "Neo",
            createdAt: new Date().toISOString(),
            attempts: {},
            flashcardStars: {},
          })
        );
        await Promise.resolve();
      }

      expect(hasResetRequest).toBe(true);
    });

    await screen.findByText(/You have not submitted any attempts yet./i);
  });

  it("restores a saved user and progress from storage", async () => {
    const problem = buildProblemDetail();
    const userDeferred = createDeferred<Response>();
    const problemsDeferred = createDeferred<Response>();
    const storedUser = {
      id: "user-3",
      name: "Trinity",
      createdAt: new Date().toISOString(),
      attempts: {
        [problem.id]: [
          {
            timestamp: new Date().toISOString(),
            selections: {
              algorithms: "alg-1",
              implementations: "impl-1",
              timeComplexities: "time-1",
              spaceComplexities: "space-1",
            },
            correctness: {
              algorithms: true,
              implementations: true,
              timeComplexities: true,
              spaceComplexities: true,
            },
          },
        ],
      },
      flashcardStars: {},
    };

    localStorage.setItem("hi-code:userId", storedUser.id);

    const fetchMock = setupFetch((url) => {
      if (url.includes(`/api/users/${storedUser.id}/progress`)) {
        return userDeferred.promise;
      }

      if (url.endsWith("/api/problems")) {
        return problemsDeferred.promise;
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    render(<App />);
    let userResolved = false;
    await waitFor(async () => {
      const hasUserRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes(`/api/users/${storedUser.id}/progress`)
      );

      if (hasUserRequest && !userResolved) {
        userResolved = true;
        userDeferred.resolve(jsonResponse(storedUser));
        await Promise.resolve();
      }

      expect(hasUserRequest).toBe(true);
    });

    let problemsResolved = false;
    await waitFor(async () => {
      const hasProblemsRequest = fetchMock.mock.calls.some((call) =>
        call[0].toString().includes("/api/problems")
      );

      if (hasProblemsRequest && !problemsResolved) {
        problemsResolved = true;
        problemsDeferred.resolve(
          jsonResponse({
            problems: [
              {
                id: problem.id,
                title: problem.title,
                category: problem.category,
                difficulty: problem.difficulty,
              },
            ],
          })
        );
        await Promise.resolve();
      }

      expect(hasProblemsRequest).toBe(true);
      expect(screen.getByText(/Two Sum/)).toBeInTheDocument();
    });
  });
});
