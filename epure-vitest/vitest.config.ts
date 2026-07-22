import { defineConfig } from "vitest/config";
import { epureVitest } from "./src/index";

export default defineConfig({
  plugins: [epureVitest()],
  test: {
    include: ["src/*.spec.ts", "test/**/*_test.res"],
  },
});
