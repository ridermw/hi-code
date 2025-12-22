import React, { useEffect, useMemo, useState } from "react";
import {
  fetchFlashcardCategories,
  fetchFlashcards,
  fetchFlashcardStars,
  updateFlashcardStar,
} from "../api";
import { Flashcard, FlashcardCategory } from "../types";
import { useUser } from "../user";

const DEFAULT_CATEGORY = "two_pointers";

type StudyMode = "term" | "definition";

export function FlashcardsPage(): JSX.Element {
  const { user } = useUser();
  const [categories, setCategories] = useState<FlashcardCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>("term");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchFlashcardCategories()
      .then((items) => {
        if (!isActive) {
          return;
        }
        setCategories(items);
        if (!items.find((item) => item.id === selectedCategory) && items[0]) {
          setSelectedCategory(items[0].id);
        }
      })
      .catch((loadError: any) => {
        if (!isActive) {
          return;
        }
        setError(loadError?.message ?? "Could not load flashcard categories.");
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      fetchFlashcards(selectedCategory),
      user ? fetchFlashcardStars(user.id, selectedCategory) : Promise.resolve([]),
    ])
      .then(([set, stars]) => {
        setCards(set.cards);
        setStarredIds(stars);
      })
      .catch((loadError: any) => {
        setError(loadError?.message ?? "Could not load flashcards.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, user]);

  const starredSet = useMemo(() => new Set(starredIds), [starredIds]);

  const filteredCards = useMemo(() => {
    if (!showStarredOnly) {
      return cards;
    }

    return cards.filter((card) => starredSet.has(card.id));
  }, [cards, showStarredOnly, starredSet]);

  const currentCard = filteredCards[currentIndex];
  const totalCards = filteredCards.length;
  const starredCount = starredIds.length;
  const mastery = totalCards
    ? Math.max(0, Math.round(((totalCards - starredCount) / totalCards) * 100))
    : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, showStarredOnly]);

  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredCards.length]);

  const handleToggleStar = async () => {
    if (!user || !currentCard) {
      return;
    }

    const nextStarred = !starredSet.has(currentCard.id);

    try {
      const updated = await updateFlashcardStar(
        user.id,
        selectedCategory,
        currentCard.id,
        nextStarred
      );
      setStarredIds(updated);
    } catch (updateError: any) {
      setError(updateError?.message ?? \"Could not update flashcard.\");
    }
  };

  const handleNext = () => {
    if (!totalCards) {
      return;
    }

    setCurrentIndex((index) => (index + 1) % totalCards);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (!totalCards) {
      return;
    }

    setCurrentIndex((index) => (index - 1 + totalCards) % totalCards);
    setIsFlipped(false);
  };

  return (
    <section className="panel flashcards-panel">
      <header className="panel-header flashcards-header">
        <div>
          <p className="eyebrow">Memory game</p>
          <h1>Flashcards</h1>
          <p className="muted">Practice concepts, patterns, and algorithm selection cues.</p>
        </div>
        <div className="flashcards-controls">
          <label className="flashcards-select">
            Category
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="toggle-group">
            <button
              type="button"
              className={studyMode === "term" ? "toggle is-active" : "toggle"}
              onClick={() => setStudyMode("term")}
            >
              Term first
            </button>
            <button
              type="button"
              className={studyMode === "definition" ? "toggle is-active" : "toggle"}
              onClick={() => setStudyMode("definition")}
            >
              Definition first
            </button>
          </div>
          <label className="flashcards-checkbox">
            <input
              type="checkbox"
              checked={showStarredOnly}
              onChange={(event) => setShowStarredOnly(event.target.checked)}
            />
            Study starred only
          </label>
        </div>
      </header>

      {loading ? <p className="muted">Loading flashcards...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error ? (
        <div className="flashcards-body">
          <div className="flashcards-status">
            <span className="pill">
              Card {totalCards ? currentIndex + 1 : 0} of {totalCards}
            </span>
            <span className="pill">Starred {starredCount}</span>
            <span className="pill">Mastery {mastery}%</span>
          </div>

          {currentCard ? (
            <div className={`flashcard ${isFlipped ? "is-flipped" : ""}`}>
              <div className="flashcard-inner">
                <div className="flashcard-face flashcard-front">
                  <div className="flashcard-top">
                    <span className="pill">{currentCard.category.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      className={
                        starredSet.has(currentCard.id)
                          ? "ghost-button star-button is-starred"
                          : "ghost-button star-button"
                      }
                      onClick={handleToggleStar}
                    >
                      {starredSet.has(currentCard.id) ? "Starred" : "Star"}
                    </button>
                  </div>
                  <p className="eyebrow">{studyMode === "term" ? "Term" : "Definition"}</p>
                  {studyMode === "term" ? (
                    <h2>{currentCard.term}</h2>
                  ) : (
                    <p className="flashcard-definition">{currentCard.definition}</p>
                  )}
                  <button
                    type="button"
                    className="ghost-button flip-button"
                    onClick={() => setIsFlipped(true)}
                  >
                    Flip card
                  </button>
                </div>
                <div className="flashcard-face flashcard-back">
                  <div className="flashcard-top">
                    <span className="pill">{currentCard.category.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      className={
                        starredSet.has(currentCard.id)
                          ? "ghost-button star-button is-starred"
                          : "ghost-button star-button"
                      }
                      onClick={handleToggleStar}
                    >
                      {starredSet.has(currentCard.id) ? "Starred" : "Star"}
                    </button>
                  </div>
                  <p className="eyebrow">{studyMode === "term" ? "Definition" : "Term"}</p>
                  {studyMode === "term" ? (
                    <p className="flashcard-definition">{currentCard.definition}</p>
                  ) : (
                    <h2>{currentCard.term}</h2>
                  )}
                  <div className="flashcard-lists">
                    <div>
                      <h3>When to use</h3>
                      <ul>
                        {currentCard.whenToUse.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Generic patterns</h3>
                      <ul>
                        {currentCard.genericPatterns.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flashcard-examples">
                    <h3>Simple examples</h3>
                    <ul>
                      {currentCard.simpleExamples.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {currentCard.algorithmPrompt ? (
                    <div className="flashcard-prompt">
                      <p className="eyebrow">Algorithm prompt</p>
                      <p>{currentCard.algorithmPrompt}</p>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="ghost-button flip-button"
                    onClick={() => setIsFlipped(false)}
                  >
                    Flip back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flashcards-empty">
              <p className="muted">No flashcards match this filter yet.</p>
            </div>
          )}

          <div className="flashcard-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={handlePrevious}
              disabled={!totalCards}
            >
              Previous
            </button>
            <button type="button" className="primary" onClick={handleNext} disabled={!totalCards}>
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
