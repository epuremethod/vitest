# Next steps

These publication steps are intentionally deferred until the documentation,
package rename, compatibility layer, tests, and deployment workflow are ready.
`epurejs.dev` is already configured with HTTPS support.

## Publish the npm migration

1. Run the complete local verification suite and inspect both package tarballs.
2. Publish `@epure/vitest@1.1.0` as a public scoped package.
3. Verify that the canonical package contains:
   - ESM and CommonJS entry points;
   - TypeScript declarations;
   - `EpureVitest.res`, `EpureVitest.resi`, and generated ReScript files;
   - the deprecated `VitestBdd` compatibility module;
   - `README.md` and `llms.txt`.
4. Install only `@epure/vitest` in a temporary project and run a TypeScript
   feature plus a ReScript feature.
5. Publish the final `vitest-bdd@1.1.0` compatibility package. It must depend
   on `@epure/vitest@^1.1.0` and forward its ESM, CommonJS, TypeScript, and
   ReScript entry points.
6. Test projects with only the old name and with both names installed. Confirm
   that they use the canonical builder state and that generated imports resolve.
7. Deprecate every old package version:

   ```sh
   npm deprecate 'vitest-bdd@*' \
     'Renamed to @epure/vitest. Install with: npm install -D @epure/vitest'
   ```

8. Stop publishing features under `vitest-bdd`. Keep it available and
   deprecated so existing lockfiles remain reproducible.

npm has no publisher-controlled package redirect. Its aliases are
consumer-local and cannot safely replace this compatibility release because
generated suites import the canonical package name.

## Publish and verify the completed migration

1. Merge the documentation workflow and run it manually once. GitHub Pages and
   HTTPS are already configured for `epurejs.dev`.
2. Verify:
   - `https://epurejs.dev/`
   - `https://epurejs.dev/guide.html`
   - `https://epurejs.dev/api.html`
   - `https://epurejs.dev/style.css`
   - `https://epurejs.dev/llms.txt`
3. Confirm the scoped npm page shows the canonical README, repository,
   documentation URL, current version, and deprecation guidance for the former
   name.
4. Confirm installing `vitest-bdd` displays the npm deprecation message, while
   existing old-name code still runs and emits the API-level migration warnings.
5. Search the released source for stale `midasum/vitest-bdd`,
   `vitest-bdd.dev`, `tiliajs.com`, `tilia-docs`, copied Tilia/Query fixtures,
   and accidental old-package imports. Allow only intentional compatibility,
   migration, and changelog references.
6. Only after these checks pass, describe `@epure/vitest`, its npm page, and
   `epurejs.dev` as published.
