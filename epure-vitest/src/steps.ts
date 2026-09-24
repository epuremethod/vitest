import type { TestContext } from "vitest";
import { normalize, type Step as StepType } from "./parser";

type Operation = (...params: any[]) => void;

type Runner = {
  operation: (query: string) => Operation;
};

type Operations = Record<string, Operation>;
type Build = (handle: Handle, ...params: any[]) => void | Promise<void>;
type Builder = (params: any[], testContext: TestContext) => Promise<Runner>;
/** Register a scenario operation such as a `When` or `Then` step. */
export type Step = (key: string, op: Operation) => void;
/** What a `Given` builder receives: the step register and the running test. */
export type Handle = {
  step: Step;
  test: TestContext;
};

const builders: Record<string, Builder> = {};

/**
 * Register a feature builder or YAML handler for a scenario's `Given`.
 *
 * Operations registered by the builder close over private scenario state.
 * YAML places scenario data where a feature places captured parameters.
 */
export function Given(key: string, build: Build) {
  const builder = async (params: any[], testContext: TestContext) => {
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
    const handle: Handle = {
      step: (key: string, op: Operation) => {
        for (const query of normalize(key)) {
          ops[query] = op;
        }
      },
      test: testContext,
    };
    await build(handle, ...params);
    return runner;
  };
  for (const query of normalize(key)) {
    builders[query] = builder;
  }
}

/** @internal Used by translated feature suites. */
export function load(given: StepType, testContext: TestContext): Promise<Runner> {
  const builder = builders[given.query];
  if (!builder) {
    throw new Error(`Missing loader for "${given.text}"`);
  }
  return builder(given.params, testContext);
}

/** @internal Used by generated YAML suites. */
export async function loadYaml(key: string, data: Record<string, unknown>, testContext: TestContext): Promise<void> {
  const builder = builders[key];
  if (!builder) {
    throw new Error(`Missing Given for ${JSON.stringify(key)}`);
  }
  await builder([data], testContext);
}
