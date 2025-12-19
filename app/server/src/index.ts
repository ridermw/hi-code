import express, { NextFunction, Request, Response } from "express";
import { FileStorageProvider } from "./storage/fileStorageProvider";
import { Attempt, AttemptSelections, Problem, ProblemSection } from "./types";

const PORT = Number(process.env.PORT) || 3000;
const storage = new FileStorageProvider();
const app = express();

app.use(express.json());

const REQUIRED_SECTIONS: ProblemSection[] = [
  "algorithms",
  "implementations",
  "timeComplexities",
  "spaceComplexities",
];

function sendBadRequest(response: Response, message: string): void {
  response.status(400).json({ error: message });
}

function sendNotFound(response: Response, message: string): void {
  response.status(404).json({ error: message });
}

function validateSelections(
  problem: Problem,
  selections: AttemptSelections | undefined | null
): string | null {
  if (selections === null || selections === undefined || typeof selections !== "object") {
    return "Selections for each section are required.";
  }

  for (const section of REQUIRED_SECTIONS) {
    const selection = selections?.[section];
    if (typeof selection !== "string" || !selection.trim()) {
      return `Selection for ${section} is required.`;
    }

    const optionExists = problem.sections[section].some(
      (option) => option.id === selection
    );

    if (!optionExists) {
      return `Selection ${selection} is not a valid option for ${section}.`;
    }
  }

  return null;
}

app.get("/api/problems", async (_request: Request, response: Response) => {
  const problems = await storage.getProblems();
  response.json({ problems });
});

app.get("/api/problems/:id", async (request: Request, response: Response) => {
  const problem = await storage.getProblemById(request.params.id);

  if (!problem) {
    return sendNotFound(response, "Problem not found.");
  }

  const { answerKey, ...problemWithoutAnswer } = problem;
  response.json(problemWithoutAnswer);
});

app.post("/api/users", async (request: Request, response: Response) => {
  const name = request.body?.name;

  if (typeof name !== "string" || !name.trim()) {
    return sendBadRequest(response, "A non-empty name is required.");
  }

  const user = await storage.createUser(name.trim());
  response.status(201).json(user);
});

app.get(
  "/api/users/:userId/progress",
  async (request: Request, response: Response) => {
    const user = await storage.getUser(request.params.userId);

    if (!user) {
      return sendNotFound(response, "User not found.");
    }

    response.json({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      attempts: user.attempts,
    });
  }
);

app.post(
  "/api/users/:userId/attempts",
  async (request: Request, response: Response) => {
    const { problemId, selections } = request.body ?? {};

    if (typeof problemId !== "string" || !problemId.trim()) {
      return sendBadRequest(response, "A problemId is required.");
    }

    const user = await storage.getUser(request.params.userId);

    if (!user) {
      return sendNotFound(response, "User not found.");
    }

    const problem = await storage.getProblemById(problemId);

    if (!problem) {
      return sendNotFound(response, "Problem not found.");
    }

    const validationError = validateSelections(problem, selections);

    if (validationError) {
      return sendBadRequest(response, validationError);
    }

    const typedSelections = selections as AttemptSelections;

    const correctness = REQUIRED_SECTIONS.reduce<
      Record<ProblemSection, boolean>
    >(
      (result, section) => ({
        ...result,
        [section]: problem.answerKey[section] === typedSelections[section],
      }),
      {
        algorithms: false,
        implementations: false,
        timeComplexities: false,
        spaceComplexities: false,
      }
    );

    const attempt: Attempt = {
      timestamp: new Date().toISOString(),
      selections: typedSelections,
      correctness,
    };

    const existingAttempts = user.attempts[problem.id] ?? [];
    user.attempts[problem.id] = [...existingAttempts, attempt];

    await storage.saveUser(user);

    response.status(201).json({
      attempt,
      overallCorrect: Object.values(correctness).every((value) => value),
    });
  }
);

app.post(
  "/api/users/:userId/reset",
  async (request: Request, response: Response) => {
    const user = await storage.getUser(request.params.userId);

    if (!user) {
      return sendNotFound(response, "User not found.");
    }

    user.attempts = {};
    await storage.saveUser(user);

    response.json({
      message: "Progress reset for user.",
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      attempts: user.attempts,
    });
  }
);

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
