import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Problem, ProblemSummary, User } from "../types";
import { StorageProvider } from "./storageProvider";

interface ProblemIndexEntry extends ProblemSummary {
  path: string;
}

interface ProblemsIndexFile {
  problems: ProblemIndexEntry[];
}

export class FileStorageProvider implements StorageProvider {
  private readonly dataDir = path.resolve(__dirname, "..", "..", "data");
  private readonly usersDir = path.join(this.dataDir, "users");
  private readonly problemsIndexPath = path.join(this.dataDir, "problems.json");

  private async readJson<T>(filePath: string): Promise<T> {
    const contents = await fs.readFile(filePath, "utf-8");
    return JSON.parse(contents) as T;
  }

  private async ensureUsersDir(): Promise<void> {
    await fs.mkdir(this.usersDir, { recursive: true });
  }

  private async loadProblemsIndex(): Promise<ProblemsIndexFile> {
    return this.readJson<ProblemsIndexFile>(this.problemsIndexPath);
  }

  async getProblems(): Promise<ProblemSummary[]> {
    const index = await this.loadProblemsIndex();
    return index.problems.map(({ id, title, category, difficulty }) => ({
      id,
      title,
      category,
      difficulty,
    }));
  }

  async getProblemById(problemId: string): Promise<Problem | null> {
    const index = await this.loadProblemsIndex();
    const entry = index.problems.find((problem) => problem.id === problemId);

    if (!entry) {
      return null;
    }

    const problemPath = path.join(this.dataDir, entry.path);
    return this.readJson<Problem>(problemPath);
  }

  async createUser(name: string): Promise<User> {
    await this.ensureUsersDir();
    const id = randomUUID();
    const user: User = {
      id,
      name,
      createdAt: new Date().toISOString(),
      attempts: {},
    };

    const userPath = path.join(this.usersDir, `${id}.json`);
    await fs.writeFile(userPath, JSON.stringify(user, null, 2), "utf-8");
    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userPath = path.join(this.usersDir, `${userId}.json`);
      return await this.readJson<User>(userPath);
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  async saveUser(user: User): Promise<void> {
    await this.ensureUsersDir();
    const userPath = path.join(this.usersDir, `${user.id}.json`);
    await fs.writeFile(userPath, JSON.stringify(user, null, 2), "utf-8");
  }
}
