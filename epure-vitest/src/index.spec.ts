import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { epureVitest, stepsResolver, vitestBdd } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("epureVitest", () => {
  it("uses the canonical plugin name", () => {
    expect(epureVitest().name).toBe("@epure/vitest");
  });

  it("warns once when the deprecated factory is used", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    vitestBdd();
    vitestBdd();

    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith("vitestBdd is deprecated. Use epureVitest instead.");
  });

  it("generates imports from the canonical runtime", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "epure-vitest-"));
    try {
      const feature = path.join(dir, "calculator.feature");
      await writeFile(
        feature,
        ["Feature: Calculator", "", "Scenario: Add", "  Given a calculator", "  Then it works"].join("\n"),
      );
      await writeFile(`${feature}.ts`, "");

      const plugin = epureVitest();
      const load = plugin.load;
      if (typeof load !== "function") throw new Error("Expected a Vite load hook");
      const result = await load.call({} as never, feature);
      if (!result || typeof result === "string") throw new Error("Expected compiled code");

      expect(result.code).toContain('from "@epure/vitest/runtime"');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("stepsResolver", () => {
  it("finds a shared steps file in the feature directory", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "epure-vitest-"));
    try {
      const feature = path.join(dir, "calculator.feature");
      const steps = path.join(dir, "steps.ts");
      await writeFile(feature, "Feature: Calculator");
      await writeFile(steps, "");

      expect(stepsResolver(feature)).toBe(steps);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
