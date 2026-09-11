import { Given } from "@epure/vitest";
import { expect } from "vitest";

Given("a calculator", ({ test }, { left, right, result }) => {
  expect(Number(left) + Number(right)).toBe(result);
  expect(test.task.name).toBeTypeOf("string");
});
