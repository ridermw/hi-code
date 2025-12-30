import {
  FlashcardCategory,
  FlashcardSet,
  Problem,
  ProblemSummary,
  User,
} from "../types";

export interface StorageProvider {
  getProblems(): Promise<ProblemSummary[]>;
  getProblemById(problemId: string): Promise<Problem | null>;
  getFlashcardCategories(): Promise<FlashcardCategory[]>;
  getFlashcardsByCategory(categoryId: string): Promise<FlashcardSet | null>;
  createUser(name: string): Promise<User>;
  getUser(userId: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
}
