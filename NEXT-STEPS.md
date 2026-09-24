# Next steps

These publication steps are intentionally deferred until the documentation,
package rename, compatibility layer, tests, and deployment workflow are ready.
`epurejs.dev` is already configured with HTTPS support.

## Deprecate the former package

`@epure/vitest@1.1.0` and the `vitest-bdd@1.1.0` compatibility package are
published. `vitest-bdd` is no longer in this repository and receives no 2.x
release. Deprecate every old version so that installing it shows the new name:

```sh
npm deprecate 'vitest-bdd@*' \
  'Renamed to @epure/vitest. Install with: npm install -D @epure/vitest'
```

Keep the package available so existing lockfiles remain reproducible.

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
