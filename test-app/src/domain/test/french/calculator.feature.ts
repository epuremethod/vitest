import { expect } from "vitest";
import { Given as Soit } from "@epure/vitest";
import { makeCalculator } from "../../feature/calculator";

Soit("une calculatrice", ({ step }) => {
  const calculator = makeCalculator("basic");
  step("j'ajoute {number} et {number}", calculator.add);
  step("je soustrais {number} à {number}", (a: number, b: number) => calculator.subtract(b, a));

  step("le résultat doit être {number}", (expected: string) => {
    expect(calculator.result).toBe(expected);
  });
});
