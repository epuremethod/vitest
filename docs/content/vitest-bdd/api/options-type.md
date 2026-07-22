---
name: VitestBddOptions
slug: options-type
kind: type
module: core
since: "0.1"
sort: 200
summary: Configuration accepted by the vitestBdd plugin.
signature:
  ts: "type VitestBddOptions = { debug?; concurrent?; markdownExtensions?; gherkinExtensions?; stepsResolver? }"
  res: "// plugin options are written in vitest.config.ts (TypeScript)"
tags: []
---

All fields are optional; the defaults are the convention this documentation assumes.

- `concurrent` (default `true`) — run scenarios concurrently. Safe because each scenario builds its own context; disable only for suites that share external state.
- `gherkinExtensions` (default `[".feature"]`) — files parsed as pure Gherkin.
- `markdownExtensions` (default `[".md", ".mdx", ".markdown"]`) — files scanned for `gherkin` code fences; see guide chapter [Contracts in the prose](guide.html#contracts-in-the-prose).
- `stepsResolver` (default [stepsResolver](api.html#steps-resolver)) — how a feature file finds its steps.
- `debug` (default `false`) — log the generated suite during compilation.

```typescript
import { defineConfig } from "vitest/config";
import { vitestBdd } from "vitest-bdd";

export default defineConfig({
  plugins: [vitestBdd({ markdownExtensions: [".mdx"], concurrent: true })],
  test: { include: ["**/*.feature", "**/*.mdx"] },
});
```
