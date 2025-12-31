const requiredKeys = [
  "id",
  "title",
  "category",
  "difficulty",
  "signature",
  "statement",
];

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key] = "";
      continue;
    }

    args[key] = value;
    i += 1;
  }

  return args;
}

function printUsage() {
  console.error(
    [
    "Usage: node scripts/generate-problem-prompt.js --id <id> --title <title> --category <category> --difficulty <difficulty> --signature <signature> --statement <statement> [--leetcode <number>]",
      "",
      "Example:",
      "  node scripts/generate-problem-prompt.js --id two_sum --title \"Two Sum\" --category Arrays --difficulty Easy --signature \"int[] TwoSum(int[] nums, int target)\" --statement \"Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\" --leetcode 1",
    ].join("\n")
  );
}

function buildPrompt(values) {
  return [
    "You are generating a JSON file for a problem entry to be stored at:",
    `app/server/data/problems/${values.id}.json`,
    "",
    "Return ONLY valid JSON (no markdown, no commentary).",
    "",
    "Schema:",
    "{",
    '  "id": "...",',
    '  "title": "...",',
    '  "statement": "...",',
    '  "signature": "...",',
    '  "category": "...",',
    '  "difficulty": "...",',
    '  "sections": {',
    '    "algorithms": [ { "id": "alg-1", "label": "..." }, ... "alg-6" ],',
    '    "implementations": [ { "id": "impl-1", "label": "```csharp\\n...\\n```" }, ... "impl-6" ],',
    '    "timeComplexities": [ { "id": "time-1", "label": "..." }, ... "time-6" ],',
    '    "spaceComplexities": [ { "id": "space-1", "label": "..." }, ... "space-6" ]',
    "  },",
    '  "answerKey": {',
    '    "algorithms": "alg-1",',
    '    "implementations": "impl-1",',
    '    "timeComplexities": "time-1",',
    '    "spaceComplexities": "space-1"',
    "  }",
    "}",
    "",
    "Constraints:",
    "- Provide exactly 6 options in each section.",
    "- The FIRST option in each section is the correct answer.",
    "- The remaining five options should be plausible but incorrect.",
    "- Encourage creativity and near-miss mistakes (do not include another correct answer).",
    "- Implementation labels MUST be markdown code blocks with C# code.",
    "- Keep algorithm/time/space labels as concise sentences.",
    "",
    "Problem details:",
    `leetcodeNumber: ${values.leetcode ?? "unknown"}`,
    `id: ${values.id}`,
    `title: ${values.title}`,
    `statement: ${values.statement}`,
    `signature: ${values.signature}`,
    `category: ${values.category}`,
    `difficulty: ${values.difficulty}`,
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }

  const missing = requiredKeys.filter((key) => !args[key]);
  if (missing.length > 0) {
    console.error(`Missing required args: ${missing.join(", ")}`);
    printUsage();
    process.exit(1);
  }

  const prompt = buildPrompt(args);
  console.log(prompt);
}

main();
