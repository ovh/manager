#!/usr/bin/env bash
set -euo pipefail

RELEASE_NOTE=""
DRY_RELEASE=false
SEED=""
TAG=""
FORWARD_ARGS=()  # forwarded to `lerna version`
DRY_STASHED=0    # indicates we stashed local changes for dry run

# ---------- portability helpers ----------
sedi() {
  # usage: sedi 's/foo/bar/' file
  if sed --version >/dev/null 2>&1; then
    sed -i -e "$1" "$2"         # GNU sed
  else
    sed -i '' -e "$1" "$2"      # BSD sed (macOS)
  fi
}

ensure_git_branch() {
  if [ -z "${GIT_BRANCH:-}" ]; then
    if ! GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"; then
      printf "%s\n" "Missing GIT_BRANCH and unable to infer from git"
      exit 1
    fi
    export GIT_BRANCH
  fi
}

# ---------- dry-run safety (preserve working tree) ----------
dry_stash_begin() {
  # Stash user's current changes (tracked + untracked) so we can safely wipe Lerna edits
  if [ "${DRY_RELEASE}" = true ]; then
    local status
    status="$(git status --porcelain || true)"
    if [ -n "${status}" ]; then
      git stash push -u -m "release-dry-$(date +%s)" >/dev/null
      DRY_STASHED=1
    fi
  fi
}

dry_restore_clean() {
  # Remove any changes made by Lerna and restore user's stash if any
  if [ "${DRY_RELEASE}" = true ]; then
    git reset --hard >/dev/null
    git clean -fd >/dev/null
    if [ "${DRY_STASHED}" -eq 1 ]; then
      # Pop may conflict; don't fail the whole script
      set +e
      git stash pop --index >/dev/null
      set -e
    fi
  fi
}

# ---------- hardened helpers ----------
create_smoke_tag() {
  local target="$1" name="$2" version="$3" t="${name}@${version}"
  if git rev-parse -q --verify "refs/tags/$t" >/dev/null; then
    echo "• Smoke tag $t already exists — skipping"
  else
    git tag "$t" "$target"
  fi
}

clean_tags() {
  local tags
  tags="$(git tag -l '@ovh*' || true)"
  while read -r t; do
    [ -n "$t" ] && git tag -d "$t" >/dev/null
  done <<< "$tags"
}

run_lerna_version() {
  ensure_git_branch
  if [[ "${GIT_BRANCH}" != "master" && "${DRY_RELEASE}" != true ]]; then
    printf "%s\n" "Only dry releases are allowed on side branches"
    exit 1
  fi

  local args=(
    version
    --conventional-commits
    --no-commit-hooks
    --no-git-tag-version
    --no-push
    --yes
  )

  if [ "${DRY_RELEASE}" = true ]; then
    printf "%s\n" "Dry releasing (no commit/tag/push)"
    args+=(--allow-branch="${GIT_BRANCH}")
  else
    printf "%s\n" "Releasing"
  fi

  if [ "${FORWARD_ARGS+set}" = "set" ] && [ "${#FORWARD_ARGS[@]}" -gt 0 ]; then
    node_modules/.bin/lerna "${args[@]}" "${FORWARD_ARGS[@]}"
  else
    node_modules/.bin/lerna "${args[@]}"
  fi
}

get_changed_packages() {
  node_modules/.bin/lerna changed --all -p -l
}

get_release_name() {
  local seed="$1"
  local base latest suffix next

  base="$(node scripts/release/index.js "$seed")"

  # Find the most recent tag that starts with "<base>-"
  # Prefer version-like sorting, fall back to date.
  latest="$(git tag -l "${base}-*" --sort=-version:refname --sort=-creatordate | head -1 || true)"

  if [[ -z "$latest" ]]; then
    printf "%s\n" "${base}-1"
    return
  fi

  # If latest is "<base>-<number>", increment; else start at 1
  if [[ "$latest" =~ ^${base}-([0-9]+)$ ]]; then
    suffix="${BASH_REMATCH[1]}"
    next=$((suffix + 1))
    printf "%s\n" "${base}-${next}"
  else
    # Non-numeric suffix like "<base>-ox" → start numeric series
    printf "%s\n" "${base}-1"
  fi
}

create_release_note() (
  node_modules/.bin/conventional-changelog -p angular -n scripts/release/changelog.js -k "$1" --commit-path "$1" -l "$2"
)

