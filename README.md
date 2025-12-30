# HI Code Interview Prep

A comprehensive collection of algorithm patterns, data structures, and practice problems designed for coding interview preparation. All 85+ curated problems include detailed explanations, 5 worked examples per problem, pseudocode with complexity analysis, and complete C# solutions.

## Repository Structure

### Problems/ - Study Guides and Problem References
Comprehensive topic-focused markdown files with concept explanations, patterns, examples, and links to all related LeetCode problems.

| Topic | File | Problems | Focus |
| --- | --- | --- | --- |
| Two Pointers | `twopointers.md` | 7 | Converging/opposing approaches for arrays |
| Sliding Window | `slidingwindow.md` | 6 | Contiguous subarrays/substrings |
| Breadth-First Search | `breadth_first_search.md` | 8 | Level-order traversal, shortest paths |
| Depth-First Search | `depth_first_search.md` | 14 | Tree/graph traversal, backtracking |
| Dynamic Programming | `dynamic_programming.md` | 7 | Memoization, tabulation, optimization |
| Graphs | `graphs.md` | 3 | Topological sort, cycle detection |
| Greedy | `greedy.md` | 3 | Local optima to global solutions |
| Heap | `heap.md` | 4 | Priority queues, top-K problems |
| Linked Lists | `LinkedList.md` | 5 | Two-pointer, cycle detection, reversal |
| Binary Search | `binary_search.md` | 3 | Sorted arrays, boundary conditions |
| Stacks | `stacks.md` | 5 | LIFO, matching pairs, monotonic stacks |
| Tries | `trie.md` | 3 | Prefix trees, string matching |
| Prefix Sum | `prefix_sum.md` | 4 | Range queries, subarray problems |
| Matrices | `matrices.md` | 3 | In-place manipulation, spiral traversal |
| Intervals | `intervals.md` | 7 | Merging, scheduling, overlaps |
| Backtracking | `backtracking.md` | 4 | Combinations, permutations, constraints |
| Design | `design.md` | 1 | LFU Cache (data structure design) |

Curated lists:
- `HI-CodList.md` - 85 problems mapped to frequency, difficulty, and category.
- `leetcode_favorites.md` - High-frequency interview problems.
- `leetcode_categories.md` - Alternative categorization by topic.

### Solutions/ - Reference Implementations
Complete, commented C# solutions for select problems. File names follow LeetCode convention (e.g., `0001.cs`, `TwoSum.cs`) for quick lookup.

### Other Files
- `README.md` - This file.
- `.gitignore` - Excludes build artifacts and temporary scratch files.
- `app/` - Full-stack TypeScript app (React + Vite frontend, Express backend). See `app/README.md` for app-specific details.
- `.github/copilot-instructions.md` - Repository-wide Copilot instructions for coding agents.

## How to Use

### For Learning Patterns
1. Open a topic file (e.g., `Problems/slidingwindow.md`).
2. Read the Concept section to understand the technique.
3. Study the Examples - each problem includes 5 detailed walkthroughs.
4. Review the Pseudocode section explaining the "WHY" of the approach.
5. Compare with the C# Solution for implementation details.

### For Practice
1. Start with easy problems in a category to build confidence.
2. Use `HI-CodList.md` to pick problems by difficulty or frequency.
3. Implement your solution before reading the reference code.
4. Timebox: 20 to 30 minutes per problem initially.
5. After solving, review complexity analysis and alternative approaches.

### For Interview Prep
1. Group problems by category to build pattern recognition (e.g., all sliding window in one session).
2. Focus on high-frequency problems from `HI-CodList.md` (Frequency >= 49.0).
3. Practice harder variants once you nail the basics.
4. Revisit tricky patterns (e.g., sliding window edge cases, DFS vs BFS trade-offs).

## Problem Coverage

Total: 85 Problems

Difficulty Breakdown:
- Easy: ~30
- Medium: ~45
- Hard: ~10

All problems include:
- Concept section - Why use this technique.
- 5 worked examples - Inputs, outputs, step-by-step walkthrough.
- Pseudocode - Clear WHY explanation.
- C# solution - Production-ready, idiomatic code.
- Complexity analysis - Time and space trade-offs.

