import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      lines: 75,
      statements: 75,
      functions: 75,
      branches: 75,
    },
  },
});