push_and_release() {
  if [ "${DRY_RELEASE}" = true ]; then
    printf "%s\n" "[DRY-RUN] Skipping commit, tag, push and GH release"
    return
  fi

  printf "%s\n" "Commit and tag"
  git add .
  git commit -s -m "release(*): $1"
  git tag -a -m "release: $1" "$1"
  gh config set prompt disabled
  git push origin "${GIT_BRANCH}" --tags
  echo "${RELEASE_NOTE}" | gh release create "$1" -F -
}

update_sonar_version() {
  if [ "${DRY_RELEASE}" = true ]; then
    printf "%s\n" "[DRY-RUN] Skipping sonar version update"
    return
  fi
  printf "%s\n" "Updating sonar"
  if [ -f ".sonarcloud.properties" ]; then
    sedi "s/^sonar\.projectVersion=.*/sonar.projectVersion=$1/" ".sonarcloud.properties" || {
      printf "%s\n" "Warning: failed to update .sonarcloud.properties (sed). Continuing…"
    }
  else
    printf "%s\n" "Warning: .sonarcloud.properties not found. Skipping sonar version update."
  fi
}

help() {
  cat <<EOF
Release monorepository

options:
  -d, --dry-run         Dry release (no tags/commits/push; no file changes persist)
  -s, --seed <value>    Seed to generate release name
  -t, --tag  <name>     Force a specific release tag (skips name generation)
  -h, --help            Show this help

Any extra flags are forwarded to 'lerna version'.
EOF
}

# ---------- args ----------
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -d|--dry-run|--dryrun) DRY_RELEASE=true; shift ;;
      -s|--seed)             SEED="$2"; shift 2 ;;
      -t|--tag)              TAG="$2";  shift 2 ;;
      -h|--help)             help; exit 0 ;;
      --)                    shift; break ;;
      *)  FORWARD_ARGS+=("$1")
          if [[ $# -gt 1 && ! "$2" =~ ^- ]]; then FORWARD_ARGS+=("$2"); shift; fi
          shift ;;
    esac
  done
}

main() {
  parse_args "$@"

  local changed_packages
  changed_packages="$(get_changed_packages || true)"
  if [ -z "${changed_packages}" ]; then
    printf "%s\n" "Nothing to release"
    exit 0
  fi

  local current_tag
  current_tag="$(git describe --tags --abbrev=0 2>/dev/null || echo '0.0.0')"
  printf "%s\n" "Previous tag was $current_tag"

  if [ "${DRY_RELEASE}" = true ]; then
    printf "%s\n" "[DRY-RUN] Skipping smoke tag creation"
  else
    while read -r package; do
      [ -z "$package" ] && continue
      local name version
      name=$(echo "$package" | cut -d ':' -f 2)
      version=$(echo "$package" | cut -d ':' -f 3)
      [ -n "$name" ] && [ -n "$version" ] && create_smoke_tag "$current_tag" "$name" "$version"
    done <<< "$changed_packages"
  fi

  local next_tag
  if [ -n "$TAG" ]; then
    next_tag="$TAG"
  else
    next_tag="$(get_release_name "$SEED")"
  fi
  printf "%s\n" "New tag is $next_tag"

  RELEASE_NOTE+="# Release $next_tag\n\n"

  # In dry mode, protect working tree around Lerna edits
  if [ "${DRY_RELEASE}" = true ]; then
    dry_stash_begin
  fi

  update_sonar_version "$next_tag"
  run_lerna_version

  # Undo any file changes produced by Lerna during dry-run
  if [ "${DRY_RELEASE}" = true ]; then
    dry_restore_clean
  fi

  if [ "${DRY_RELEASE}" = true ]; then
    echo "[DRY-RUN] Skipping release note generation"
  else
    while read -r package; do
      [ -z "$package" ] && continue
      local path name
      path=$(echo "$package" | cut -d ':' -f 1)
      name=$(echo "$package" | cut -d ':' -f 2)
      [ -n "$path" ] && [ -n "$name" ] && RELEASE_NOTE+="$(create_release_note "$path" "$name")\n\n"
    done <<< "$changed_packages"
  fi

  if [ "${DRY_RELEASE}" != true ]; then
    clean_tags
  else
    printf "%s\n" "[DRY-RUN] Skipping cleanup of package-specific tags"
  fi

  push_and_release "$next_tag"
  echo "✔ Done."
}

main "$@"
