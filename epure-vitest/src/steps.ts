import type { TestContext } from "vitest";
import { normalize, type Step as StepType } from "./parser";

type Operation = (...params: any[]) => void;

type Runner = {
  operation: (query: string) => Operation;
};

type Operations = Record<string, Operation>;
/** Register a scenario operation such as `When` or `Then`. */
export type Step = (key: string, op: Operation) => void;
/** Named scenario operations supplied to a `Given` builder. */
export type Context = Record<string, Step>;

const builders: Record<string, (given: StepType, testContext: TestContext) => Promise<Runner>> = {};

/**
 * Register the builder for a scenario's initial `Given` step.
 *
 * Operations registered by the builder close over its private scenario state.
 */
export function Given(key: string, build: (...params: any[]) => void | Promise<void>) {
  const op = async (given: StepType, testContext: TestContext) => {
    const ops: Operations = {};
    const runner = {
      operation: (query: string) => {
        const operation = ops[query];
        if (!operation) {
          throw new Error(`Step "${query}" not found`);
        }
        return operation;
      },
    };
    const ctx: Context = new Proxy(
      {},
      {
        get: () => (key: string, op: Operation) => {
          for (const query of normalize(key)) {
            ops[query] = op;
          }
        },
      },
    );
    await build(ctx, ...[...given.params, testContext]);
    return runner;
  };
  for (const query of normalize(key)) {
    builders[query] = op;
  }
}

/** @internal Used by translated suites through `@epure/vitest/runtime`. */
export function load(given: StepType, testContext: TestContext): Promise<Runner> {
  const build = builders[given.query];
  if (!build) {
    throw new Error(`Missing loader for "${given.text}"`);
  }
  return build(given, testContext);
}
