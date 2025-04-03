#!/usr/bin/env bash

get_changed_packages() {
  node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name'
}

main() {
  changed_packages=$(get_changed_packages)
  if [[ -z "$changed_packages" ]]; then
	    while read -r package; do
            yarn exec turbo -- run test --concurrency=1 --filter=$package[origin/${BASE_BRANCH}...origin/${CURRENT_BRANCH}]
	    done <<< "$changed_packages"
  else
      echo "No changed packages identified"
  fi
}

main "${@}"
