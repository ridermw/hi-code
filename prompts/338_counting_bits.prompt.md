---
id: counting_bits
title: Counting Bits
leetcodeNumber: 338
category: Dynamic Programming
difficulty: Easy
source: Problems/dynamic_programming.md
---

You are generating a JSON file for a problem entry to be stored at:
app/server/data/problems/counting_bits.json

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
- Algorithm labels should read like pseudocode step lists (multiline is OK).
  Example (correct algorithm):
  Initialize left = 0, maxLength = 0, charMap (HashSet)
  For right from 0 to string length - 1:
      // Expand window by adding right character
      While character at right exists in charMap:
          Remove character at left from charMap  // Shrink window
          Increment left pointer
      Add character at right to charMap
      Update maxLength = max(maxLength, right - left + 1)
- Implementation labels MUST be markdown code blocks with C# code.
- Keep algorithm/time/space labels as concise sentences.
- If the statement below is incomplete, refine it while staying faithful to the title.
- Infer a reasonable C# method signature if missing.

Problem statement context:
Provide a concise problem statement based on the title.

Metadata:
- LeetCode: 338
- Category: Dynamic Programming
- Difficulty: Easy