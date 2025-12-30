import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  fetchFlashcardCategories,
  fetchFlashcardStars,
  fetchFlashcards,
  fetchProblem,
  fetchProblems,
  fetchUser,
  resetUserProgress,
  submitAttempt,
  updateFlashcardStar,
} from "./api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api client", () => {
  it("handles basic fetch flows", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url.endsWith("/api/users") && init?.method === "POST") {
        return jsonResponse({ id: "user-1", name: "Ada", createdAt: "now", attempts: {}, flashcardStars: {} }, 201);
      }

      if (url.includes("/api/users/user-1/progress")) {
        return jsonResponse({ id: "user-1", name: "Ada", createdAt: "now", attempts: {}, flashcardStars: {} });
      }

      if (url.endsWith("/api/problems")) {
        return jsonResponse({ problems: [{ id: "two_sum", title: "Two Sum", category: "Arrays", difficulty: "Easy" }] });
      }

      if (url.includes("/api/problems/two_sum")) {
        return jsonResponse({
          id: "two_sum",
          title: "Two Sum",
          statement: "Find two numbers.",
          signature: "int[] twoSum(int[] nums, int target)",
          category: "Arrays",
          difficulty: "Easy",
          sections: {
            algorithms: [{ id: "alg-1", label: "Hash map." }],
            implementations: [{ id: "impl-1", label: "Dictionary." }],
            timeComplexities: [{ id: "time-1", label: "O(n)." }],
            spaceComplexities: [{ id: "space-1", label: "O(n)." }],
          },
        });
      }

      if (url.includes("/api/users/user-1/attempts") && init?.method === "POST") {
        return jsonResponse({
          attempt: {
            timestamp: "now",
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

      if (url.includes("/api/users/user-1/reset") && init?.method === "POST") {
        return jsonResponse({ id: "user-1", name: "Ada", createdAt: "now", attempts: {}, flashcardStars: {} });
      }

      if (url.endsWith("/api/flashcards")) {
        return jsonResponse({
          categories: [{ id: "two_pointers", name: "Two Pointers", totalCards: 2 }],
        });
      }

      if (url.endsWith("/api/flashcards/two_pointers")) {
        return jsonResponse({
          category: { id: "two_pointers", name: "Two Pointers", totalCards: 2 },
          cards: [],
        });
      }

      if (url.includes("/api/users/user-1/flashcards/two_pointers") && init?.method !== "POST") {
        return jsonResponse({ starredIds: ["card-1"] });
      }

      if (url.includes("/api/users/user-1/flashcards/two_pointers/star") && init?.method === "POST") {
        return jsonResponse({ starredIds: ["card-1", "card-2"] });
      }

      return jsonResponse({ error: "Unhandled" }, 400);
    });

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(createUser("Ada")).resolves.toMatchObject({ id: "user-1" });
    await expect(fetchUser("user-1")).resolves.toMatchObject({ name: "Ada" });
    await expect(fetchProblems()).resolves.toHaveLength(1);
    await expect(fetchProblem("two_sum")).resolves.toMatchObject({ id: "two_sum" });
    await expect(submitAttempt("user-1", "two_sum", {
      algorithms: "alg-1",
      implementations: "impl-1",
      timeComplexities: "time-1",
      spaceComplexities: "space-1",
    })).resolves.toMatchObject({ overallCorrect: true });
    await expect(resetUserProgress("user-1")).resolves.toMatchObject({ attempts: {} });
    await expect(fetchFlashcardCategories()).resolves.toHaveLength(1);
    await expect(fetchFlashcards("two_pointers")).resolves.toMatchObject({ category: { id: "two_pointers" } });
    await expect(fetchFlashcardStars("user-1", "two_pointers")).resolves.toEqual(["card-1"]);
    await expect(updateFlashcardStar("user-1", "two_pointers", "card-2", true)).resolves.toContain("card-2");
  });

  it("throws on server errors with JSON payloads", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({ error: "Not found" }, 404)
    ) as unknown as typeof fetch;

    await expect(fetchProblem("missing")).rejects.toThrow("Not found");
  });

  it("throws on server errors with text payloads", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("Bad request", { status: 400 })
    ) as unknown as typeof fetch;

    await expect(fetchProblems()).rejects.toThrow("Bad request");
  });

  it("throws on network failures", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("Network down");
    }) as unknown as typeof fetch;

    await expect(fetchFlashcardCategories()).rejects.toThrow("Network down");
  });
});
