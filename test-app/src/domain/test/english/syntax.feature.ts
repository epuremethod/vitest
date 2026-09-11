import { expect } from "vitest";
import { Given } from "@epure/vitest";

Given("I count {number} time(s)", ({ step }, number: number) => {
  step("I count {number} time(s)", (count: number) => {
    expect(count).toBe(number);
  });
});
