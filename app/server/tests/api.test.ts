import type { AddressInfo } from "net";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServer } from "../src";
import { StorageProvider } from "../src/storage/storageProvider";
import { Problem, ProblemSummary, User } from "../src/types";

class InMemoryStorageProvider implements StorageProvider {
  private users: Record<string, User> = {};
  private readonly problems: Problem[];

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

  async createUser(name: string): Promise<User> {
    const user: User = {
      id: `user-${Object.keys(this.users).length + 1}`,
      name,
      createdAt: new Date().toISOString(),
      attempts: {},
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

async function parseJson(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

describe("API endpoints", () => {
  let baseUrl: string;
  let shutdown: () => Promise<void>;
  let storage: InMemoryStorageProvider;

  beforeEach(() => {
    const created = createTestServer();
    storage = created.storage;
    const server = created.app.listen(0);
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
    shutdown = () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      });
  });

  afterEach(async () => {
    await shutdown();
  });

  it("lists problems and omits answer keys", async () => {
    const listResponse = await fetch(`${baseUrl}/api/problems`);
    const listBody = await parseJson(listResponse);
    expect(listResponse.status).toBe(200);
    expect(listBody.problems).toHaveLength(1);
    expect(listBody.problems[0]).toMatchObject({ id: "two_sum", title: "Two Sum" });

    const detailResponse = await fetch(`${baseUrl}/api/problems/two_sum`);
    const detailBody = await parseJson(detailResponse);
    expect(detailBody.title).toBe("Two Sum");
    expect(detailBody.answerKey).toBeUndefined();
  });

  it("returns 404 for unknown problems", async () => {
    const response = await fetch(`${baseUrl}/api/problems/unknown`);
    const body = await parseJson(response);
    expect(response.status).toBe(404);
    expect(body.error).toMatch(/Problem not found/);
  });

  it("creates users and enforces validation", async () => {
    const invalid = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "" }),
    });
    expect(invalid.status).toBe(400);

    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ada" }),
    });
    const body = await parseJson(response);
    expect(response.status).toBe(201);
    expect(body).toMatchObject({ name: "Ada" });
  });

  it("loads and guards user progress", async () => {
    const missing = await fetch(`${baseUrl}/api/users/missing/progress`);
    const missingBody = await parseJson(missing);
    expect(missing.status).toBe(404);
    expect(missingBody.error).toMatch(/User not found/);

    const user = await storage.createUser("Grace");
    user.attempts = { two_sum: [] };
    await storage.saveUser(user);

    const response = await fetch(`${baseUrl}/api/users/${user.id}/progress`);
    const body = await parseJson(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({ id: user.id, name: "Grace" });
  });

  it("validates attempts and records correctness", async () => {
    const user = await storage.createUser("Linus");

    const missingProblemId = await fetch(`${baseUrl}/api/users/${user.id}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: "", selections: null }),
    });
    expect(missingProblemId.status).toBe(400);

    const missingProblem = await fetch(`${baseUrl}/api/users/${user.id}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: "missing", selections: null }),
    });
    expect(missingProblem.status).toBe(404);

    const invalidSelections = {
      algorithms: "alg-3",
      implementations: "impl-1",
      timeComplexities: "time-1",
      spaceComplexities: "space-1",
    };

    const invalidAttempt = await fetch(`${baseUrl}/api/users/${user.id}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: "two_sum", selections: invalidSelections }),
    });
    expect(invalidAttempt.status).toBe(400);

    const validSelections = {
      algorithms: "alg-1",
      implementations: "impl-1",
      timeComplexities: "time-1",
      spaceComplexities: "space-1",
    };

    const attemptResponse = await fetch(`${baseUrl}/api/users/${user.id}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: "two_sum", selections: validSelections }),
    });
    const attemptBody = await parseJson(attemptResponse);
    expect(attemptResponse.status).toBe(201);
    expect(attemptBody.overallCorrect).toBe(true);
    expect(attemptBody.attempt.correctness.algorithms).toBe(true);

    const refreshedUser = await storage.getUser(user.id);
    expect(refreshedUser?.attempts.two_sum).toHaveLength(1);
  });

  it("requires a real user before recording attempts", async () => {
    const response = await fetch(`${baseUrl}/api/users/ghost/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: "two_sum", selections: {} }),
    });
    const body = await parseJson(response);
    expect(response.status).toBe(404);
    expect(body.error).toMatch(/User not found/);
  });

  it("resets attempts for a user", async () => {
    const missingReset = await fetch(`${baseUrl}/api/users/ghost/reset`, { method: "POST" });
    const missingBody = await parseJson(missingReset);
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

    const resetResponse = await fetch(`${baseUrl}/api/users/${user.id}/reset`, { method: "POST" });
    const resetBody = await parseJson(resetResponse);
    expect(resetResponse.status).toBe(200);
    expect(resetBody.attempts).toEqual({});
  });
});
