#!/usr/bin/env bash

RELEASE_NOTE=""
DRY_RELEASE=false

create_smoke_tag() {
  git tag "$2@$3" "$1"
}

clean_tags() {
  tags="$(git tag -l '@ovh*')"
  while read -r tag; do
    git tag -d "$tag"
  done <<< "$tags"
}

version_mrc() {
  # Version only the manager-react-components package
  printf "%s\n" "Versioning manager-react-components"
  node_modules/.bin/lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --scope=manager-react-components --yes
}

get_changed_packages() {
  node_modules/.bin/lerna changed --all -p -l
}

get_release_name() {
  seed="$1"
  release_name=$(node scripts/release/index.js "$seed")
  latest_release="$(git tag -l "${release_name}*" --sort=taggerdate | tail -1)"
  if [ -z "$latest_release" ]; then
    printf "%s\n" "$release_name"
  else
    id="${latest_release/$release_name-/}"
    if [ -z "$id" ]; then
      printf "%s\n" "$release_name-1"
    else
      next_id="$((id + 1))"
      printf "%s\n" "$release_name-$next_id"
    fi
  fi
}

create_release_note() (
  node_modules/.bin/conventional-changelog -p angular -n scripts/release/changelog.js -k "$1" --commit-path "$1" -l "$2"
)

push_and_release() {
  printf "%s\n" "Commit and tag"
  git add .
  git commit -s -m "release: $1"
  git tag -a -m "release: $1" "$1"
  if ! "${DRY_RELEASE}"; then
    gh config set prompt disabled
    git push origin "${GIT_BRANCH}" --tags
    echo "${RELEASE_NOTE}" | gh release create "$1" -F -
  fi
}

update_sonar_version() {
  printf "%s\n" "Updating sonar"
  sed -i "s/sonar\.projectVersion=.*/sonar\.projectVersion=$1/" ".sonarcloud.properties"
}

help()
{
   # Display Help
   echo "Release monorepository"
   echo
   echo "options:"
   echo "d     Dry release. Create a release in local without pushing or tagging to remote"
   echo "s     Seed. Specify seed to generate release name"
   echo "h     help."
   echo
}

main() {
  # Parse options
  while getopts "dsh" option; do
    case "${option}" in
      d)
        DRY_RELEASE=true
        ;;
      s)
        SEED="${OPTARG}"
        ;;
      h)
        help
        ;;
      *)
        help
        ;;
    esac
  done

  changed_packages=$(get_changed_packages)
  if [ -z "$changed_packages" ]; then
    printf "%s\n" "Nothing to release"
    exit 0
  fi

  current_tag="$(git describe --abbrev=0)"
  printf "%s\n" "Previous tag was $current_tag"

  # For manager-react-components (MRC), version it specifically
  if echo "$changed_packages" | grep -q "manager-react-components"; then
    # Only version MRC package
    next_tag=$(get_release_name "$SEED")
    printf "%s\n" "New tag for MRC: $next_tag"

    RELEASE_NOTE+="# Release $next_tag\


"

    # Update Sonar version for the new tag
    update_sonar_version "$next_tag"
    
    # Version the MRC package
    version_mrc

    # Update the changelog for MRC package
    path="packages/manager-react-components"  # Adjust path as needed
    name="manager-react-components"
    RELEASE_NOTE+="$(create_release_note "$path" "$name")\


"

    # Commit changes and tag
    push_and_release "$next_tag"
  else
    printf "%s\n" "No changes detected for manager-react-components. Exiting."
    exit 0
  fi
}

main "${@}"
