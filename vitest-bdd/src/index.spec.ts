import * as canonical from "@epure/vitest";
import * as compatibility from "./index";
import { describe, expect, it } from "vitest";

describe("vitest-bdd compatibility", () => {
  it("forwards the canonical module instance", () => {
    expect(compatibility.Given).toBe(canonical.Given);
    expect(compatibility.epureVitest).toBe(canonical.epureVitest);
  });
});
