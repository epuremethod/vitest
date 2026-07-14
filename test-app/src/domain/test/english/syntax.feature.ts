import { expect } from "vitest";
import { Given } from "vitest-bdd";

Given("I count {number} time(s)", ({ Then }, number: number) => {
  Then("I count {number} time(s)", (count: number) => {
    expect(count).toBe(number);
  });
});