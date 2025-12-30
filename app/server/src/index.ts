import fs from "fs";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import { FileStorageProvider } from "./storage/fileStorageProvider";
import { StorageProvider } from "./storage/storageProvider";
import { Attempt, AttemptSelections, Problem, ProblemSection } from "./types";

const PORT = Number(process.env.PORT) || 3000;

const REQUIRED_SECTIONS: ProblemSection[] = [
  "algorithms",
  "implementations",
  "timeComplexities",
  "spaceComplexities",
];

type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";

const LOG_LEVELS: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

function normalizeLogLevel(value: string | undefined): LogLevel {
  const normalized = (value ?? "info").toLowerCase() as LogLevel;
  return normalized in LOG_LEVELS ? normalized : "info";
}

const CURRENT_LOG_LEVEL = normalizeLogLevel(
  process.env.HI_CODE_LOG_LEVEL ?? process.env.LOG_LEVEL
);

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[CURRENT_LOG_LEVEL];
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const logger =
    level === "error"
      ? console.error
      : level === "warn"
      ? console.warn
      : level === "debug" || level === "trace"
      ? console.debug
      : console.info;

  if (meta !== undefined) {
    logger(message, meta);
    return;
  }

  logger(message);
}

function formatLogValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === "string") {
    return value.length > 500 ? `${value.slice(0, 500)}...` : value;
  }

  if (typeof value === "object") {
    try {
      const serialized = JSON.stringify(value);
      return serialized.length > 500 ? `${serialized.slice(0, 500)}...` : value;
    } catch {
      return value;
    }
  }

  return value;
}

function sendBadRequest(response: Response, message: string): void {
  response.status(400).json({ error: message });
}

function sendNotFound(response: Response, message: string): void {
  response.status(404).json({ error: message });
}

type AsyncHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

function asyncHandler(handler: AsyncHandler) {
  return (request: Request, response: Response, next: NextFunction): void => {
    void handler(request, response, next).catch(next);
  };
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

    const options = problem.sections[section];
    if (!Array.isArray(options) || options.length === 0) {
      return `Problem is missing options for ${section}.`;
    }

    const optionExists = options.some((option) => option.id === selection);

    if (!optionExists) {
      return `Selection ${selection} is not a valid option for ${section}.`;
    }
  }

  return null;
}

