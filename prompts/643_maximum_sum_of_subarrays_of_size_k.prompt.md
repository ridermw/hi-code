---
id: maximum_sum_of_subarrays_of_size_k
title: Maximum Sum of Subarrays of Size K
leetcodeNumber: 643
category: Sliding Window
difficulty: Easy
source: Problems/slidingwindow.md
---

You are generating a JSON file for a problem entry to be stored at:
app/server/data/problems/maximum_sum_of_subarrays_of_size_k.json

Return ONLY valid JSON (no markdown, no commentary).

Schema:
{
  "id": "...",
  "title": "...",
  "statement": "...",
  "signature": "...",
  "category": "...",
  "difficulty": "...",
  "sections": {
    "algorithms": [ { "id": "alg-1", "label": "..." }, ... "alg-6" ],
    "implementations": [ { "id": "impl-1", "label": "```csharp\n...\n```" }, ... "impl-6" ],
    "timeComplexities": [ { "id": "time-1", "label": "..." }, ... "time-6" ],
    "spaceComplexities": [ { "id": "space-1", "label": "..." }, ... "space-6" ]
  },
  "answerKey": {
    "algorithms": "alg-1",
    "implementations": "impl-1",
    "timeComplexities": "time-1",
    "spaceComplexities": "space-1"
  }
}

Constraints:
- Provide exactly 6 options in each section.
- The FIRST option in each section is the correct answer.
- The remaining five options should be plausible but incorrect.
- Encourage creativity and near-miss mistakes (do not include another correct answer).
- Implementation labels MUST be markdown code blocks with C# code.
- Keep algorithm/time/space labels as concise sentences.
- If the statement below is incomplete, refine it while staying faithful to the title.
- Infer a reasonable C# method signature if missing.

Problem statement context:
Find the maximum sum of any contiguous subarray of size k in the given array. This is a classic fixed-size sliding window problem where we maintain a window of exactly k elements.

Metadata:
- LeetCode: 643
- Category: Sliding Window
- Difficulty: Easy