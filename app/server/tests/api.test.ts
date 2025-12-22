import { once } from "events";
import { IncomingMessage, ServerResponse } from "http";
import { PassThrough } from "stream";
import { beforeEach, describe, expect, it } from "vitest";
import { createServer } from "../src";
import { StorageProvider } from "../src/storage/storageProvider";
import { FlashcardSet, Problem, ProblemSummary, User } from "../src/types";

class InMemoryStorageProvider implements StorageProvider {
  private users: Record<string, User> = {};
  private readonly problems: Problem[];
  private readonly flashcards: FlashcardSet;

  constructor() {
    this.problems = [
      {
        id: "two_sum",
        title: "Two Sum",
        statement: "Find two numbers.",
        signature: "int[] twoSum(int[] nums, int target)",
        category: "Arrays",
        difficulty: "Easy",
        sections: {
          algorithms: [
            { id: "alg-1", label: "Hash map" },
            { id: "alg-2", label: "Brute force" },
          ],
          implementations: [
            { id: "impl-1", label: "Dictionary lookup" },
            { id: "impl-2", label: "Nested loops" },
          ],
          timeComplexities: [
            { id: "time-1", label: "O(n)" },
            { id: "time-2", label: "O(n^2)" },
          ],
          spaceComplexities: [
            { id: "space-1", label: "O(n)" },
            { id: "space-2", label: "O(1)" },
          ],
        },
        answerKey: {
          algorithms: "alg-1",
          implementations: "impl-1",
          timeComplexities: "time-1",
          spaceComplexities: "space-1",
        },
      },
    ];

    this.flashcards = {
      category: {
        id: "two_pointers",
        name: "Two Pointers",
        description: "Core pointer patterns for arrays and linked lists.",
        totalCards: 2,
      },
      cards: [
        {
          id: "two-pointers-core",
          category: "two_pointers",
          term: "Two Pointers",
          definition: "Use two indices to traverse data.",
          whenToUse: ["Sorted arrays", "Pair search"],
          genericPatterns: ["Opposite ends", "Fast/slow"],
          simpleExamples: ["Find a pair that sums to a target."],
          difficultyStarred: false,
        },
        {
          id: "two-pointers-opposite-ends",
          category: "two_pointers",
          term: "Opposite Ends",
          definition: "Start at both ends and move inward.",
          whenToUse: ["Sorted arrays"],
          genericPatterns: ["left++, right-- based on condition"],
          simpleExamples: ["Container with most water shape."],
          difficultyStarred: false,
        },
      ],
    };
  }

  async getProblems(): Promise<ProblemSummary[]> {
    return this.problems.map(({ id, title, category, difficulty }) => ({
      id,
      title,
      category,
      difficulty,
    }));
  }

  async getProblemById(problemId: string): Promise<Problem | null> {
    return this.problems.find((item) => item.id === problemId) ?? null;
  }

  async getFlashcardCategories() {
    return [this.flashcards.category];
  }

  async getFlashcardsByCategory(categoryId: string): Promise<FlashcardSet | null> {
    if (categoryId !== this.flashcards.category.id) {
      return null;
    }

    return this.flashcards;
  }

  async createUser(name: string): Promise<User> {
    const user: User = {
      id: `user-${Object.keys(this.users).length + 1}`,
      name,
      createdAt: new Date().toISOString(),
      attempts: {},
      flashcardStars: {},
    };

    this.users[user.id] = user;
    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users[userId] ?? null;
  }

  async saveUser(user: User): Promise<void> {
    this.users[user.id] = { ...user };
  }
}

function createTestServer() {
  const storage = new InMemoryStorageProvider();
  const app = createServer(storage);
  return { app, storage };
}

