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

version_pci_common() {
  if [ -z "${GIT_BRANCH}" ]; then
    printf "%s\n" "Missing GIT_BRANCH environment variable"
    exit 1
  fi

  if [[ "${GIT_BRANCH}" == "maintenance/manager-pci-common-v0.x" ]]; then

    DRY_RELEASE=false # To release PCI Common

  fi

  if [[ "${GIT_BRANCH}" != "maintenance/manager-pci-common-v0.x" && ! "${DRY_RELEASE}" ]]; then
    printf "%s\n" "Only dry releases are allowed on side branches"
    exit 1
  fi

  tag="$1"

  if "${DRY_RELEASE}"; then
    printf "%s\n" "Dry releasing"
    node_modules/.bin/lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --allow-branch="${GIT_BRANCH}" --yes
  else
    printf "%s\n" "Releasing"
    node_modules/.bin/lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --no-private --yes
  fi
}

get_changed_packages() {
  node_modules/.bin/lerna changed --all -p -l
}

get_pci_common_version(){
  node_modules/.bin/lerna list --scope @ovh-ux/manager-pci-common --json | jq -r ".[].version"
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
  git add packages/manager/modules/manager-pci-common/package.json packages/manager/modules/manager-pci-common/CHANGELOG.md
  git commit -s -m "release: $1"
  git tag -a -m "release: $1" "$1"
  if [[ "${GIT_BRANCH}" == "maintenance/manager-pci-common-v0.x" ]]; then
    git push origin "${GIT_BRANCH}" --tags
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

  # Separate versioning for `manager-pci-common` and other packages
  while read -r package; do
    # Check if the changed package is `manager-pci-common`
    if [[ "$package" == *manager-pci-common* ]]; then
      printf "%s\n" "New release for manager-pci-common"
      next_tag=""
      path_mrc=$(echo "$package" | cut -d ':' -f 1)
      name_mrc=$(echo "$package" | cut -d ':' -f 2)
      printf "%s\n" "Versioning...."
      version_pci_common "$next_tag"
      next_version=$(get_pci_common_version)
      release_name="@ovh-ux/manager-pci-common@$next_version"
      printf "%s\n" "Versioning done and next version is $next_version"
      RELEASE_NOTE+="# Release @ovh-ux/manager-pci-common@$next_version\n\n"
      # Create release note for manager-pci-common
      RELEASE_NOTE+="$(create_release_note "$path_mrc" "$name_mrc")\n\n"

      push_and_release "$release_name"
    fi
  done <<< "$changed_packages"
}

main "${@}"
