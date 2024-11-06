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
    node_modules/.bin/lerna version --ignoreChanges=@ovh-ux/manager-react-components --conventional-prerelease=@ovh-ux/shell,@ovh-ux/url-builder,@ovh-ux/manager-react-components,@ovh-ux/manager-react-shell-client,@ovh-ux/request-tagger --conventional-commits --no-commit-hooks --no-git-tag-version --no-push  --yes
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

  #For each package create semver tag in order to be used by lerna version
  while read -r package; do
    name=$(echo "$package" | cut -d ':' -f 2)
    version=$(echo "$package" | cut -d ':' -f 3)
    create_smoke_tag "$current_tag" "$name" "$version"
  done <<< "$changed_packages"

  next_tag=$(get_release_name "$SEED")
  printf "%s\n" "New tag is $next_tag"

  RELEASE_NOTE+="# Release $next_tag\


"

  update_sonar_version "$next_tag"
  version "$next_tag"

  #For each package generate formatted section in release note
  while read -r package; do
    path=$(echo "$package" | cut -d ':' -f 1)
    name=$(echo "$package" | cut -d ':' -f 2)
    RELEASE_NOTE+="$(create_release_note "$path" "$name")\


"
  done <<< "$changed_packages"

  #Remove package specific tags
  clean_tags

  push_and_release "$next_tag"
}

main "${@}"
