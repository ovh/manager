
# `@ovh-ux/manager-pm` — Hybrid Yarn + PNPM Orchestration

Incrementally adopt **PNPM per-app** inside a **Yarn-root** monorepo without breaking existing workflows.  
This package provides:

- A small CLI (`manager-pm`) for common **build/test/lint/start** tasks across a merged view of apps (Yarn ∪ PNPM).
- Safe **preinstall** / **postinstall** scripts to prepare & finalize hybrid setups.
- Thin scripts to **move apps between Yarn and PNPM** (`pm:add:app`, `pm:remove:app`) by editing catalogs and refreshing root workspaces.

> Works even when `node_modules` isn't installed: bootstrap scripts are zero‑dep Node ESM.

---

## Table of contents

- [Why hybrid?](#why-hybrid)
- [What this package does](#what-this-package-does)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Install & wire-up](#install--wire-up)
- [Catalogs & workspace merging](#catalogs--workspace-merging)
- [App lifecycle (Yarn → PNPM → Yarn)](#app-lifecycle-yarn--pnpm--yarn)
- [Root scripts (copy/paste)](#root-scripts-copypaste)
- [CLI usage](#cli-usage)
  - [Per-app actions](#per-app-actions)
  - [All apps (merged view)](#all-apps-merged-view)
  - [Interactive start](#interactive-start)
  - [Move an app to PNPM](#move-an-app-to-pnpm)
  - [Rollback an app to Yarn](#rollback-an-app-to-yarn)
- [How it works (under the hood)](#how-it-works-under-the-hood)
- [Configuration](#configuration)
- [Logging & exit codes](#logging--exit-codes)
- [License](#license)

---

## Why hybrid?

Monorepos with hundreds of packages often can’t flip to PNPM in one go. This toolkit lets us:
- Keep **Yarn at the root** (existing CI and tooling remain stable).
- Migrate **one application at a time** to PNPM with isolated installs.
- Still use **Turbo** across a **merged catalog** of Yarn + PNPM apps.

---

## What this package does

1. **Preinstall** (`src/manager-pm-preinstall.js`)
  - Restricts root `workspaces.packages` to **Yarn-only** apps.
  - Temporarily removes the root `packageManager` field (if present) to avoid Yarn enforcing a version during PNPM bootstrap.
  - Cleans known folders (`node_modules`, `dist`, `.turbo`) when needed.

2. **Postinstall** (`src/manager-pm-postinstall.js`)
  - Recreates the **merged** `workspaces.packages` based on the catalogs.
  - Downloads a **pinned PNPM** binary to `target/pnpm/pnpm` (version from `src/playbook/pnpm-config.js`, default **10.11.1**), then verifies it.
  - For every PNPM app:
    - Generates a **local, app-scoped** `pnpm-workspace.yaml` and `.npmrc` (store, overrides).
    - Links internal private packages via `link:` overrides using `pnpm-normalized-versions.json`.
    - Runs `pnpm install` in the app with the **pinned** PNPM and a local store.

3. **CLI** (`bin/manager-pm.js`)
  - Per-app `build` / `test` / `lint` (Turbo filters resolved from package name or workspace path).
  - `full-build` / `full-test` / `full-lint` over **all** apps (Yarn + PNPM).
  - `start` launches an **interactive** prompt (inquirer) to pick an app and optionally start the **container** app alongside.

4. **App migration shims**
  - `pm:add:app` → add an app to PNPM (remove from Yarn catalog, add to PNPM catalog, refresh workspaces).
  - `pm:remove:app` → rollback an app to Yarn (reverse of the above).
  - Both accept `--app <name|package|path>`.

---

## Repository layout

```
manager-pm/
├─ bin/
│  └─ manager-pm.js                      # Commander-based CLI (installed context)
├─ src/
│  ├─ manager-pm-preinstall.js           # Yarn preinstall hook (zero deps)
│  ├─ manager-pm-postinstall.js          # Yarn postinstall hook (zero deps)
│  ├─ manager-pm-add-app.js              # Add an app to PNPM (CLI shim)
│  ├─ manager-pm-remove-app.js           # Remove an app from PNPM (CLI shim)
│  ├─ kernel/
│  │  ├─ commons/
│  │  │  ├─ log-manager.js               # Colored logs (info/success/warn/error/debug)
│  │  │  ├─ json-utils.js                # Safe JSON read/write helpers
│  │  │  ├─ catalog-utils.js             # Read/update catalogs; merge root workspaces
│  │  │  ├─ workspace-utils.js           # App discovery, resolution, filters
│  │  │  └─ task-utils.js                # Turbo filter resolver
│  │  └─ pnpm/
│  │     ├─ pnpm-deps-manager.js         # Pre/Post install flows, per-app PNPM install
│  │     ├─ pnpm-apps-manager.js         # addAppToPnpm / removeAppFromPnpm
│  │     ├─ pnpm-tasks-manager.js        # buildApp/testApp/lintApp, buildAll/testAll/lintAll
│  │     ├─ pnpm-start-app.js            # interactive `start` (inquirer + concurrently)
│  │     └─ pnpm-bootstrap.js            # Download & verify pinned PNPM
│  └─ playbook/
│     ├─ pnpm-config.js                  # Paths, versions, stores, base folders
│     └─ catalog/
│        ├─ yarn-catalog.json            # Apps handled by Yarn
│        ├─ pnpm-catalog.json            # Apps handled by PNPM
│        └─ pnpm-normalized-versions.json# Version map + `link:` overrides for private deps
└─ package.json
```

---

## Prerequisites

- **Node.js 18+** (Node 20+ recommended).
- **Yarn** at the monorepo root.
- **Turbo** available in the repo (used by build/test/lint/start tasks).
- macOS/Linux/Windows are supported. A matching PNPM binary is downloaded automatically under `target/pnpm/`.

---

## Install & wire-up

1) Add this private package under your monorepo (already located at `packages/manager-tools/manager-pm`).
2) In the **root** `package.json`, add scripts (example):

```json
{
  "scripts": {
    "preinstall": "node ./packages/manager-tools/manager-pm/src/manager-pm-preinstall.js",
    "postinstall": "node ./packages/manager-tools/manager-pm/src/manager-pm-postinstall.js",

    "pm:add:app": "node ./packages/manager-tools/manager-pm/src/manager-pm-add-app.js",
    "pm:remove:app": "node ./packages/manager-tools/manager-pm/src/manager-pm-remove-app.js",

    "pm:build": "manager-pm --type pnpm --action full-build",
    "pm:test":  "manager-pm --type pnpm --action full-test",
    "pm:lint:tsx": "manager-pm --type pnpm --action full-lint",
    "pm:start": "manager-pm --type pnpm --action start"
  }
}
```

3) Ensure the catalogs exist (paths are relative to the `manager-pm` package):

- `src/playbook/catalog/yarn-catalog.json` (initially lists all existing apps)
- `src/playbook/catalog/pnpm-catalog.json` (starts empty `[]`)
- `src/playbook/catalog/pnpm-normalized-versions.json` (contains `link:` overrides for internal packages and any pinned versions we need during PNPM app installs)

---

## Catalogs & workspace merging

- Yarn apps live in: `src/playbook/catalog/yarn-catalog.json`
- PNPM apps live in: `src/playbook/catalog/pnpm-catalog.json`

On **preinstall**, the root `workspaces.packages` gets rewritten to **only** Yarn apps.  
On **postinstall**, the root `workspaces.packages` is rebuilt from **both** catalogs (Yarn ∪ PNPM).

> This ensures `yarn install` remains authoritative at the root, while PNPM installs are performed **inside** each PNPM-managed app with its own workspace file and store.

---

## App lifecycle (Yarn → PNPM → Yarn)

1. **Start on Yarn**: app path is present in `yarn-catalog.json`.
2. **Move to PNPM**: run `yarn pm:add:app --app <appRef>` → app path is removed from Yarn catalog and added to PNPM catalog; workspaces are refreshed.
3. **Install**: `yarn install` at the root triggers pre/post hooks. PNPM side bootstraps and installs **inside** PNPM apps with a pinned PNPM.
4. **Run**: use `pm:*` scripts to build/test/lint or the interactive `pm:start`.
5. **Rollback**: `yarn pm:remove:app --app <appRef>` moves the app back to Yarn, and the next install puts it under the Yarn root again.

`<appRef>` can be:
- The **workspace name** (e.g., `web`),
- The **package name** (e.g., `@ovh-ux/manager-web`),
- A **path** relative to repo root (e.g., `packages/manager/apps/web`).

---

## Root scripts (copy/paste)

```bash
# Move 'web' to PNPM
yarn pm:add:app --app web

# Rollback 'web' to Yarn
yarn pm:remove:app --app web

# Build / Test / Lint ALL apps across Yarn + PNPM
yarn pm:build
yarn pm:test
yarn pm:lint:tsx

# Interactive start (prompts for app; can also start container alongside)
yarn pm:start
```

---

## CLI usage

> The CLI is available once dependencies are installed (uses `commander`, `inquirer`, `concurrently`).  
> The migration shims (`pm:add:app`, `pm:remove:app`) are **zero‑dep**, safe to run anytime.

### Per-app actions

```bash
manager-pm --type pnpm --action build --app web
manager-pm --type pnpm --action test  --app web
manager-pm --type pnpm --action lint  --app web
```

- Uses Turbo with an appropriate `--filter` derived from the **package name** or the **last path segment** of the workspace.

### All apps (merged view)

```bash
manager-pm --type pnpm --action full-build
manager-pm --type pnpm --action full-test
manager-pm --type pnpm --action full-lint
```

### Interactive start

```bash
manager-pm --type pnpm --action start
```

- Prompts to **search & select** an app.
- Optionally runs the **container** app alongside the target app using `concurrently`.
- The container package name defaults to `@ovh-ux/manager-container-app` (configurable).

### Move an app to PNPM

```bash
# Any of these forms work:
yarn pm:add:app --app web
yarn pm:add:app --app packages/manager/apps/web
yarn pm:add:app --app @ovh-ux/manager-web
```

### Rollback an app to Yarn

```bash
yarn pm:remove:app --app web
```

---

## How it works (under the hood)

- **Paths & constants** live in `src/playbook/pnpm-config.js`:
  - `applicationsBasePath`: `packages/manager/apps`
  - `pnpmVersion`: **10.11.1**
  - `pnpmBinaryPath`: `./target/pnpm`
  - `pnpmExecutablePath`: `./target/pnpm/pnpm`
  - `pnpmStorePath`: local store used during per-app installs
  - `privateWorkspaces`: roots of internal packages (`packages/manager/core`, `packages/manager/modules`, `packages/components`)
  - `containerPackageName`: `@ovh-ux/manager-container-app`

- **Catalogs** are plain JSON arrays of paths:
  - `src/playbook/catalog/yarn-catalog.json`
  - `src/playbook/catalog/pnpm-catalog.json`
  - `src/playbook/catalog/pnpm-normalized-versions.json` contains a map of dependency **overrides** (including `link:` entries pointing to internal packages).

- **Bootstrap** (`pnpm-bootstrap.js`) resolves the right PNPM binary for your platform (macOS/Linux/Windows), downloads it to `target/pnpm/`, marks it executable, and checks `pnpm --version`.

- **Per-app install** (`pnpm-deps-manager.js`) creates a **local** `pnpm-workspace.yaml` and `.npmrc` inside each PNPM app, injects **overrides** and a **local store**, installs with the **pinned** PNPM, and then proceeds with the rest of postinstall steps.

- **Turbo tasks** (`pnpm-tasks-manager.js`) stream output (`stdio: inherit`) and propagate failures with non-zero exit codes.

---

## Configuration

All knobs live in `src/playbook/pnpm-config.js`:

- `applicationsBasePath` — where to discover apps (default: `packages/manager/apps`).
- `privateWorkspaces` — roots where private packages are discovered for `link:` overrides.
- `pnpmVersion` — pinned PNPM version to download.
- `pnpmBinaryPath`, `pnpmExecutablePath`, `pnpmStorePath` — where to keep the binary and the store.
- `cleanupDirectories` — directories removed during certain maintenance steps.
- `containerPackageName` — name of the container package started with `pm:start` when requested.

Version/link overrides live in `src/playbook/catalog/pnpm-normalized-versions.json`.

---

## Logging & exit codes

- Logs are **colored** and consistently formatted via `log-manager.js`:
  - `ℹ info`, `✔ success`, `⚠ warn`, `✖ error`, and gray `• debug` lines.
- Exit codes:
  - `0` — success
  - `1` — invalid input (e.g., missing `--app`) or unexpected failure
  - Other codes may propagate from internal tools (Turbo, PNPM) if they exit non‑zero.


---

## License

BSD-3-Clause — © OVH SAS
