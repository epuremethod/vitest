# @epure/vitest

Gherkin contracts run by Vitest, with typed steps for TypeScript and ReScript.

> `@epure/vitest` is the new name of `vitest-bdd`. Existing APIs remain as
> deprecated aliases, but new code should use the names shown below.

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
    include: ["**/*.feature", "**/*.md", "**/*.spec.ts"],
  },
});
```

`epureVitest` translates feature files and Gherkin code fences in Markdown into
Vitest suites in memory. It does not write generated test files to disk.

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

Given("I have a calculator", ({ When, Then }) => {
  let result = 0;

  When("I add {number} and {number}", (a: number, b: number) => {
    result = a + b;
  });

  Then("the result is {number}", (expected: number) => {
    expect(result).toBe(expected);
  });
});
```

Each `Given` builder creates private scenario state. Its `When`, `Then`, and
other named operations close over that state, so scenarios can run
concurrently without a shared World.

## ReScript

Open the canonical `EpureVitest` module:

```rescript
open EpureVitest

given("I have a calculator", ({step}, _params) => {
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

The former TypeScript names emit deprecation guidance, and the former ReScript
module emits a compiler/editor deprecation warning.

## Development

```sh
pnpm install
pnpm build
pnpm test
pnpm --filter epure-vitest-docs check
```

See [CHANGELOG.md](./CHANGELOG.md) for release history and
[NEXT-STEPS.md](./NEXT-STEPS.md) for the deferred publication checklist.
