export type ProblemSection =
  | "algorithms"
  | "implementations"
  | "timeComplexities"
  | "spaceComplexities";

export interface ProblemSummary {
  id: string;
  title: string;
  category: string;
  difficulty: string;
}

export interface ProblemOption {
  id: string;
  label: string;
}

export interface ProblemDetail extends ProblemSummary {
  statement: string;
  signature: string;
  sections: Record<ProblemSection, ProblemOption[]>;
}

export type AttemptSelections = Record<ProblemSection, string>;

export type AttemptCorrectness = Record<ProblemSection, boolean>;

export interface Attempt {
  timestamp: string;
  selections: AttemptSelections;
  correctness: AttemptCorrectness;
}

export interface AttemptEvaluation {
  attempt: Attempt;
  overallCorrect: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  attempts: Record<string, Attempt[]>;
}
