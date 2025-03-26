#!/usr/bin/env bash

get_changed_packages() {
  node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name'
}

main() {
    changed_packages=$(get_changed_packages)
    echo $changed_packages
	while read -r package; do
        yarn exec turbo -- run test --concurrency=1 --filter=$package[${BASE_BRANCH}...${CURRENT_BRANCH}]
	done <<< "$changed_packages"
}

main "${@}"
