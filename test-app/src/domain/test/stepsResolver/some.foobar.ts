import { signal } from "tilia";
import { expect } from "vitest";
import { Given } from "@epure/vitest";

Given("I have a {string} step", ({ step }, str: string) => {
  const [title, setName] = signal(str);
  step("I run it", () => {
    setName(`${title.value}-steps`);
  });
  step("it compiles using {string}", (str: string) => {
    console.log(title.value, JSON.stringify([str, title.value]));
    expect(title.value).toBe(str);
  });
});
