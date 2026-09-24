# Changelog

## 2.0.0 — 2026-09-24

1.1.0 was only published as betas; its changes ship here.

### Breaking

- Renamed the package from `vitest-bdd` to `@epure/vitest`. The `vitest-bdd`
  package now re-exports `@epure/vitest`, so the changes below reach it too.
- The `Given` builder now receives a plain handle `{ step, test }` in both
  TypeScript and ReScript. `step` registers every scenario operation — the
  keywords (`When`, `Then`, `Alors`, …) belong to the feature file, not the
  code — and `test` is the running Vitest `TestContext`, so teardown is
  `test.onTestFinished`. The any-name proxy and the trailing `TestContext`
  argument are gone; the exported type is `Handle` (previously `Context`).
- In ReScript, `given` now binds a pattern with no captures; `given1` and
  `given2` bind one and two. `given` no longer types the test context into
  the capture slot.

### Added

- YAML scenarios: `.yaml` files are translated into source-mapped suites, and
  `Given` registers their scenario and background handlers with Vitest's test
  context. Vitest's `test.include` controls which YAML files are tests.
- Support for plural idioms: `I tap 10 times` matches `I tap {number} time(s)`.
- A ReScript `given`, `given1` or `given2` builder can be `async`. The binding
  typed the builder's answer as `unit`, so an `async` builder's
  `promise<unit>` was rejected, though the runner has always awaited it.
- The [epurejs.dev](https://epurejs.dev) documentation build.

### Changed

- Renamed the canonical plugin API to `epureVitest` and `EpureVitestOptions`,
  and the canonical ReScript module to `EpureVitest`. The old TypeScript and
  ReScript names remain as deprecated aliases.
- Moved the repository to
  [epuremethod/vitest](https://github.com/epuremethod/vitest).

### Fixed

- Removed the package `exports` map again (it was reintroduced during the
  rename, after 0.6.1 had removed it). It broke ReScript projects that
  compile out of source with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Mapped a ReScript test whose name `rescript format` moved to the line after
  `it(`; such tests printed `No source mapping` and reported failures against
  the wrong line.

## 1.0.1 — 2026-04-29

- Fixed a rare `resolveId` bug when loaded from CommonJS.

## 1.0.0 — 2026-04-05

- Upgraded tests to ReScript 12.
- Released the first stable version.

## 0.6.2 — 2025-12-18

- Added default `tsx` and `jsx` step-file discovery.

## 0.6.1 — 2025-12-18

- Removed package exports to support ReScript projects with different suffix
  settings.

## 0.6.0 — 2025-09-01

- Added `toRecords`, `toNumbers`, and `toStrings`.
- Added concurrent scenarios, enabled by default.
- Added the Vitest test context to `Given` builders.
- Added complete ReScript bindings for Vitest assertions.
- Kept Vitest external to the bundle to preserve concurrency and test context.

## 0.5.1 — 2025-08-28

- Removed accidental array-step support.

## 0.5.0 — 2025-08-27

- Added array-step support.

## 0.4.0 — 2025-08-17

- Added ReScript unit tests with source maps.

## 0.3.0 — 2025-07-26

- Added configurable Markdown extensions and `.mdx` support.

## 0.2.0 — 2025-07-23

- Added Gherkin code blocks in Markdown.
- Added basic ReScript step definitions.

## 0.1.0 — 2025-07-04

- Added async and concurrent scenarios.
- Fixed negative and scientific number parsing.
- Added the initial Vite plugin.
