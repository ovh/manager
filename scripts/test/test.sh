#!/usr/bin/env bash


get_changed_packages() {
  node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name'
}

main() {
    changed_packages=$(get_changed_packages)
    echo $changed_packages
    #turbo run test --concurrency=1 --filter=[HEAD^1]
	while read -r package; do
         turbo run test --concurrency=1 --filter=...$package[master...test/runtestcoverage] -- --ci --reporters=jest-html-reporter
         #turbo run test --concurrency=1 --filter=[HEAD^1] --filter=$package
         #turbo run test --concurrency=1 --filter=[master...test/runtestcoverage]
	done <<< "$changed_packages"
}

main "${@}"

    