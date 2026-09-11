import { expect } from "vitest";
import { Given } from "@epure/vitest";
import { makeCalculator } from "../../feature/calculator";

Given("I have a {string} calculator", ({ step }, name: string) => {
  const calculator = makeCalculator(name);

  step("I add {number} and {number}", calculator.add);
  step("I subtract {number} and {number}", calculator.subtract);
  step("I multiply {number} and {number}", calculator.multiply);
  step("I divide {number} by {number}", calculator.divide);

  step("the result is {number}", (n: number) => {
    expect(calculator.result).toBe(n);
  });
  step("the title is {string}", (s: string) => {
    expect(calculator.title).toBe(s);
  });
});
