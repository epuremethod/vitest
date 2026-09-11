---
name: Given
label: Given(name, handle)
slug: yaml-given
kind: function
since: "1.2"
sort: 20
summary: Bind a YAML given name to a handler receiving the handle and the example data.
signature.ts: "function Given(name: string, build: (handle: Handle, data: Record<string, unknown>) => void | Promise<void>): void"
signature.res: "// YAML fixture steps are a TypeScript API"
tags: []
---

Import `Given` from `@epure/vitest` in the fixture's steps module, just as for
a feature file. Its name matches the scenario's `given`, or
`background.given` when the scenario does not provide one. Its handler receives
the handle first, then every field except `scenario` and `given`. The
handle's `step` can register operations, though YAML fixtures do not execute
them yet; its `test` is the running Vitest test.

Handlers may be asynchronous. Each key can be registered once per test process.

```yaml
feature: YAML calculator
background:
  given: a calculator
examples:
  - scenario: adds two numbers
    given: a calculator
    left: 1
    right: 2
    result: 3
  - scenario: adds negative numbers
    left: -4
    right: 2
    result: -2
```
```typescript
// calculator.test.yaml.ts
import { Given } from "@epure/vitest";
import { expect } from "vitest";

Given("a calculator", ({ test }, { left, right, result }) => {
  expect(Number(left) + Number(right)).toBe(result);
  expect(test.task.name).toBeTypeOf("string");
});
```

This is the same [Given](api.html#given) registration used by Gherkin. Its
arguments occupy the same positions: the handle first, contract data where a
feature places its captures.
