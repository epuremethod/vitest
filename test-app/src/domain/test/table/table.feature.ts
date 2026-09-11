import { expect } from "vitest";
import { Given } from "@epure/vitest";
import { makeTable } from "../../feature/table";

Given("I have a table", ({ step }, data) => {
  const table = makeTable(data);
  step("I sort by {string}", table.sort);
  step("the table is", (data: string[][]) => {
    expect([table.headers.map((h) => h.name), ...table.rows]).toEqual(data);
  });
});
