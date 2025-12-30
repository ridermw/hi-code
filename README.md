# HI Code Interview Prep

This repository collects study notes and practice solutions for common coding interview topics. Use the structured problem lists in [`Problems`](Problems) alongside the worked examples in [`Solutions`](Solutions) to drive focused practice sessions.

## Repository layout
- **Problems/** – Topic-focused study guides (two pointers, sliding window, graphs, etc.) plus curated lists such as `HI-CodList.md` and `leetcode_favorites.md` for selecting practice sets.
- **Solutions/** – Reference implementations for select LeetCode-style questions (currently in C#). File names mirror problem numbers or titles for quick lookup.
- **.github/copilot-instructions.md** – Repository-wide Copilot instructions for coding agents.
- **.gitignore** – Keeps temporary scratch files out of version control.

## How to use this repo
1. Pick a topic from `Problems` (for example, `slidingwindow.md`) and skim the patterns and example breakdowns.
2. Choose a problem from the curated lists (e.g., `HI-CodList.md` or `leetcode_categories.md`).
3. Implement your solution in a new file under `Solutions`, following the existing naming approach (problem number or clear title, e.g., `0001.cs` or `ThreeSum.cs`).
4. Add brief problem context and complexity notes as comments at the top of each solution file.

## Local development tips
- The app lives in `app/`. Install dependencies with `npm run install:all --prefix app`.
- Default dev ports are `web:5173` and `server:3000`. For parallel clones, override ports:
  - `PORT=3001 npm run dev --prefix app/server`
  - `npm run dev --prefix app/web -- --port 5174`

## Adding new content
- **New problems:** Extend the relevant topic markdown file with succinct explanations, patterns, and examples.
- **New solutions:** Keep implementations self-contained and commented. Prefer idiomatic, readable code over micro-optimizations.
- **Organization:** If you add another language, create a subfolder inside `Solutions` and mirror the current naming convention for discoverability.

## Study tips
- Practice by category to build intuition for pattern recognition.
- Timebox attempts, then compare with the reference solutions to identify gaps.
- Revisit frequently missed patterns (e.g., sliding window boundaries, stack invariants) by re-reading the corresponding topic notes.
