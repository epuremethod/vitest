import { expect } from "vitest";
import { Given } from "@epure/vitest";

Given("I count {number} time(s)", ({ Then }, number: number) => {
  Then("I count {number} time(s)", (count: number) => {
    expect(count).toBe(number);
  });
});
