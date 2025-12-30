export type ProblemSection =
  | "algorithms"
  | "implementations"
  | "timeComplexities"
  | "spaceComplexities";

export interface ProblemOption {
  id: string;
  label: string;
}

export interface Problem {
  id: string;
  title: string;
  statement: string;
  signature: string;
  category: string;
  difficulty: string;
  sections: Record<ProblemSection, ProblemOption[]>;
  answerKey: Record<ProblemSection, string>;
}

export interface ProblemSummary {
  id: string;
  title: string;
  category: string;
  difficulty: string;
}

export interface Flashcard {
  id: string;
  category: string;
  term: string;
  definition: string;
  whenToUse: string[];
  genericPatterns: string[];
  simpleExamples: string[];
  algorithmPrompt?: string;
  difficultyStarred: boolean;
}

export interface FlashcardCategory {
  id: string;
  name: string;
  description?: string;
  totalCards: number;
}

export interface FlashcardSet {
  category: FlashcardCategory;
  cards: Flashcard[];
}

export interface AttemptSelections {
  algorithms: string;
  implementations: string;
  timeComplexities: string;
  spaceComplexities: string;
}

export interface Attempt {
  timestamp: string;
  selections: AttemptSelections;
  correctness: Record<ProblemSection, boolean>;
}

export interface User {
  id: string;
  name: string;
  createdAt: string;
  attempts: Record<string, Attempt[]>;
  flashcardStars: Record<string, string[]>;
}
