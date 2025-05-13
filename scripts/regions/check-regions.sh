#!/usr/bin/env bash

get_apps() {
  ls 'packages/manager/apps'
}

get_package_json() {
  app_path="$1"
  cat packages/manager/apps/"$app_path"/package.json
}

main() {
  apps=$(get_apps)
  while read -r app; do
    if ! get_package_json "$app" | grep  -q "regions"; then
      echo "Missing regions metadata in $app"
      exit 1
    fi
  done<<<"$apps"
}

main "${@}"
