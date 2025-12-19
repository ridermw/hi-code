import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import "whatwg-fetch";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
