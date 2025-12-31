---
id: swap_nodes_in_pairs
title: Swap Nodes in Pairs
leetcodeNumber: 24
category: Linked List
difficulty: Medium
source: Problems/LinkedList.md
---

You are generating a JSON file for a problem entry to be stored at:
app/server/data/problems/swap_nodes_in_pairs.json

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
Given a linked list, swap every two adjacent nodes and return the head of the list. Do this without modifying the values in the list nodes (only nodes themselves may be changed). You must solve the problem in-place with O(1) extra space.

Metadata:
- LeetCode: 24
- Category: Linked List
- Difficulty: Medium