## Adding New Content

### New Problems
1. Open the relevant topic file (e.g., `Problems/graphs.md`).
2. Add a new `## Problem Title | LeetCode ### | Difficulty` section.
3. Follow the template: Examples -> Pseudocode -> C# Solution -> Complexity.
4. Ensure all 5 examples are distinct and cover edge cases.
5. Update `HI-CodList.md` if adding a new category or problem.

### New Solutions
1. Create `Solutions/[number_or_title].cs` (e.g., `0001.cs` or `TwoSum.cs`).
2. Include brief problem summary in a header comment.
3. Add complexity notes.
4. Use clear, readable code; micro-optimizations are secondary.
5. Test against all 5 examples from the corresponding `Problems/` file.

### New Topic Categories
1. Create `Problems/[topic].md` with the standard template.
2. Include Concept, When to Use, Common Patterns, and Example sections.
3. Link it from this README.
4. Add all related problems with full problem details.

## Study Tips
- Build intuition through patterns: practice 3 to 5 problems per category before moving to a new one.
- Time-box sessions: 45 min (5 problems) or 90 min (10 problems) to maintain focus.
- Revisit hard concepts: come back to sliding window edge cases, graph DFS variants, or DP state transitions weekly.
- Trace through examples: walk through each example step-by-step before coding.
- Compare approaches: after solving, note alternative techniques and trade-offs.
- Mock interviews: once comfortable, solve 3 to 4 problems in 120 minutes to simulate an interview setting.

## Notes
- All code examples are in C# (.NET).
- Problems are sourced from LeetCode with frequency data from interview tracking.
- Solutions emphasize readability and clarity over golfing or premature optimization.
- Each problem includes space for multiple approaches in the pseudocode section.

## Quick Reference
This repository collects study notes and practice solutions for common coding interview topics. Use the structured problem lists in `Problems` alongside the worked examples in `Solutions` to drive focused practice sessions.

Repository layout:
- Problems/ - Topic-focused study guides (two pointers, sliding window, graphs, etc.) plus curated lists such as `HI-CodList.md` and `leetcode_favorites.md` for selecting practice sets.
- Solutions/ - Reference implementations for select LeetCode-style questions (currently in C#). File names mirror problem numbers or titles for quick lookup.
- app/ - Full-stack TypeScript app (React + Vite frontend, Express backend). See `app/README.md` for app-specific details.
- .github/copilot-instructions.md - Repository-wide Copilot instructions for coding agents.
- .gitignore - Keeps temporary scratch files out of version control.

How to use this repo:
1. Pick a topic from `Problems` (for example, `slidingwindow.md`) and skim the patterns and example breakdowns.
2. Choose a problem from the curated lists (e.g., `HI-CodList.md` or `leetcode_categories.md`).
3. Implement your solution in a new file under `Solutions`, following the existing naming approach (problem number or clear title, e.g., `0001.cs` or `ThreeSum.cs`).
4. Add brief problem context and complexity notes as comments at the top of each solution file.

Local development tips:
- The app lives in `app/`. Install dependencies with `npm run install:all --prefix app`.
- Default dev ports are web:5173 and server:3000. For parallel clones, override ports:
  - `PORT=3001 npm run dev --prefix app/server`
  - `npm run dev --prefix app/web -- --port 5174`

App quickstart:
- Web UI lives in `app/web`, server in `app/server`, and shared packages in `app/packages`.
- Build, test, and lint are orchestrated from `app/package.json` (e.g., `npm run build --prefix app`).
- The server serves the built web app from `app/web/dist` in production; APIs live in `app/server/src`.

Adding new content:
- New problems: extend the relevant topic markdown file with succinct explanations, patterns, and examples.
- New solutions: keep implementations self-contained and commented. Prefer idiomatic, readable code over micro-optimizations.
- Organization: if you add another language, create a subfolder inside `Solutions` and mirror the current naming convention for discoverability.

Study tips:
- Practice by category to build intuition for pattern recognition.
- Timebox attempts, then compare with the reference solutions to identify gaps.
- Revisit frequently missed patterns (e.g., sliding window boundaries, stack invariants) by re-reading the corresponding topic notes.
