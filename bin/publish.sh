#!/bin/bash

set -euo pipefail

if ! command -v pnpm >/dev/null; then
  echo "pnpm is not installed."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "The repository must be clean before publishing."
  exit 1
fi

mode="${1:-stable}"
case "$mode" in
  stable) tag="latest" ;;
  --beta) tag="beta" ;;
  --canary) tag="canary" ;;
  *)
    echo "Usage: $0 [--beta|--canary]"
    exit 1
    ;;
esac

base_version=$(node -p "require('./package.json').version")
if [[ ! "$base_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Root version must be stable SemVer: $base_version"
  exit 1
fi

version="$base_version"
if [ "$mode" != "stable" ]; then
  version="$base_version-${tag}.$(date +'%Y%m%dT%H%M%S')"
fi

work=$(mktemp -d)
cp epure-vitest/package.json "$work/epure-vitest.package.json"
cp vitest-bdd/package.json "$work/vitest-bdd.package.json"
cp pnpm-lock.yaml "$work/pnpm-lock.yaml"

cleanup() {
  cp "$work/epure-vitest.package.json" epure-vitest/package.json
  cp "$work/vitest-bdd.package.json" vitest-bdd/package.json
  cp "$work/pnpm-lock.yaml" pnpm-lock.yaml
  rm -f epure-vitest/README.md vitest-bdd/README.md
  rm -rf "$work"
}
trap cleanup EXIT

cp README.md epure-vitest/README.md
cp README.md vitest-bdd/README.md
npm --prefix epure-vitest --no-git-tag-version version "$version"
npm --prefix vitest-bdd --no-git-tag-version version "$version"
pnpm install --lockfile-only
pnpm build
pnpm test

mkdir -p "$work/packs"
pnpm --filter @epure/vitest pack --pack-destination "$work/packs"
pnpm --filter vitest-bdd pack --pack-destination "$work/packs"

pnpm --filter @epure/vitest publish --tag "$tag" --access public --no-git-checks
pnpm --filter vitest-bdd publish --tag "$tag" --access public --no-git-checks

if [ "$mode" = "stable" ]; then
  git tag "v$version"
fi

echo "Published @epure/vitest and vitest-bdd compatibility package at $version ($tag)."

