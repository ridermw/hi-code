import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlashcardCategory, FlashcardSet } from "../types";

const apiMocks = vi.hoisted(() => ({
  fetchFlashcardCategories: vi.fn(),
  fetchFlashcards: vi.fn(),
  fetchFlashcardStars: vi.fn(),
  updateFlashcardStar: vi.fn(),
}));

const userMocks = vi.hoisted(() => ({
  user: {
    id: "user-1",
    name: "Ada",
    createdAt: "2024-01-01T00:00:00.000Z",
    attempts: {},
    flashcardStars: {},
  },
}));

vi.mock("../api", () => apiMocks);
vi.mock("../user", () => ({
  useUser: () => ({
    user: userMocks.user,
    loading: false,
    authenticate: vi.fn(),
    clearUser: vi.fn(),
    recordAttempt: vi.fn(),
    resetProgress: vi.fn(),
    refreshProfile: vi.fn(),
  }),
}));

import { FlashcardsPage } from "./FlashcardsPage";

const flashcardSet: FlashcardSet = {
  category: {
    id: "two_pointers",
    name: "Two Pointers",
    description: "Core pointer patterns for arrays and linked lists.",
    totalCards: 2,
  },
  cards: [
    {
      id: "two-pointers-core",
      category: "two_pointers",
      term: "Two Pointers",
      definition: "Use two indices to traverse data structures.",
      whenToUse: ["Sorted arrays", "Pair search"],
      genericPatterns: ["Opposite ends", "Fast/slow"],
      simpleExamples: ["Find a pair that sums to a target."],
      algorithmPrompt: "Pick a pointer strategy for a sorted array target sum.",
      difficultyStarred: false,
    },
    {
      id: "two-pointers-opposite-ends",
      category: "two_pointers",
      term: "Opposite Ends",
      definition: "Start at both ends and move inward.",
      whenToUse: ["Sorted arrays"],
      genericPatterns: ["left++, right-- based on condition"],
      simpleExamples: ["Container-style max area."],
      difficultyStarred: false,
    },
  ],
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve: (value: T) => void = () => undefined;
  let reject: (error: unknown) => void = () => undefined;

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return { promise, resolve, reject };
}

let categoriesDeferred: Deferred<FlashcardCategory[]>;
let flashcardsDeferred: Deferred<FlashcardSet>;
let starsDeferred: Deferred<string[]>;
let updateStarDeferred: Deferred<string[]> | null = null;

async function renderFlashcardsPage(): Promise<void> {
  render(<FlashcardsPage />);
  let resolved = false;
  await waitFor(async () => {
    if (!resolved) {
      resolved = true;
      categoriesDeferred.resolve([
        {
          id: flashcardSet.category.id,
          name: flashcardSet.category.name,
          description: flashcardSet.category.description,
          totalCards: flashcardSet.category.totalCards,
        },
      ]);
      flashcardsDeferred.resolve(flashcardSet);
      starsDeferred.resolve(["two-pointers-core"]);
      await Promise.resolve();
    }
    expect(screen.getByRole("heading", { name: "Two Pointers" })).toBeInTheDocument();
  });
}

describe("FlashcardsPage", () => {
  beforeEach(() => {
    categoriesDeferred = createDeferred();
    flashcardsDeferred = createDeferred();
    starsDeferred = createDeferred();
    updateStarDeferred = null;

    apiMocks.fetchFlashcardCategories.mockReturnValue(categoriesDeferred.promise);
    apiMocks.fetchFlashcards.mockReturnValue(flashcardsDeferred.promise);
    apiMocks.fetchFlashcardStars.mockReturnValue(starsDeferred.promise);
    apiMocks.updateFlashcardStar.mockImplementation(() => {
      updateStarDeferred = createDeferred();
      return updateStarDeferred.promise;
    });
  });

  it("renders a flashcard and supports flipping", async () => {
    const user = userEvent.setup();
    await renderFlashcardsPage();

    expect(screen.getByText(/Card 1 of 2/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Flip card/i }));
    expect(await screen.findByText(/Use two indices to traverse data structures/)).toBeInTheDocument();
    expect(screen.getByText(/When to use/)).toBeInTheDocument();
    expect(screen.getByText(/Algorithm prompt/)).toBeInTheDocument();
  });

  it("toggles study mode and starred filter", async () => {
    const user = userEvent.setup();
    await renderFlashcardsPage();

    await user.click(screen.getByRole("button", { name: /Definition first/i }));
    expect(screen.getByText(/Use two indices to traverse data structures/)).toBeInTheDocument();

    const starButtons = screen.getAllByRole("button", { name: /Starred/i });
    await user.click(starButtons[0]);
    let resolved = false;
    await waitFor(async () => {
      if (!resolved) {
        resolved = true;
        updateStarDeferred?.resolve([]);
        await Promise.resolve();
      }
      expect(apiMocks.updateFlashcardStar).toHaveBeenCalledWith(
        "user-1",
        "two_pointers",
        "two-pointers-core",
        false
      );
      expect(screen.getAllByRole("button", { name: "Star" })).toHaveLength(2);
    });

    await user.click(screen.getByLabelText(/Study starred only/i));
    expect(await screen.findByText(/No flashcards match this filter yet/)).toBeInTheDocument();
  });

  it("moves to the next card", async () => {
    const user = userEvent.setup();
    await renderFlashcardsPage();

    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(await screen.findByText("Opposite Ends")).toBeInTheDocument();
  });
});
