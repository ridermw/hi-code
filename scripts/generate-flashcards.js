const fs = require("fs/promises");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const problemsDir = path.join(repoRoot, "Problems");
const outputDir = path.join(repoRoot, "app", "server", "data", "flashcards");

function extractSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const target = `### ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === target);

  if (startIndex === -1) {
    return "";
  }

  const sectionLines = [];

  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      break;
    }

    sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

function cleanMarkdown(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/→/g, "->")
    .replace(/²/g, "^2")
    .replace(/\s+/g, " ")
    .trim();
}

function extractListItems(section) {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || line.match(/^\d+\./))
    .map((line) => line.replace(/^[-\d.]+\s+/, "").trim())
    .map(cleanMarkdown);
}

function extractPatternDefinitions(section) {
  const lines = section.split(/\r?\n/);
  const patterns = [];

  for (const line of lines) {
    const match = line.trim().match(/^\d+\.\s+\*\*(.+?)\*\*\s+-\s+(.*)$/);
    if (match) {
      patterns.push({ term: match[1].trim(), description: cleanMarkdown(match[2]) });
    }
  }

  return patterns;
}

function extractCodeBlock(section) {
  const match = section.match(/```([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}

function parsePatternSteps(codeBlock) {
  const lines = codeBlock.split(/\r?\n/);
  const steps = {};
  let current = null;

  for (const line of lines) {
    const headerMatch = line.trim().match(/^\d+\.\s+(.+?):$/);

    if (headerMatch) {
      current = headerMatch[1].trim();
      steps[current] = [];
      continue;
    }

    if (current && line.trim()) {
      steps[current].push(line.trim());
    }
  }

  return steps;
}

function findPatternSteps(stepMap, term) {
  const entry = Object.entries(stepMap).find(([key]) =>
    key.toLowerCase().startsWith(term.toLowerCase())
  );

  return entry ? entry[1] : [];
}

function extractExampleLines(section) {
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const examples = [];

  for (const line of lines) {
    if (line.startsWith("**Problem:**")) {
      examples.push(cleanMarkdown(line.replace("**Problem:**", "")));
    }
    if (line.startsWith("**Why Two Pointers?**")) {
      examples.push(cleanMarkdown(line.replace("**Why Two Pointers?**", "")));
    }
    if (line.startsWith("**Without Two Pointers:**")) {
      examples.push(cleanMarkdown(line.replace("**Without Two Pointers:**", "")));
    }
    if (line.startsWith("**With Two Pointers:**")) {
      examples.push(cleanMarkdown(line.replace("**With Two Pointers:**", "")));
    }
  }

  return examples;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const CATEGORY_CONFIGS = [
  {
    id: "two_pointers",
    name: "Two Pointers",
    description: "Core pointer patterns for arrays and linked lists.",
    markdownFile: "twopointers.md",
  },
];

async function generateFlashcardsFromMarkdown(config) {
  const markdownPath = path.join(problemsDir, config.markdownFile);
  const markdown = await fs.readFile(markdownPath, "utf-8");

  const definitionSection = extractSection(markdown, "What is Two Pointers?");
  const typesSection = extractSection(markdown, "Types of Two Pointer Patterns:");
  const whenSection = extractSection(markdown, "When to Use Two Pointers?");
  const genericPatternsSection = extractSection(markdown, "Generic Patterns:");
  const exampleSection = extractSection(markdown, "Example:");

  const definition = cleanMarkdown(definitionSection.split(/\n\n/)[0] ?? definitionSection);
  const whenToUse = extractListItems(whenSection);
  const patternDefinitions = extractPatternDefinitions(typesSection);
  const genericPatternSteps = parsePatternSteps(extractCodeBlock(genericPatternsSection));
  const simpleExamples = extractExampleLines(exampleSection);

  const categoryId = config.id;
  const category = {
    id: categoryId,
    name: config.name,
    description: config.description,
  };

  const cards = [
    {
      id: "two-pointers-core",
      category: categoryId,
      term: "Two Pointers",
      definition,
      whenToUse,
      genericPatterns: patternDefinitions.map(
        (pattern) => `${pattern.term}: ${pattern.description}`
      ),
      simpleExamples,
      algorithmPrompt:
        "You have a sorted array and need to decide if any two values sum to a target. Which two-pointer pattern applies?",
      difficultyStarred: false,
    },
  ];

  for (const pattern of patternDefinitions) {
    const steps = findPatternSteps(genericPatternSteps, pattern.term);

    cards.push({
      id: `two-pointers-${slugify(pattern.term)}`,
      category: categoryId,
      term: pattern.term,
      definition: pattern.description,
      whenToUse,
      genericPatterns: steps.length ? steps : [pattern.description],
      simpleExamples: simpleExamples.length
        ? simpleExamples
        : ["Sorted array: move pointers based on comparison."],
      difficultyStarred: false,
    });
  }

  const payload = {
    category,
    cards,
  };

  const outputPath = path.join(outputDir, `${categoryId}.json`);
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf-8");

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    path: `flashcards/${categoryId}.json`,
    cardCount: cards.length,
  };
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = [];

  for (const config of CATEGORY_CONFIGS) {
    const entry = await generateFlashcardsFromMarkdown(config);
    entries.push(entry);
  }

  const indexPayload = {
    categories: entries,
  };

  const indexPath = path.join(outputDir, "index.json");
  await fs.writeFile(indexPath, JSON.stringify(indexPayload, null, 2), "utf-8");
}

run().catch((error) => {
  console.error("Failed to generate flashcards:", error);
  process.exitCode = 1;
});
