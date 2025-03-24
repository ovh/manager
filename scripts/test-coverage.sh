#!/usr/bin/env bash


get_changed_packages() {
  node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name'
}

main() {
    changed_packages=$(get_changed_packages)
    echo $changed_packages
	while read -r package; do
         #turbo run test --concurrency=1 --filter=...$package[master...test/runtestcoverage]
         #turbo run test --concurrency=1 --filter=...$package[HEAD^1]
         #turbo run test --concurrency=1 --filter=$package[HEAD^1] -- --config=../../jest.config.js
         turbo run test --concurrency=1 --filter=$package[$BASE_BRANCH...${GITHUB_REF#refs/heads/}]
	done <<< "$changed_packages"
}

main "${@}"