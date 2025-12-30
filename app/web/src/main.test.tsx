import { describe, expect, it, vi } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
  default: { createRoot: createRootMock },
  createRoot: createRootMock,
}));

describe("main entry", () => {
  it("renders the app when a root element exists", async () => {
    document.body.innerHTML = "<div id=\"root\"></div>";
    vi.resetModules();

    await import("./main");

    expect(createRootMock).toHaveBeenCalled();
    expect(renderMock).toHaveBeenCalled();
  });

  it("throws when the root element is missing", async () => {
    document.body.innerHTML = "";
    vi.resetModules();

    await expect(import("./main")).rejects.toThrow("Root element not found");
  });
});
