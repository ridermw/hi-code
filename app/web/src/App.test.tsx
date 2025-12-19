import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";

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
  });

  it("creates a user and loads the problems list", async () => {
    const fetchMock = setupFetch((url, init) => {
      if (url.endsWith("/api/users") && init?.method === "POST") {
        return jsonResponse({ id: "user-1", name: "Ada", createdAt: new Date().toISOString(), attempts: {} }, 201);
      }

      if (url.endsWith("/api/problems")) {
        return jsonResponse({
          problems: [
            {
              id: "two_sum",
              title: "Two Sum",
              category: "Arrays",
              difficulty: "Easy",
            },
          ],
        });
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/username/i), "Ada");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await screen.findByText(/Problems/);
    await screen.findByText(/Two Sum/);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/users"),
      expect.objectContaining({ method: "POST" })
    );
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/problems"), undefined);
  });

  it("walks through an attempt flow and reset", async () => {
    const problem = buildProblemDetail();
    const fetchMock = setupFetch((url, init) => {
      if (url.endsWith("/api/users") && init?.method === "POST") {
        return jsonResponse({ id: "user-2", name: "Neo", createdAt: new Date().toISOString(), attempts: {} }, 201);
      }

      if (url.endsWith("/api/problems")) {
        return jsonResponse({ problems: [{ id: problem.id, title: problem.title, category: problem.category, difficulty: problem.difficulty }] });
      }

      if (url.endsWith(`/api/problems/${problem.id}`)) {
        return jsonResponse(problem);
      }

      if (url.includes(`/api/users/user-2/attempts`)) {
        return jsonResponse({
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
        }, 201);
      }

      if (url.includes(`/api/users/user-2/reset`)) {
        return jsonResponse({
          message: "Progress reset for user.",
          id: "user-2",
          name: "Neo",
          createdAt: new Date().toISOString(),
          attempts: {},
        });
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/username/i), "Neo");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.click(await screen.findByText(/Open details/i));
    await screen.findByText(problem.title);

    await user.click(screen.getByRole("button", { name: /Submit answers/i }));
    expect(await screen.findByText(/Please choose an option/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: problem.sections.algorithms[0].label }));
    await user.click(screen.getByRole("button", { name: problem.sections.implementations[0].label }));
    await user.click(screen.getByRole("button", { name: problem.sections.timeComplexities[0].label }));
    await user.click(screen.getByRole("button", { name: problem.sections.spaceComplexities[0].label }));

    await user.click(screen.getByRole("button", { name: /Submit answers/i }));
    await screen.findByText(/Great job!/i);
    await screen.findByText(/Attempt 1/);

    await user.click(screen.getByRole("button", { name: /Reset all history/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/reset"), expect.anything()));
    await screen.findByText(/You have not submitted any attempts yet./i);
  });

  it("restores a saved user and progress from storage", async () => {
    const problem = buildProblemDetail();
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
    };

    localStorage.setItem("hi-code:userId", storedUser.id);

    setupFetch((url) => {
      if (url.includes(`/api/users/${storedUser.id}/progress`)) {
        return jsonResponse(storedUser);
      }

      if (url.endsWith("/api/problems")) {
        return jsonResponse({
          problems: [
            {
              id: problem.id,
              title: problem.title,
              category: problem.category,
              difficulty: problem.difficulty,
            },
          ],
        });
      }

      throw new Error(`Unhandled request for ${url}`);
    });

    render(<App />);

    await screen.findByText(/Problems/);
    await screen.findByText(/Two Sum/);
  });
});
