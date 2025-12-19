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
  sections: {
    algorithms: ProblemOption[];
    implementations: ProblemOption[];
    timeComplexities: ProblemOption[];
    spaceComplexities: ProblemOption[];
  };
}

export interface Attempt {
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  attempts: Record<string, Attempt[]>;
}
