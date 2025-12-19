export enum SectionType {
  Algorithm = "algorithm",
  Implementation = "implementation",
  TimeComplexity = "timeComplexity",
  SpaceComplexity = "spaceComplexity",
}

export interface Option {
  id: string;
  label: string;
  description?: string;
  isCorrect: boolean;
}

export interface Problem {
  id: string;
  prompt: string;
  section: SectionType;
  options: Option[];
  explanation?: string;
  tags?: string[];
}

export interface AttemptResult {
  isCorrect: boolean;
  selectedOptionId: string;
  section: SectionType;
  evaluatedAt: string;
  feedback?: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  userId: string;
  submittedAt: string;
  result?: AttemptResult;
}

export interface UserProgress {
  userId: string;
  attempts: Attempt[];
  completedProblemIds: string[];
  streakCount?: number;
  lastActiveAt?: string;
}