describe("API endpoints", () => {
  let app: ReturnType<typeof createServer>;
  let storage: InMemoryStorageProvider;

  beforeEach(() => {
    const created = createTestServer();
    storage = created.storage;
    app = created.app;
  });

  async function sendRequest({
    method,
    path,
    body,
  }: {
    method: string;
    path: string;
    body?: unknown;
  }): Promise<{ status: number; body: any }> {
    const socket = new PassThrough();
    const req = new IncomingMessage(socket as any);
    req.method = method;
    req.url = path;
    req.headers = {};

    const res = new ServerResponse(req);
    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.assignSocket(socket as any);

    res.write = (chunk: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalWrite(chunk, ...args);
    };

    res.end = (chunk: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalEnd(chunk, ...args);
    };

    if (body !== undefined) {
      (req as any)._body = true;
      (req as any).body = body;
    }

    (app as any).handle(req, res);

    req.push(null);

    await once(res, "finish");

    const text = Buffer.concat(chunks).toString("utf8");
    const parsed = text ? JSON.parse(text) : null;

    return { status: res.statusCode, body: parsed };
  }

  it("lists problems and omits answer keys", async () => {
    const listResponse = await sendRequest({ method: "GET", path: "/api/problems" });
    const listBody = listResponse.body;
    expect(listResponse.status).toBe(200);
    expect(listBody.problems).toHaveLength(1);
    expect(listBody.problems[0]).toMatchObject({ id: "two_sum", title: "Two Sum" });

    const detailResponse = await sendRequest({ method: "GET", path: "/api/problems/two_sum" });
    const detailBody = detailResponse.body;
    expect(detailBody.title).toBe("Two Sum");
    expect(detailBody.answerKey).toBeUndefined();
  });

  it("returns 404 for unknown problems", async () => {
    const response = await sendRequest({ method: "GET", path: "/api/problems/unknown" });
    const body = response.body;
    expect(response.status).toBe(404);
    expect(body.error).toMatch(/Problem not found/);
  });

  it("creates users and enforces validation", async () => {
    const invalid = await sendRequest({ method: "POST", path: "/api/users", body: { name: "" } });
    expect(invalid.status).toBe(400);

    const response = await sendRequest({ method: "POST", path: "/api/users", body: { name: "Ada" } });
    const body = response.body;
    expect(response.status).toBe(201);
    expect(body).toMatchObject({ name: "Ada" });
  });

  it("lists flashcard categories and cards", async () => {
    const categoriesResponse = await sendRequest({ method: "GET", path: "/api/flashcards" });
    expect(categoriesResponse.status).toBe(200);
    expect(categoriesResponse.body.categories[0]).toMatchObject({ id: "two_pointers" });

    const cardsResponse = await sendRequest({
      method: "GET",
      path: "/api/flashcards/two_pointers",
    });
    expect(cardsResponse.status).toBe(200);
    expect(cardsResponse.body.cards).toHaveLength(2);
  });

  it("stores flashcard stars for a user", async () => {
    const user = await storage.createUser("Zoe");

    const starResponse = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/flashcards/two_pointers/star`,
      body: { cardId: "two-pointers-core", starred: true },
    });
    expect(starResponse.status).toBe(200);
    expect(starResponse.body.starredIds).toContain("two-pointers-core");

    const unstarResponse = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/flashcards/two_pointers/star`,
      body: { cardId: "two-pointers-core", starred: false },
    });
    expect(unstarResponse.status).toBe(200);
    expect(unstarResponse.body.starredIds).not.toContain("two-pointers-core");
  });

  it("loads and guards user progress", async () => {
    const missing = await sendRequest({ method: "GET", path: "/api/users/missing/progress" });
    const missingBody = missing.body;
    expect(missing.status).toBe(404);
    expect(missingBody.error).toMatch(/User not found/);

    const user = await storage.createUser("Grace");
    user.attempts = { two_sum: [] };
    await storage.saveUser(user);

    const response = await sendRequest({ method: "GET", path: `/api/users/${user.id}/progress` });
    const body = response.body;
    expect(response.status).toBe(200);
    expect(body).toMatchObject({ id: user.id, name: "Grace" });
  });

  it("validates attempts and records correctness", async () => {
    const user = await storage.createUser("Linus");

    const missingProblemId = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/attempts`,
      body: { problemId: "", selections: null },
    });
    expect(missingProblemId.status).toBe(400);

    const missingProblem = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/attempts`,
      body: { problemId: "missing", selections: null },
    });
    expect(missingProblem.status).toBe(404);

    const invalidSelections = {
      algorithms: "alg-3",
      implementations: "impl-1",
      timeComplexities: "time-1",
      spaceComplexities: "space-1",
    };

    const invalidAttempt = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/attempts`,
      body: { problemId: "two_sum", selections: invalidSelections },
    });
    expect(invalidAttempt.status).toBe(400);

    const validSelections = {
      algorithms: "alg-1",
      implementations: "impl-1",
      timeComplexities: "time-1",
      spaceComplexities: "space-1",
    };

    const attemptResponse = await sendRequest({
      method: "POST",
      path: `/api/users/${user.id}/attempts`,
      body: { problemId: "two_sum", selections: validSelections },
    });
    const attemptBody = attemptResponse.body;
    expect(attemptResponse.status).toBe(201);
    expect(attemptBody.overallCorrect).toBe(true);
    expect(attemptBody.attempt.correctness.algorithms).toBe(true);

    const refreshedUser = await storage.getUser(user.id);
    expect(refreshedUser?.attempts.two_sum).toHaveLength(1);
  });

  it("requires a real user before recording attempts", async () => {
    const response = await sendRequest({
      method: "POST",
      path: "/api/users/ghost/attempts",
      body: { problemId: "two_sum", selections: {} },
    });
    const body = response.body;
    expect(response.status).toBe(404);
    expect(body.error).toMatch(/User not found/);
  });

  it("resets attempts for a user", async () => {
    const missingReset = await sendRequest({ method: "POST", path: "/api/users/ghost/reset" });
    const missingBody = missingReset.body;
    expect(missingReset.status).toBe(404);
    expect(missingBody.error).toMatch(/User not found/);

    const user = await storage.createUser("Pat");
    user.attempts = {
      two_sum: [
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
    };
    await storage.saveUser(user);

    const resetResponse = await sendRequest({ method: "POST", path: `/api/users/${user.id}/reset` });
    const resetBody = resetResponse.body;
    expect(resetResponse.status).toBe(200);
    expect(resetBody.attempts).toEqual({});
  });
});
