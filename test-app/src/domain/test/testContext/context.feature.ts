import { expect } from "vitest";
import { Given } from "@epure/vitest";

Given("I have a test using vitest context", ({ step, test }) => {
  step("test task name should be {string}", (name: string) => {
    expect(test.task.name).toBe(name);
  });
});
