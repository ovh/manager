#!/usr/bin/env bash


get_changed_packages() {
  node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name'
}

main() {
    changed_packages=$(get_changed_packages)
    echo $changed_packages
    turbo run test --concurrency=1 --filter=[HEAD^1]
	# while read -r package; do
    #      #turbo run test --concurrency=1 --filter=...$package[HEAD^1]
    #      turbo run test --concurrency=1 --filter=[HEAD^1] --filter=$package
	# done <<< "$changed_packages"
}

main "${@}"

    