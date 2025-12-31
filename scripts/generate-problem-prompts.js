const fs = require("fs/promises");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const problemsDir = path.join(repoRoot, "Problems");
const outputDir = path.join(repoRoot, "prompts");

const pipePattern =
  /^##\s*(?:\d+\.\s*)?(.*?)\s*\|\s*LeetCode\s*(\d+)\s*\|\s*(Easy|Medium|Hard)\s*$/i;
const parenPattern =
  /^##\s*(?:\d+\.\s*)?\[(Easy|Medium|Hard)\]\s+(.*?)\s*\(LeetCode\s*#?(\d+)\)\s*$/i;

function toTitleCase(value) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function extractDescription(blockLines) {
  const startIndex = blockLines.findIndex((line) =>
    /^###\s*Description/i.test(line.trim())
  );

  if (startIndex === -1) {
    return "";
  }

  const descriptionLines = [];
  const firstLine = blockLines[startIndex].trim();
  const inline = firstLine.replace(/^###\s*Description:?\s*/i, "").trim();
  if (inline) {
    descriptionLines.push(inline);
  }

  for (let i = startIndex + 1; i < blockLines.length; i += 1) {
    const line = blockLines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      break;
    }
    if (trimmed) {
      descriptionLines.push(trimmed);
    }
  }

  return descriptionLines.join(" ").replace(/\s+/g, " ").trim();
}

function extractCategory(markdown, fallback) {
  const lines = markdown.split(/\r?\n/);
  const heading = lines.find((line) => line.trim().startsWith("# "));
  if (!heading) {
    return fallback;
  }

  return heading
    .replace(/^#\s+/, "")
    .replace(/\s+Problems?$/i, "")
    .trim();
}

function parseProblems(markdown, filePath) {
  const lines = markdown.split(/\r?\n/);
  const results = [];
  const fallbackCategory = toTitleCase(
    path.basename(filePath, path.extname(filePath))
  );
  const category = extractCategory(markdown, fallbackCategory);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line.startsWith("## ")) {
      continue;
    }

    let title = "";
    let difficulty = "";
    let leetcodeNumber = "";

    const pipeMatch = line.match(pipePattern);
    const parenMatch = line.match(parenPattern);

    if (pipeMatch) {
      title = pipeMatch[1].trim();
      leetcodeNumber = pipeMatch[2].trim();
      difficulty = pipeMatch[3].trim();
    } else if (parenMatch) {
      difficulty = parenMatch[1].trim();
      title = parenMatch[2].trim();
      leetcodeNumber = parenMatch[3].trim();
    } else {
      continue;
    }

    let nextIndex = lines.length;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j].trim().startsWith("## ")) {
        nextIndex = j;
        break;
      }
    }

    const blockLines = lines.slice(i + 1, nextIndex);
    const statement = extractDescription(blockLines);

    results.push({
      id: slugify(title),
      title,
      leetcodeNumber,
      difficulty,
      category,
      statement,
      source: `Problems/${path.basename(filePath)}`,
    });
  }

  return results;
}

function buildPrompt(problem) {
  const statementLine = problem.statement
    ? problem.statement
    : "Provide a concise problem statement based on the title.";

  return [
    "---",
    `id: ${problem.id}`,
    `title: ${problem.title}`,
    `leetcodeNumber: ${problem.leetcodeNumber}`,
    `category: ${problem.category}`,
    `difficulty: ${problem.difficulty}`,
    `source: ${problem.source}`,
    "---",
    "",
    "You are generating a JSON file for a problem entry to be stored at:",
    `app/server/data/problems/${problem.id}.json`,
    "",
    "Return ONLY valid JSON (no markdown, no commentary).",
    "",
    "Schema:",
    "{",
    '  \"id\": \"...\",',
    '  \"title\": \"...\",',
    '  \"statement\": \"...\",',
    '  \"signature\": \"...\",',
    '  \"category\": \"...\",',
    '  \"difficulty\": \"...\",',
    '  \"sections\": {',
    '    \"algorithms\": [ { \"id\": \"alg-1\", \"label\": \"...\" }, ... \"alg-6\" ],',
    '    \"implementations\": [ { \"id\": \"impl-1\", \"label\": \"```csharp\\n...\\n```\" }, ... \"impl-6\" ],',
    '    \"timeComplexities\": [ { \"id\": \"time-1\", \"label\": \"...\" }, ... \"time-6\" ],',
    '    \"spaceComplexities\": [ { \"id\": \"space-1\", \"label\": \"...\" }, ... \"space-6\" ]',
    "  },",
    '  \"answerKey\": {',
    '    \"algorithms\": \"alg-1\",',
    '    \"implementations\": \"impl-1\",',
    '    \"timeComplexities\": \"time-1\",',
    '    \"spaceComplexities\": \"space-1\"',
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
    "- If the statement below is incomplete, refine it while staying faithful to the title.",
    "- Infer a reasonable C# method signature if missing.",
    "",
    "Problem statement context:",
    statementLine,
    "",
    "Metadata:",
    `- LeetCode: ${problem.leetcodeNumber}`,
    `- Category: ${problem.category}`,
    `- Difficulty: ${problem.difficulty}`,
  ].join("\n");
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(problemsDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(problemsDir, entry.name));

  const prompts = [];

  for (const filePath of markdownFiles) {
    const markdown = await fs.readFile(filePath, "utf-8");
    prompts.push(...parseProblems(markdown, filePath));
  }

  const writes = prompts.map(async (problem) => {
    const promptText = buildPrompt(problem);
    const fileName = `${problem.leetcodeNumber}_${problem.id}.prompt.md`;
    const outputPath = path.join(outputDir, fileName);
    await fs.writeFile(outputPath, promptText, "utf-8");
  });

  await Promise.all(writes);
  console.log(`Generated ${prompts.length} prompts in ${outputDir}`);
}

main().catch((error) => {
  console.error("Failed to generate prompts:", error);
  process.exitCode = 1;
});
