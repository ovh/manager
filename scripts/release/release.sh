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

version() {
  if [ -z "${GIT_BRANCH}" ]; then
    printf "%s\n" "Missing GIT_BRANCH environment variable"
    exit 1
  fi

  if [[ "${GIT_BRANCH}" != "master" && ! "${DRY_RELEASE}" ]]; then
    printf "%s\n" "Only dry releases are allowed on side branches"
    exit 1
  fi

  tag="$1"

  if "${DRY_RELEASE}"; then
    printf "%s\n" "Dry releasing"
    node_modules/.bin/lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --allow-branch="${GIT_BRANCH}" --yes
  else
    printf "%s\n" "Releasing"
    node_modules/.bin/lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --yes --ignore-changes="packages/manager-react-components/**,packages/manager/modules/manager-pci-common/**"
  fi
}

version_mrc() {
  if [ -z "${GIT_BRANCH}" ]; then
    printf "%s\n" "Missing GIT_BRANCH environment variable"
    exit 1
  fi

  if [[ "${GIT_BRANCH}" != "master" && ! "${DRY_RELEASE}" ]]; then
    printf "%s\n" "Only dry releases are allowed on side branches"
    exit 1
  fi

  tag="$1"

  if "${DRY_RELEASE}"; then
    printf "%s\n" "Dry releasing"
    node_modules/.bin/lerna version --scope=manager-react-components --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --allow-branch="${GIT_BRANCH}" --yes
  else
    printf "%s\n" "Releasing"
    node_modules/.bin/lerna exec --scope=@ovh-ux/manager-react-components -- lerna version --conventional-commits --no-commit-hooks --no-git-tag-version --no-push --no-private --ignore-changes="packages/manager/modules/manager-pci-common/**" --yes
  fi
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

push_and_release_mrc() {
  printf "%s\n" "Commit mrc changes"
  git add packages/manager-react-components/package.json packages/manager-react-components/CHANGELOG.md
  git commit -s --amend --no-edit
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

  # Separate versioning for `manager-react-components` and other packages
  mrc_changed=false
  while read -r package; do
    name=$(echo "$package" | cut -d ':' -f 2)
    version=$(echo "$package" | cut -d ':' -f 3)

    # Check if the changed package is `manager-react-components`
    if [[ "$name" == *manager-react-components* ]]; then
      mrc_changed=true
      path_mrc=$(echo "$package" | cut -d ':' -f 1)
      name_mrc=$(echo "$package" | cut -d ':' -f 2)
      create_smoke_tag "$current_tag" "$name_mrc" "$version"
    else
      create_smoke_tag "$current_tag" "$name" "$version"
    fi
  done <<< "$changed_packages"


  # Handle the rest of the packages
  next_tag=$(get_release_name "$SEED")
  printf "%s\n" "New tag for other packages: $next_tag"
  RELEASE_NOTE+="# Release $next_tag\n\n"
  update_sonar_version "$next_tag"
  version "$next_tag"

  # Generate formatted release notes for other packages
  while read -r package; do
    path=$(echo "$package" | cut -d ':' -f 1)
    name=$(echo "$package" | cut -d ':' -f 2)
    RELEASE_NOTE+="$(create_release_note "$path" "$name")\n\n"
  done <<< "$changed_packages"

  # Remove package-specific tags for other packages
  clean_tags

  # Push and release for other packages
  push_and_release "$next_tag"

  # Handle `manager-react-components` separately
  if [ "$mrc_changed" == true ]; then
    next_tag=$(get_release_name "$SEED")
    printf "%s\n" "New tag for manager-react-components: $next_tag"

    RELEASE_NOTE+="# Release $next_tag\n\n"

    update_sonar_version "$next_tag"
    version_mrc "$next_tag"

    # Create release note for manager-react-components
    RELEASE_NOTE+="$(create_release_note "$path_mrc" "$name_mrc")\n\n"

    # Commit and release manager-react-components
    clean_tags
    push_and_release_mrc "$next_tag"
  fi

}

main "${@}"