export function createServer(storage: StorageProvider): express.Express {
  const app = express();
  const rootDir = path.resolve(__dirname, "..");
  const webDistDir = path.resolve(rootDir, "..", "web", "dist");
  const webIndexFile = path.join(webDistDir, "index.html");
  const hasWebIndex = fs.existsSync(webIndexFile);

  app.use(express.json());
  app.use((request: Request, response: Response, next: NextFunction) => {
    if (!request.path.startsWith("/api")) {
      return next();
    }

    const start = Date.now();

    if (shouldLog("trace")) {
      log("trace", `[api] request ${request.method} ${request.originalUrl}`, {
        query: request.query,
        body: formatLogValue(request.body),
      });
    }

    response.on("finish", () => {
      const duration = Date.now() - start;
      log(
        "info",
        `[api] ${request.method} ${request.originalUrl} -> ${response.statusCode} (${duration}ms)`
      );
    });

    next();
  });

  app.get(
    "/api/problems",
    asyncHandler(async (_request: Request, response: Response) => {
      const problems = await storage.getProblems();
      response.json({ problems });
    })
  );

  app.get(
    "/api/flashcards",
    asyncHandler(async (_request: Request, response: Response) => {
      const categories = await storage.getFlashcardCategories();
      response.json({ categories });
    })
  );

  app.get(
    "/api/flashcards/:categoryId",
    asyncHandler(async (request: Request, response: Response) => {
      const set = await storage.getFlashcardsByCategory(request.params.categoryId);

      if (!set) {
        return sendNotFound(response, "Flashcard category not found.");
      }

      response.json(set);
    })
  );

  app.get(
    "/api/problems/:id",
    asyncHandler(async (request: Request, response: Response) => {
      const problem = await storage.getProblemById(request.params.id);

      if (!problem) {
        return sendNotFound(response, "Problem not found.");
      }

      const { answerKey, ...problemWithoutAnswer } = problem;
      response.json(problemWithoutAnswer);
    })
  );

  app.post(
    "/api/users",
    asyncHandler(async (request: Request, response: Response) => {
      const name = request.body?.name;

      if (typeof name !== "string" || !name.trim()) {
        return sendBadRequest(response, "A non-empty name is required.");
      }

      const user = await storage.createUser(name.trim());
      response.status(201).json(user);
    })
  );

  app.get(
    "/api/users/:userId/progress",
    asyncHandler(async (request: Request, response: Response) => {
      const user = await storage.getUser(request.params.userId);

      if (!user) {
        return sendNotFound(response, "User not found.");
      }

      response.json({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        attempts: user.attempts,
        flashcardStars: user.flashcardStars,
      });
    })
  );

  app.get(
    "/api/users/:userId/flashcards/:categoryId",
    asyncHandler(async (request: Request, response: Response) => {
      const user = await storage.getUser(request.params.userId);

      if (!user) {
        return sendNotFound(response, "User not found.");
      }

      const categoryId = request.params.categoryId;
      const set = await storage.getFlashcardsByCategory(categoryId);

      if (!set) {
        return sendNotFound(response, "Flashcard category not found.");
      }

      response.json({
        categoryId,
        starredIds: user.flashcardStars[categoryId] ?? [],
      });
    })
  );

  app.post(
    "/api/users/:userId/flashcards/:categoryId/star",
    asyncHandler(async (request: Request, response: Response) => {
      const { cardId, starred } = request.body ?? {};

      if (typeof cardId !== "string" || !cardId.trim()) {
        return sendBadRequest(response, "A cardId is required.");
      }

      if (typeof starred !== "boolean") {
        return sendBadRequest(response, "Starred must be a boolean.");
      }

      const user = await storage.getUser(request.params.userId);

      if (!user) {
        return sendNotFound(response, "User not found.");
      }

      const categoryId = request.params.categoryId;
      const set = await storage.getFlashcardsByCategory(categoryId);

      if (!set) {
        return sendNotFound(response, "Flashcard category not found.");
      }

      const cardExists = set.cards.some((card) => card.id === cardId);

      if (!cardExists) {
        return sendBadRequest(response, "Flashcard not found in this category.");
      }

      const existing = new Set(user.flashcardStars[categoryId] ?? []);

      if (starred) {
        existing.add(cardId);
      } else {
        existing.delete(cardId);
      }

      user.flashcardStars[categoryId] = Array.from(existing);
      await storage.saveUser(user);

      response.json({
        categoryId,
        starredIds: user.flashcardStars[categoryId],
      });
    })
  );

  app.post(
    "/api/users/:userId/attempts",
    asyncHandler(async (request: Request, response: Response) => {
      const { problemId, selections } = request.body ?? {};

      if (typeof problemId !== "string" || !problemId.trim()) {
        return sendBadRequest(response, "A problemId is required.");
      }

      const trimmedProblemId = problemId.trim();
      const user = await storage.getUser(request.params.userId);

      if (!user) {
        return sendNotFound(response, "User not found.");
      }

      const problem = await storage.getProblemById(trimmedProblemId);

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
    })
  );

  app.post(
    "/api/users/:userId/reset",
    asyncHandler(async (request: Request, response: Response) => {
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
        flashcardStars: user.flashcardStars,
      });
    })
  );

  app.use(express.static(webDistDir));

  app.get("*", async (request: Request, response: Response, next: NextFunction) => {
    if (request.path.startsWith("/api")) {
      return next();
    }

    if (!hasWebIndex) {
      return next();
    }

    response.sendFile(webIndexFile, (error) => {
      if (error) {
        next(error);
      }
    });
  });

  app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
    log(
      "error",
      `[${new Date().toISOString()}] ${request.method} ${request.url}:`,
      error
    );
    response.status(500).json({ error: "Internal server error. Please try again later." });
  });

  return app;
}

const storage = new FileStorageProvider();
export const app = createServer(storage);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    log("info", `Server listening on port ${PORT}`);
  });
}
