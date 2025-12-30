import fs from "fs/promises";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FileStorageProvider } from "../src/storage/fileStorageProvider";
import { User } from "../src/types";

const dataDir = path.resolve(__dirname, "..", "data");
const usersDir = path.join(dataDir, "users");

describe("FileStorageProvider", () => {
  const storage = new FileStorageProvider();
  const createdUserIds: string[] = [];

  beforeEach(async () => {
    await fs.mkdir(usersDir, { recursive: true });
  });

  afterEach(async () => {
    await Promise.all(
      createdUserIds.map(async (id) => {
        const userPath = path.join(usersDir, `${id}.json`);
        try {
          await fs.unlink(userPath);
        } catch (error: any) {
          if (error?.code !== "ENOENT") {
            throw error;
          }
        }
      })
    );
    createdUserIds.length = 0;
  });

  it("loads problems and flashcard categories from disk", async () => {
    const problems = await storage.getProblems();
    expect(problems.length).toBeGreaterThan(0);
    expect(problems[0]).toHaveProperty("id");

    const categories = await storage.getFlashcardCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("id");
  });

  it("returns a flashcard set for a valid category", async () => {
    const set = await storage.getFlashcardsByCategory("two_pointers");
    expect(set).not.toBeNull();
    expect(set?.cards.length).toBeGreaterThan(0);
  });

  it("returns null for missing flashcard categories", async () => {
    const set = await storage.getFlashcardsByCategory("missing-category");
    expect(set).toBeNull();
  });

  it("creates, reads, and saves users", async () => {
    const user = await storage.createUser("Flash");
    createdUserIds.push(user.id);
    expect(user.name).toBe("Flash");

    const loaded = await storage.getUser(user.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.flashcardStars).toEqual({});

    const updated: User = {
      ...(loaded as User),
      attempts: { sample: [] },
      flashcardStars: { two_pointers: ["two-pointers-core"] },
    };
    await storage.saveUser(updated);

    const refreshed = await storage.getUser(user.id);
    expect(refreshed?.attempts.sample).toEqual([]);
    expect(refreshed?.flashcardStars.two_pointers).toEqual(["two-pointers-core"]);
  });

  it("returns null when a user is missing", async () => {
    const missing = await storage.getUser("missing-user");
    expect(missing).toBeNull();
  });
});
