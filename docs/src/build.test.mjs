import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { crossValidate, findConfigs, loadConfig } from "./build.mjs";
import { renderDocsPage } from "./templates.mjs";

function entry(file, module, name, slug) {
  return { file, module, name, slug };
}

test("allows duplicate names across modules", () => {
  const errors = [];
  const entries = [
    entry("make.md", "core", "make", "make"),
    entry("react-make.md", "react", "make", "react-make"),
  ];

  crossValidate(entries, [], errors);

  assert.equal(errors.length, 0);
});

test("reports duplicate names in same module", () => {
  const errors = [];
  const entries = [
    entry("make.md", "core", "make", "make"),
    entry("make-2.md", "core", "make", "make-2"),
  ];

  crossValidate(entries, [], errors);

  assert.deepEqual(errors, ['content/api/make-2.md: duplicate name "make" in module "core"']);
});

test("loads epure Vitest config from content folder", async () => {
  const config = await loadConfig();

  assert.equal(config.var.project, "epurejs");
  assert.equal(config.pages.api.input.markdownDir, path.resolve(process.cwd(), "content/epurejs/api"));
  assert.equal(config.pages.guide.input.markdownDir, path.resolve(process.cwd(), "content/epurejs/guide"));
  assert.equal(config.pages.api.output, path.resolve(process.cwd(), "../dist/api.html"));
  assert.equal(
    config.pages.api.assets.copy.some(
      ({ from, to }) =>
        from === path.resolve(process.cwd(), "../epure-vitest/llms.txt") &&
        to === path.resolve(process.cwd(), "../dist/llms.txt"),
    ),
    true,
  );
});

test("rejects invalid config format", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "tilia-config-"));
  try {
    const file = path.join(dir, "config.yaml");
    await writeFile(file, "pages: {}\n");
    await assert.rejects(loadConfig(file), /var|shared|literals/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("resolves variables before paths", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "tilia-config-"));
  try {
    const file = path.join(dir, "config.yaml");
    const base = path.join(dir, "base.yaml");
    const assets = path.join(dir, "assets");
    const dist = path.join(dir, "dist");
    const shared = path.join(dir, "shared");
    await writeFile(
      base,
      [
        `base: "${path.resolve(process.cwd(), "content/base-config.yaml")}"`,
        "var:",
        `  shared: "${shared}"`,
      ].join("\n"),
    );
    await writeFile(
      file,
      [
        `base: "${base}"`,
        "var:",
        "  project: example",
        `  assets: "${assets}"`,
        `  dist: "${dist}"`,
        "pages:",
        "  api:",
        "    output: '{{dist}}/api.html'",
        "    assets:",
        "      copy:",
        "        - from: '{{assets}}/style.css'",
        "          to: '{{dist}}/style.css'",
        "        - from: '{{shared}}/fonts'",
        "          to: '{{dist}}/fonts'",
        "          recursive: true",
      ].join("\n"),
    );

    const config = await loadConfig(file);
    assert.equal(config.pages.api.assets.copy[0].from, path.join(assets, "style.css"));
    assert.equal(config.pages.api.assets.copy[0].to, path.join(dist, "style.css"));
    assert.equal(config.pages.api.assets.copy[1].from, path.join(shared, "fonts"));
    assert.equal(config.pages.api.output, path.join(dist, "api.html"));
    assert.equal(config.pages.guide.output, path.resolve(process.cwd(), "../dist/example/guide.html"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("deep merges literals over base", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "epure-vitest-config-"));
  try {
    const base = path.resolve(process.cwd(), "content/epurejs/config.yaml");
    const file = path.join(dir, "config.yaml");
    await writeFile(
      file,
      [
        `base: "${base}"`,
        "var:",
        "  project: example",
        "shared:",
        "  literals:",
        "    moduleLabelCore: Contracts",
      ].join("\n")
    );

    const config = await loadConfig(file);
    assert.equal(config.shared.literals.moduleLabelCore, "Contracts");
    assert.equal(config.shared.literals.moduleLabelReact, "Vitest");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("finds all project configs in content", async () => {
  const files = await findConfigs();
  const rel = files.map((file) => path.relative(process.cwd(), file));
  assert.deepEqual(rel, ["content/epurejs/config.yaml"]);
});

test("resolves child file paths before merge", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "epure-vitest-config-"));
  try {
    const base = path.resolve(process.cwd(), "content/epurejs/config.yaml");
    const file = path.join(dir, "config.yaml");
    await writeFile(
      file,
      [
        `base: "${base}"`,
        "var:",
        "  project: example",
        "pages:",
        "  api:",
        "    output: ./out/{{project}}/api.html",
      ].join("\n")
    );
    const config = await loadConfig(file);
    assert.equal(config.pages.api.output, path.resolve(dir, "out/example/api.html"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("deep merges nested page template keys", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "epure-vitest-config-"));
  try {
    const base = path.resolve(process.cwd(), "content/epurejs/config.yaml");
    const file = path.join(dir, "config.yaml");
    await writeFile(
      file,
      [
        `base: "${base}"`,
        "var:",
        "  project: example",
        "pages:",
        "  guide:",
        "    templates:",
        "      pageMain: <div class=\"docs-head\">Example docs</div>",
      ].join("\n")
    );
    const config = await loadConfig(file);

    assert.equal(config.pages.guide.templates.pageMain, '<div class="docs-head">Example docs</div>');
    assert.equal(config.pages.guide.templates.tocItem, '<li><a href="#{{slug}}">{{title}}</a></li>');
    assert.equal(config.pages.guide.templates.chapter.includes("{{bodyHtml}}"), true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("renders guide body when pageMain omits slots", async () => {
  const config = await loadConfig(path.resolve(process.cwd(), "content/epurejs/config.yaml"));
  const html = renderDocsPage({
    config,
    chapters: [
      {
        sort: 1,
        slug: "remote-data",
        title: "Remote Data",
        refs: ["make"],
        bodyHtml: "<p>Body</p>",
      },
    ],
  });

  assert.match(html, /<section class="chapter" id="remote-data">/);
  assert.match(html, /<li><a href="#remote-data">Remote Data<\/a><\/li>/);
  assert.match(html, /Reference: <a href="\.\/api\.html#make">make<\/a>/);
});
