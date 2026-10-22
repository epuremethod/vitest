# @epure/vitest

Gherkin contracts and structured YAML fixtures run by Vitest, with typed steps
for TypeScript and ReScript.

> `@epure/vitest` is the new name of `vitest-bdd`. See
> [Migration from vitest-bdd](#migration-from-vitest-bdd).

- [Guide](https://epurejs.dev/guide.html)
- [API reference](https://epurejs.dev/api.html)
- [npm](https://www.npmjs.com/package/@epure/vitest)
- [épure method](https://epuremethod.com)

## Install

```sh
pnpm add --save-dev @epure/vitest vitest
```

## Configure Vitest

```ts
// vitest.config.ts
import { epureVitest } from "@epure/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [epureVitest()],
  test: {
    include: ["**/*.feature", "**/*.md", "**/*.test.yaml", "**/*.spec.ts"],
  },
});
```

`epureVitest` translates feature files, Gherkin code fences in Markdown, and
structured YAML fixtures into Vitest suites in memory. It does not write
generated test files to disk.

## YAML fixtures

Include `.yaml` files in Vitest when scenarios are structured examples rather
than prose. `epureVitest` compiles every `.yaml` file Vitest loads; the
`test.include` glob controls which fixtures are tests.

```yaml
feature: Calculator
examples:
  - scenario: adds two numbers
    given: a calculator
    left: 1
    right: 2
    result: 3
```

Register each `given` in `calculator.test.yaml.ts`, `calculator.test.steps.ts`,
or a shared `steps.ts` beside the fixture:

```ts
import { Given } from "@epure/vitest";
import { expect } from "vitest";

Given("a calculator", ({ test }, { left, right, result }) => {
  expect(Number(left) + Number(right)).toBe(result);
  expect(test.task.name).toBeTypeOf("string");
});
```

Each example becomes a source-mapped Vitest test. A scenario's `given`
overrides `background.given`; one of them is required. The remaining fields
occupy the parameter position in the same `Given` API used by features:
the handle first, scenario data second. The handle carries `step`, which
registers a scenario operation, and `test`, the running Vitest test.

## Write a contract

```gherkin
# calculator.feature
Feature: Calculator

  Scenario: Add two numbers
    Given I have a calculator
    When I add 1 and 2
    Then the result is 3
```

Place its steps beside it:

```ts
// calculator.feature.ts
import { Given } from "@epure/vitest";
import { expect } from "vitest";

Given("I have a calculator", ({ step }) => {
  let result = 0;

  step("I add {number} and {number}", (a: number, b: number) => {
    result = a + b;
  });

  step("the result is {number}", (expected: number) => {
    expect(result).toBe(expected);
  });
});
```

Each `Given` builder creates private scenario state. The operations it
registers through `step` close over that state, so scenarios can run
concurrently without a shared World. The feature file keeps its own words —
`When`, `Then`, `Alors` — while the code has one: `step`. The handle's
`test` is the running Vitest test, for `test.onTestFinished` teardown.

## ReScript

Open the canonical `EpureVitest` module:

```rescript
open EpureVitest

given("I have a calculator", ({step}) => {
  let result = ref(0)

  step("I add {number} and {number}", (a, b) => {
    result.contents = a + b
  })

  step("the result is {number}", expected => {
    expect(result.contents).toBe(expected)
  })
})
```

The package also provides typed Vitest suites, hooks, modes, and assertions.
See the [ReScript guide](https://epurejs.dev/guide.html#vitest-in-rescript).

## Migration from vitest-bdd

| Former name | Canonical name |
| --- | --- |
| package `vitest-bdd` | package `@epure/vitest` |
| `vitestBdd()` | `epureVitest()` |
| `VitestBddOptions` | `EpureVitestOptions` |
| ReScript module `VitestBdd` | ReScript module `EpureVitest` |

The former names were deprecated aliases in 1.1.0 and are removed in 2.0.0.

## Development

```sh
pnpm install
pnpm build
pnpm test
pnpm --filter epure-vitest-docs check
```

## Changelog

- Unreleased **2.0.1**
  - Fix: a YAML `given` is matched the same way as a feature step. It was looked up by its raw text, so a `Given` registered with a capital letter, `an` or `the` in its name threw `Missing Given`.
- 2026-09-24 **2.0.0**
  - Breaking: the `Given` builder receives a plain handle `{ step, test }` in both TypeScript and ReScript. `step` registers every scenario operation — the keywords (`When`, `Then`, `Alors`, …) belong to the feature file, not the code — and `test` is the running Vitest `TestContext`, so teardown is `test.onTestFinished`. The any-name proxy and the trailing `TestContext` argument are gone; the exported type is `Handle` (previously `Context`).
  - Breaking: in ReScript, `given` binds a pattern with no captures; `given1` and `given2` bind one and two. `given` no longer types the test context into the capture slot.
  - Breaking: remove the deprecated `vitest-bdd` names: `vitestBdd`, `VitestBddOptions` and the ReScript `VitestBdd` module. Use `epureVitest`, `EpureVitestOptions` and `EpureVitest`.
  - Breaking: `vitest-bdd` stays at 1.1.0 and is not published for 2.0.0. Install `@epure/vitest` to upgrade.
  - A ReScript `given`, `given1` or `given2` builder can be `async`. The binding typed the builder's answer as `unit`, so an `async` builder's `promise<unit>` was rejected, though the runner has always awaited it.
- 2026-09-24 **1.1.0**
  - Rename from `vitest-bdd` to `@epure/vitest`. `vitest-bdd` 1.1.0 re-exports `@epure/vitest`, so existing code keeps working.
  - Rename plugin API to `epureVitest` and `EpureVitestOptions`.
  - Rename ReScript module to `EpureVitest`.
  - Keep deprecated TypeScript and ReScript aliases for migration.
  - Move the repository to [epuremethod/vitest](https://github.com/epuremethod/vitest).
  - Add the [epurejs.dev](https://epurejs.dev) documentation build.
  - Add plural support: `I tap 10 times` matches `I tap {number} time(s)`.
  - Add YAML scenarios: `.yaml` files are translated into source-mapped suites, and `Given` registers their scenario and background handlers with Vitest's test context.
  - Map a ReScript test whose name `rescript format` moved to the line after `it(`; such tests printed `No source mapping` and reported failures against the wrong line.
  - Keep the package without an `exports` map, as since 0.6.1, so ReScript projects that compile out of source still resolve its modules.
- 2026-04-29 **1.0.1**
  - Fix a rare `resolveId` bug when loaded from CommonJS.
- 2026-04-05 **1.0.0**
  - Upgrade tests to ReScript 12.
  - Release the first stable version.
- 2025-12-18 **0.6.2**
  - Add default `tsx` and `jsx` step-file discovery.
- 2025-12-18 **0.6.1**
  - Remove package exports to support ReScript projects with different suffix settings.
- 2025-09-01 **0.6.0**
  - Add `toRecords`, `toNumbers`, and `toStrings`.
  - Add concurrent scenarios, enabled by default.
  - Add the Vitest test context to `Given` builders.
  - Add complete ReScript bindings for Vitest assertions.
  - Keep Vitest external to the bundle to preserve concurrency and test context.
- 2025-08-28 **0.5.1**
  - Remove accidental array-step support.
- 2025-08-27 **0.5.0**
  - Add array-step support.
- 2025-08-17 **0.4.0**
  - Add ReScript unit tests with source maps.
- 2025-07-26 **0.3.0**
  - Add configurable Markdown extensions and `.mdx` support.
- 2025-07-23 **0.2.0**
  - Add Gherkin code blocks in Markdown.
  - Add basic ReScript step definitions.
- 2025-07-04 **0.1.0**
  - Add async and concurrent scenarios.
  - Fix negative and scientific number parsing.
  - Add the initial Vite plugin.
