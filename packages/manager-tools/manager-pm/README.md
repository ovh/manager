# manager-pm — Hybrid PNPM + Yarn + Multi-Runner Orchestration (Turbo, Nx, …)

`manager-pm` enables a smooth, reversible migration where the monorepo keeps **Yarn** at the root while selected apps adopt **PNPM** in isolation. It manages catalogs of apps, patches configs safely, bootstraps a pinned PNPM binary, and gives you one CLI to build/test/lint across **both** package managers and multiple **task runners** (Turbo, Nx, …).

> **Repo assumptions**  
> Applications live under `packages/manager/apps/*` and modules (public and private) under:
>
> - `packages/manager/core`
> - `packages/manager/modules`
> - `packages/manager/tools`
> - `packages/manager-ui-kit`
> - `packages/manager-wiki`
> - `packages/components`

---

## Why this exists

- Keep the **root** (lockfile, scripts, Turbo/Nx configs) stable on Yarn.
- Migrate apps and modules **one by one** to PNPM with minimal blast radius.
- Run task-runner pipelines (**Turbo, Nx, …**) across **all** apps by temporarily merging workspaces.
- Normalize risky deps (React, types, test stack) to prevent duplication conflicts.
- Stay reproducible by pinning a PNPM binary under `target/pnpm/`.

---

## Philosophy & Design Rationale

The approach is inspired by a simple migration principle:  
**separate workflows first, then unify when safe**.

- If you want to migrate from Yarn → PNPM, the naive approach is to split the repo into two completely separate spaces.
- Instead, `manager-pm` keeps **both Yarn and PNPM in the same workspace** and switches context cleverly:
  - When Yarn is needed → PNPM apps are removed from the root `package.json`.
  - When the task runner (Turbo/Nx/…) needs the full graph → PNPM apps are temporarily merged back.
- PNPM is kept **localized** (no hoisting) to avoid interference with Yarn.
- CI/CD pipelines remain unchanged because `manager-pm` hooks into Yarn's pre/post install lifecycle.
- Legacy `yarn exec turbo` is replaced with direct `yarn build` / `yarn turbo` / `yarn nx` driven by `manager-pm`.
- Non-semver dependencies are overridden via **per-app temporary `pnpm-workspace.yaml`** instead of modifying apps directly.
- Private internal packages are built and **linked into PNPM's store** to avoid registry fetches, ensuring fresh builds from `dist/`.
- To prevent multiple React instances, React-family packages are exposed as **peerDependencies** and deduped in Vite configs.
- No local or CI/CD installation of PNPM is required. The manager-pm tool is fully autonomous and portable, bundling a pinned PNPM binary to ensure reproducibility. This avoids changing existing developer setups or pipelines when transitioning between package managers.

```text
                 ┌───────────────────────┐
                 │ Root (Yarn workspace) │
                 └───────────┬───────────┘
                             │
      ┌──────────────────────┴────────────────────────┐
      │                                               │
┌─────────────┐                                ┌─────────────┐
│ Yarn Apps   │                                │ PNPM Apps   │
│ (stable)    │                                │ (migrating) │
└─────┬───────┘                                └─────┬───────┘
      │   remove during Yarn ops                      │  isolated installs
      │   merge during runner ops                     │  temp workspace.yaml
      │                                               │  private deps linked
      │                                               │  react dedupe
      └───────────────────┬───────────────────────────┘
                          │
                  ┌───────▼──────────────┐
                  │   Task Graph         │
                  │  (Turbo / Nx / …)    │
                  └──────────────────────┘
```

---

## PNPM Dependency Layout in Isolated Mode

PNPM uses a **global content-addressable store** to manage dependencies efficiently.

This design avoids duplication on disk while preserving isolated dependency trees per application.

### How PNPM Stores Dependencies

- All packages are placed in a global `.pnpm/` store directory.
- In each project's `node_modules/`, PNPM does **not copy files**. Instead:
  - A **hard link** (or symlink on Windows) is created from the store to `node_modules/.pnpm/...`.
  - A **symlink** is then created to expose the package at the expected path (e.g., `node_modules/react`).
- Result: even if 50 apps depend on `react@18.3.0`, React's source files exist **only once in the store**.

### Isolated Mode

When using isolated mode (no hoisting):

- Each app (`appA/node_modules`, `appB/node_modules`) gets its own independent dependency tree.
- If both **App A** and **App B** depend on `react@18.3.0`:
  - PNPM stores React once globally.
  - Each app's `node_modules` contains a hard link pointing to that same store location.
  - On disk, React is **not duplicated** — the two entries share the same inode.

### Key Effects

- **No Disk Bloat** – React's code (or any package) is stored only once globally.
- **Dependency Isolation** – each app has its own `node_modules` tree, avoiding hoisting conflicts and version leakage.
- **Runtime Behavior**
  - If apps are deployed independently, multiple React instances are fine.
  - If apps are composed together (e.g., microfrontends), multiple React instances can cause *Invalid Hook Call* errors.

✅ With this setup, PNPM maintains efficient disk usage, guarantees isolation, and still allows you to control deduplication of critical libraries like React.

### Best Practice for Shared Libraries (e.g., React)

To avoid multiple React instances at runtime:

1. Declare React as a **peerDependency** in all apps:

   ```json
   {
     "peerDependencies": {
       "react": "^18.0.0",
       "react-dom": "^18.0.0"
     }
   }
   ```

2. Ensure the **host application** provides the actual React version.

---

## How it works — concepts that match the codebase

### 1) Catalogs (sources of truth)

- **Yarn catalog**: `src/playbook/catalog/yarn-catalog.json`
- **PNPM catalog**: `src/playbook/catalog/pnpm-catalog.json`

An app lives in **one** catalog at a time. Migrating an app = moving its workspace path between catalogs.  
`catalog-utils` exposes helpers to read/write catalogs and to **prepare/clear** root `workspaces.packages`:

- `updateRootWorkspacesFromCatalogs()` → merge Yarn+PNPM catalogs into the root for “full graph” operations.
- `updateRootWorkspacesToYarnOnly()` → restrict to Yarn apps (used during `preinstall`).
- `clearRootWorkspaces()` → empty the merged view (used after tasks / in `finally` blocks).

### 2) Pinned PNPM

- `src/playbook/playbook-config.js` pins PNPM to **`10.17.0`** and stores it under `target/pnpm`.
- `pnpm-bootstrap` downloads the right binary for the platform and verifies it with `pnpm --version`.

### 3) Private package linking

- `dependencies-utils.getPrivatePackages()` scans these workspace roots (configurable in `playbook-config`):
  - `packages/manager/core`
  - `packages/manager/modules`
  - `packages/manager-tools`
  - `packages/components` (excluding this tool and the generator)

Private packages are **built via the task runner** (Turbo/Nx) then **linked** (`link:` overrides) into each PNPM app’s *temporary* workspace file.

### 4) Per-app temporary `pnpm-workspace.yaml`

During PNPM install for a PNPM app, a **temporary** `pnpm-workspace.yaml` is created in **that app folder** with:

- `packages: ['.']`
- `overrides:`
  - **Private packages** → `link:` to local paths.
  - **Normalized versions** → from `src/playbook/catalog/pnpm-normalized-versions.json`.

Install runs with:

```bash
pnpm install --ignore-scripts --no-lockfile --store-dir=target/.pnpm-store
```

The file is **removed afterwards**.

### 5) Safety patches

- Root `packageManager` is **temporarily removed** during PNPM installs and then **restored** (`package-manager-utils`).
- React & co. can be normalized via `pnpm-react-critical-deps.json`.
- `pnpm-config-manager.patchVitestConfig()` optionally injects `resolve.dedupe` with a default list when present.

### 6) Yarn lifecycle hooks

- **Preinstall** → `updateRootWorkspacesToYarnOnly()` to keep the root lockfile sane.
- **Postinstall** → bootstraps PNPM, builds private packages, installs PNPM apps via the local PNPM, then **clears** merged workspaces (idempotent cleanup).

> Hooks are provided as binaries in this package:  
> `src/manager-pm-preinstall.js` and `src/manager-pm-postinstall.js`.

---

## CLI Reference

### Apps and Modules Support

Both **applications** and **modules** can be built, tested, or linted individually or in bulk, using a **pluggable task runner**.

| Scope           | Example Command                                      | Description                   |
|-----------------|------------------------------------------------------|-------------------------------|
| **Application** | `manager-pm --action build --app web`                | Build one app                 |
| **Module**      | `manager-pm --action build --module @scope/core-api` | Build one module              |
| **All**         | `manager-pm --action full-build`                     | Build all apps and modules    |

Each reference (`--app` or `--module`) may be:

- a **package name** (`@scope/name`)
- a **workspace path** (`packages/manager/core/api`)
- or a **bare folder name** (`web`, `request-tagger`)

### Binary

```bash
manager-pm --type pnpm --action <action> [--runner <turbo|nx|binary>] [options] [-- <passthrough>]
```

### Common flags

- `--type <pnpm>`: package manager type (future-proof, default: `pnpm`).
- `--action <name>`: command to run.
- `--runner <turbo|nx|binary>`: task runner to use (**default: `turbo`**).
- `--app <name|workspace|path>`: single-app operations (build/test/lint).
- `--module <name|workspace|path>`: single-module operations (build/test/lint).
- `--filter <expr>`: CI selector.
  - **Turbo (default runner):** forwarded to Turbo as-is (`--filter=...`).
  - **Nx (`--runner nx`):** Turbo-style filter is **normalized**:
    - `--filter="<project|path|glob>"` → converted to `--projects=<specifier>` (quotes removed, leading `./` stripped).
    - `--filter="...[base...head]"` (or `--filter="[base...head]"`) → interpreted as SCM range and triggers **affected mode** (`--base=<base> --head=<head>`).
    - `--filter="...[HEAD^1]"` (or `--filter="[HEAD^1]"`) → base=`HEAD^1`, head=`HEAD`.
    - If `--projects` is already provided, it takes precedence and `--filter` will **not** override it.
- `--base <ref>` / `--head <ref>`: SCM refs (Nx-oriented; also accepted by the wrapper).
  - If provided, they **force affected mode** for Nx CI actions.
  - They override SCM refs derived from `--filter="[base...head]"`.
- `--dry-run=json` / `--dry=json`: machine-readable planning mode.
  - **Turbo:** returns Turbo plan JSON (tasks + packages).
  - **Nx:** returns a JSON array of project names (from `nx show projects --json`).
- `--container`: hint for “start” (container mode).
- `--region <code>`: informational; surfaced in logs.
- `--version` / `-V`: print CLI version.
- `--silent`: suppress CLI logs, keep only raw tool output (Turbo/Nx/Lerna/etc.).

---

## Single app / module

```bash
# Build / Test / Lint one app (Turbo by default)
yarn manager-pm --type pnpm --action build --app packages/manager/apps/web
yarn manager-pm --type pnpm --action test  --app @ovh-ux/manager-web
yarn manager-pm --type pnpm --action lint  --app web

# Build / Test / Lint one app with Nx
yarn manager-pm --action build --app web --runner nx
yarn manager-pm --action test  --app web --runner nx

# Build / Test / Lint one module (Turbo)
yarn manager-pm --type pnpm --action build --module @ovh-ux/manager-core-api
yarn manager-pm --type pnpm --action test  --module packages/manager/core/api

# Build / Test / Lint one module with Nx
yarn manager-pm --action build --module @ovh-ux/manager-core-api --runner nx
yarn manager-pm --action test  --module packages/manager/core/api --runner nx

# Lint everything with Turbo (default)
yarn pm:lint

# Lint everything with Nx
yarn pm:lint --runner nx

# Fix + Nx
yarn pm:lint:fix --runner nx

# Single app, Turbo
yarn pm:lint:app --app web

# Single app, Nx
yarn pm:lint:app --app web --runner nx
```

Under the hood:

- **Turbo:**  
  `build/test` → `turbo run <task> --filter <pkg> --concurrency=1 --continue=always`
- **Nx:**  
  `build/test` → `nx run <project>:<task> --parallel=1`

Resolvers (`resolveApplicationBuildFilter` / `resolveModuleBuildFilter`) map `--app` / `--module` to:

- Turbo `--filter` expressions, or
- Nx project names / selectors, depending on the selected `--runner`.

---

## CI — Task runner passthrough (Turbo / Nx / …)

`buildCI` and `testCI` are generic CI entrypoints that delegate to the configured runner.

### Turbo

```bash
# Using --filter (Turbo)
yarn manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web
yarn manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/web --parallel

# Using extra Turbo flags directly (no need for a trailing `--`)
yarn manager-pm --action buildCI --filter=@ovh-ux/manager-web --graph
yarn manager-pm --action buildCI --filter=@ovh-ux/manager-web --color
```

Under the hood (Turbo):

```bash
turbo run build [extra turbo flags...]
turbo run test  [extra turbo flags...]
```

### Nx

When `--runner nx` is used, `buildCI` / `testCI` run Nx in one of **three modes** depending on your flags:

#### A) Default mode → `nx run-many`

```bash
# All projects (default)
yarn manager-pm --action buildCI --runner nx
yarn manager-pm --action testCI  --runner nx
```

Under the hood:

```bash
nx run-many --target=build --all [extra nx flags...]
nx run-many --target=test  --all [extra nx flags...]
```

If you provide `--projects=...` or `--all`, `manager-pm` **does not** inject `--all` again — it forwards your selection.

#### B) SCM / affected mode → `nx affected`

Affected mode is triggered by **either**:

- Turbo SCM filter:
  - `--filter="...[base...head]"` (or `--filter="[base...head]"`)
  - `--filter="...[HEAD^1]"` (or `--filter="[HEAD^1]"`)
- Or explicit:
  - `--base=<ref> --head=<ref>`

Examples:

```bash
# Turbo-style SCM filter (normalized for Nx)
yarn pm:build:ci --runner nx --filter="...[develop...origin/feat/MANAGER-123]"

# Explicit base/head (accepted by the wrapper)
yarn pm:build:ci --runner nx --base=develop --head=origin/feat/MANAGER-123
```

Under the hood:

```bash
nx affected --target=build --base=develop --head=origin/feat/MANAGER-123
```

#### C) Planning mode (`--dry-run=json` / `--dry=json`) → `nx show projects --json`

This is the Nx equivalent of Turbo’s `--dry-run=json`, meant for CI pipelines and `jq` parsing.

```bash
# Get affected projects as JSON (Nx)
yarn pm:build:ci --runner nx --dry-run=json --filter="...[develop...origin/feat/MANAGER-123]"
yarn -s pm:build:ci --silent --runner nx --dry-run=json --filter="...[develop...origin/feat/MANAGER-123]"
```

Under the hood:

```bash
nx show projects --json --with-target=build --affected --base=develop --head=origin/feat/MANAGER-123
```

✅ Output format (Nx planning mode): **JSON array of project names**.

#### Nx option normalization

To preserve Turbo-compatible pipelines, `manager-pm` normalizes some options when `--runner nx`:

- `--concurrency <n>` / `--concurrency=<n>` → `--parallel <n>` / `--parallel=<n>`
- `--filter=<path>` strips leading `./` (workspace-relative normalization)
- Turbo-only log flags are ignored for Nx:
  - `--output-logs`, `--log-order`, `--log-prefix`, `--log-level`

---

## Global actions

```bash
# Turbo (default runner)
yarn manager-pm --action full-build     # Build ALL apps + modules
yarn manager-pm --action full-test      # Test ALL apps + modules
yarn manager-pm --action full-lint      # Lint ALL apps + modules

# Nx
yarn manager-pm --action full-build --runner nx
yarn manager-pm --action full-test  --runner nx
```

- **Turbo:**  
  `turbo run build --concurrency=1 --continue=always`  
  `turbo run test  --concurrency=1 --continue=always`
- **Nx:**  
  `nx run-many --target=build --all --parallel=1`  
  `nx run-many --target=test  --all --parallel=1`

Other global commands (runner-agnostic / independent):

```bash
yarn manager-pm --action start          # Interactive app starter (region/container prompt)
yarn manager-pm --action docs           # Build @ovh-ux/manager-documentation docs
yarn manager-pm --action cli …          # Passthrough to @ovh-ux/manager-cli (with merged workspaces)
yarn manager-pm --action workspace --mode prepare|remove   # Prepare/Clear merged root workspaces

# Examples
yarn manager-pm --type pnpm --action cli migrations-status --type all
yarn manager-pm --type pnpm --action cli migrations-status --type all --help
yarn manager-pm --type pnpm --action cli migrations-status --type routes
```

---

## Module management (PNPM catalogs)

`manager-pm` also manages PNPM catalogs for private modules.

### Migrate a **Private Module** to PNPM

Private modules (e.g. `@ovh-ux/manager-core-*`, `@ovh-ux/manager-modules-*`) can be migrated to PNPM in **isolated mode** using the `--private` flag.  
This ensures that the module is also registered in the **private PNPM catalog** (`src/playbook/catalog/pnpm-private-modules.json`), allowing task runners and PNPM to correctly link local builds instead of fetching from the registry.

```bash
# Example: migrate a core module as private
yarn pm:add:module --module packages/manager/core/utils --private

# Alternative (by package name)
yarn pm:add:module --module @ovh-ux/manager-core-utils --private
```

**What happens under the hood:**

- Module is moved from **Yarn catalog → PNPM catalog**
- Critical dependencies are normalized (`react`, `vitest`, etc.)
- If `--private` is provided:
  - The module is automatically added to `pnpm-private-modules.json`
  - Its entry includes both task-runner and PNPM filters, for example:

    ```json
    {
      "turbo": "--filter @ovh-ux/manager-core-utils",
      "pnpm": "packages/manager/core/utils"
    }
    ```

  - This catalog is used by `manager-pm` to link local builds and exclude private packages from publishing or remote installs
- Artifacts are cleaned (`node_modules`, `dist`, `.turbo`)
- `yarn install` is executed automatically to restore merged catalogs
- The migration summary is displayed with next steps

### Roll Back a **Private Module** to Yarn

To revert a private module back to Yarn-managed mode:

```bash
yarn pm:remove:module --module packages/manager/core/utils --private
# or
yarn pm:remove:module --module @ovh-ux/manager-core-utils --private
```

**Behavior:**

- Module is moved from **PNPM → Yarn catalog**
- PNPM artifacts (`dist`, `.turbo`, `node_modules`) are cleaned
- If `--private` is provided:
  - The entry is **removed** from `pnpm-private-modules.json`
- Yarn workspaces are restored
- A final cleanup banner confirms rollback success

### Private Catalog Overview

| Catalog                      | Path                                                  | Purpose                                                      |
|-----------------------------|-------------------------------------------------------|--------------------------------------------------------------|
| **PNPM Catalog**            | `src/playbook/catalog/pnpm-catalog.json`              | Tracks all PNPM-managed apps & modules                       |
| **Private Modules Catalog** | `src/playbook/catalog/pnpm-private-modules.json`      | Tracks all locally linked, non-published private packages    |
| **Yarn Catalog**            | `src/playbook/catalog/yarn-catalog.json`              | Tracks Yarn-managed apps & modules                           |

Private modules listed in `pnpm-private-modules.json` are automatically:
- Linked as `link:` dependencies for PNPM apps
- Excluded from npm registry publishing
- Available as Turbo/Nx selectors for incremental builds
- Built locally from their `dist/` outputs during `postinstall`

Example private catalog entry:

```json
[
  {
    "turbo": "--filter @ovh-ux/manager-core-application",
    "pnpm": "packages/manager/core/application"
  },
  {
    "turbo": "--filter @ovh-ux/manager-core-utils",
    "pnpm": "packages/manager/core/utils"
  }
]
```

---

## Global CI & Workflows

### Build / Test everything

```bash
# Uses a merged view of Yarn+PNPM catalogs for the task runner
yarn manager-pm --type pnpm --action full-build
yarn manager-pm --type pnpm --action full-test
yarn manager-pm --type pnpm --action full-lint

# Or with Nx
yarn manager-pm --type pnpm --action full-build --runner nx
yarn manager-pm --type pnpm --action full-test  --runner nx
```

### CI with fine-grained filters

```bash
# Turbo (default)
yarn manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web --cache-dir=.turbo
yarn manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/web --continue=always

# Nx (build/test execution)
yarn manager-pm --type pnpm --action buildCI --runner nx --parallel=4
yarn manager-pm --type pnpm --action testCI  --runner nx --projects=web,account --parallel=3

# Nx (planning / changed projects)
yarn manager-pm --type pnpm --action buildCI --runner nx --dry-run=json \
  --filter="...[develop...origin/${GIT_BRANCH}]"
```

---

## Adding dependencies

Because the monorepo runs **Yarn at the root** and **PNPM per-app**, you must follow a strict workflow so the two stay in sync:

1. **Manually edit the app's `package.json`**  
   Add your new dependency (`dependencies` / `devDependencies`) directly in the target app folder, e.g.:

   ```json
   {
     "dependencies": {
       "lodash": "^4.17.21"
     }
   }
   ```

2. **Run `yarn install` from the root:** this updates the root lockfile and triggers `manager-pm` hooks to:
- normalize versions
- rebuild PNPM overrides
- re-install PNPM apps if necessary

3. **Verify**
- For Yarn apps: `yarn workspace <app> why <dep>`
- For PNPM apps: `manager-pm --type pnpm --action build --app <app>`

---

### ⚠️ Warning about `yarn add`

- Running `yarn add` **does trigger** the same `preinstall` / `postinstall` hooks as a full `yarn install`.
- This means it *can* keep Yarn and PNPM in sync — but with caveats:
  - Yarn still defaults to adding dependencies at the **root workspace**, not the target app.
  - Hooks cannot distinguish between *install* and *add*, so catalogs/overrides may not update correctly in all cases.
- To avoid inconsistencies, prefer the **manual edit + `yarn install`** workflow described above.
- If you do use `yarn add`, always double-check that:
  - the dependency was added to the **right `package.json`**, and
  - PNPM apps still re-installed correctly.

⚠️ `publish` and `release` **depend on repo-level scripts** under `scripts/`.

---

## Legacy Yarn Workspace (prepare/remove)

Since we're in hybrid phase and Yarn will eventually be removed, it's not recommended to use `yarn workspace`, but if you still require manipulating the **root Yarn workspace configuration**, `manager-pm` exposes a dedicated `workspace` action with two modes: `prepare` and `remove`.

### Commands

```bash
# Prepare legacy workspaces (merge PNPM+Yarn catalogs into root)
yarn pm:prepare:legacy:workspace

# Remove legacy workspaces (clear merged entries, restore root)
yarn pm:remove:legacy:workspace
```

### What happens

- **Prepare (`--mode prepare`)**  
  Calls `updateRootWorkspacesFromCatalogs()`  
  → merges Yarn + PNPM catalogs into `package.json > workspaces.packages` at the root, so Turbo/Nx can see **all apps** at once.

- **Remove (`--mode remove`)**  
  Calls `clearRootWorkspaces()`  
  → clears the merged workspace entries, restoring the root `package.json` to its safe Yarn-only state.

### When to use

- Use `prepare` **before running full builds/tests** if you suspect missing workspaces in the task runner.
- Use `remove` **after builds/tests** or when cleaning up lockfile issues.
- Both are safe to run multiple times; operations are idempotent.

### Package.json integration

These are already aliased in the root `package.json`:

```json
{
  "scripts": {
    "pm:prepare:legacy:workspace": "manager-pm --action workspace --mode prepare",
    "pm:remove:legacy:workspace": "manager-pm --action workspace --mode remove"
  }
}
```

---

## Silent & Machine-Readable Mode

By default, `manager-pm` logs version, context, and execution details (useful for humans).

When automating tasks (e.g., in CI/CD pipelines or JSON parsers), you can suppress these logs with `--silent`.

### Behavior

| Mode | Output | Use Case |
|------|--------|----------|
| Default (verbose) | Context summary, logs, task info | Local debugging, interactive runs |
| `--silent` | Only raw tool output (Turbo, Nx, Lerna, etc.) | Parsing JSON or feeding results to `jq`, `grep`, etc. |
| `yarn -s` + `--silent` | Fully quiet Yarn + CLI output | Machine-readable pipelines |

### Examples

```bash
# Normal verbose mode
yarn manager-pm --action lerna list --all --json --toposort

# Silent mode (no context logs)
yarn manager-pm --silent --action lerna list --all --json --toposort

# Combine with Yarn’s -s for complete silence
yarn -s manager-pm --silent --action lerna list --all --json --toposort | jq -r '.[].name'
```

### Machine-readable CI planning (`--dry-run=json` / `--dry=json`)

`manager-pm` supports a runner-agnostic “planning” switch used in CI pipelines.

- **Turbo:** `--dry-run=json` returns Turbo plan JSON (tasks + packages).
- **Nx:** `--dry-run=json` returns a JSON array of project names (from `nx show projects --json`).

Examples:

```bash
# Turbo (default runner): list changed packages
yarn -s manager-pm --silent --action buildCI --dry-run=json --output-logs=none \
  --filter="...[${CDS_BUILD_BASE_BRANCH}...origin/${GIT_BRANCH}]" \
  | jq -r '.packages[]'

# Nx: list changed projects (array)
yarn -s manager-pm --silent --runner nx --action buildCI --dry-run=json \
  --filter="...[${CDS_BUILD_BASE_BRANCH}...origin/${GIT_BRANCH}]" \
  | jq -r '.[]'
```

### Notes

- Works with **all actions** (e.g., `lerna`, `cli`, `release`, `buildCI`, etc.).
- Internally switches logger to `silent` mode (`stderr` and `stdout` suppressed except raw tool output).
- Recommended for pipelines where you parse output, e.g.:

  ```bash
  PACKAGES=$(yarn -s manager-pm --silent --action lerna changed --all --json | jq -r '.[].name')
  ```

---

## ⚙️ Isolated Install for manager-pm (pm:isolated:install)

When you only need to use the **manager-pm CLI** — for example, in **CI/CD pipelines** or local debugging — running a full monorepo install (with PNPM hooks and Turbo rebuilds) is wasteful and slow.  
The **isolated install mode** solves this by installing dependencies *only for* `manager-pm`, skipping all other workspaces and scripts.

### Command

```bash
yarn pm:isolated:install
```

**Defined in `package.json`:**

```json
{
  "scripts": {
    "pm:isolated:install": "node packages/manager-tools/manager-pm/src/manager-pm-isolated-install.js"
  }
}
```

### What it does

1. Temporarily modifies the root `package.json` to include **only**:

   ```json
   {
     "workspaces": { "packages": ["packages/manager-tools/manager-pm"] }
   }
   ```

2. Runs:

   ```bash
   yarn install --ignore-scripts
   ```

   to install `manager-pm`’s dependencies **without** triggering any Yarn or PNPM lifecycle scripts.

3. Restores the original root workspace configuration afterward.

### Why this matters

| Scenario | Benefit |
|----------|---------|
| **CI/CD pipelines** | Speeds up runs where only `manager-pm` CLI is needed |
| **Developer onboarding** | Enables using `manager-pm` without waiting for full monorepo install |
| **Hotfix and release tooling** | Allows quick access to CLI scripts (publish, release, catalog sync) |
| **Offline or cached environments** | Avoids unnecessary dependency downloads |

---

## Continuous Delivery (CDS)

CDS jobs need three CI-friendly variables derived from a Git diff (base ref → head ref):

- **`AFFECTED_PKGS`**: affected workspace package names (typically `@ovh-ux/*`)
- **`PACKAGES_TO_BUILD`**: affected **application directories** under `packages/manager/apps/...`
- **`IMPACTED_UNIVERSES`**: a small universe list inferred from `PACKAGES_TO_BUILD` (e.g. `dedicated`, `public-cloud`, `telecom`, `web`)

`manager-pm` is the recommended entrypoint because it prepares/cleans the hybrid workspace (Yarn + PNPM catalogs, private package linking, per-app PNPM workspace, etc.) consistently before any runner executes.

### Turbo runner (reference)

Turbo remains the **reference planning format** because it produces a structured plan:

```bash
yarn -s manager-pm --silent --action buildCI --dry-run=json \
  --filter="...[${CDS_BUILD_BASE_BRANCH}...origin/${GIT_BRANCH}]"
```

The output is JSON containing (at least):

- `packages[]`: affected workspace package names
- `tasks[]`: planned tasks with `package` + `directory`

### CDS strict `PACKAGES_TO_BUILD` derivation

CDS historically used a stricter algorithm (`get_paths_changed_packages()`), which is **not** just “all tasks under `apps/`”.

The strict algorithm is:

1. take `.packages[]`
2. keep only entries that also exist in `.tasks[].package`
3. map those packages to their `.tasks[].directory`
4. keep only directories under `packages/manager/apps`

This is implemented in the validation suite (`yarn manager-pm-cds-validation`) and is the recommended reference for CDS exports.

### Nx runner (optional)

With `--runner nx`, `--dry-run=json` commonly returns a JSON array produced by `nx show projects --json`:

```bash
yarn -s manager-pm --silent --runner nx --action buildCI --dry-run=json \
  --filter="...[${CDS_BUILD_BASE_BRANCH}...origin/${GIT_BRANCH}]"
```

Because Nx planning output is usually **project identifiers**, CDS must translate `project -> root directory`. Two safe approaches:

#### Option A — per-project root lookup (pure shell)

```bash
CHANGED_PROJECTS=$(
  yarn -s manager-pm --silent --runner nx --action buildCI --dry-run=json \
    --filter="...[${CDS_BUILD_BASE_BRANCH}...origin/${GIT_BRANCH}]"
)

echo "$CHANGED_PROJECTS" | jq -r '.[]' | while read -r project; do
  yarn -s nx show project "$project" --json | jq -r '.root'
done | grep -E '^packages/manager/apps/'
```

#### Option B — use the built-in normalization from `manager-pm-cds-validation`

`yarn manager-pm-cds-validation` runs Nx planning in two ways (`--filter` and `--base/--head`) and **normalizes** Nx output into a Turbo-like schema by mapping:

- exact workspace `package.json` names → directory
- folder-name fallback when Nx uses folder-style IDs
- `packages/...` “path-like” IDs (when returned)

This gives you the same downstream primitives (`packages[]` + `tasks[].directory`) to compute strict `PACKAGES_TO_BUILD`.

### Recommended CDS usage

- Use **Turbo dry-run** as the source of truth for exported variables.
- Run **`yarn manager-pm-cds-validation`** in CI to continuously validate:
  - Turbo dry-run schema stays parseable and stable
  - Nx planning is consistent across `--filter` and `--base/--head` (when Nx is enabled)
  - Nx/Turbo parity meets a configurable overlap threshold (so differences are detectable but not flaky)


#### CDS reference shell snippets (what the pipeline is doing)

These are the *canonical* CDS steps you quoted, mapped to the **manager-pm** workflows documented above.

**Turbo – get_changed_packages()**

```bash
# Preferred (no sed needed): keep output strictly JSON
yarn -s pm:build:ci \
  --filter="...[$CDS_BUILD_BASE_BRANCH...origin/${GIT_BRANCH}]" \
  --dry-run=json \
  --output-logs=none \
  > output.json

jq -r '.packages[]' output.json
```

> CDS historically used `sed '1,2d'` / `sed '$d'` to strip log wrappers.  
> If you keep `--silent` (`-s`) + `--output-logs=none` (or use `manager-pm --silent`), you typically get **pure JSON** and can drop the `sed` step.

**Nx – equivalent “affected projects” list**

```bash
yarn nx show projects   --affected   --base=origin/develop   --head=origin/feat/MANAGER-20638-nx   --with-target=build   --json
```

With manager-pm this is what `--runner nx --action buildCI --dry-run=json` is meant to produce (an array of project identifiers), which we then **normalize** into `{packages,tasks}` for downstream CDS checks.

**Turbo – get_paths_changed_packages() (strict PACKAGES_TO_BUILD)**

```bash
# list1 = tasks[].package
jq -r '.tasks[].package' output.json > /tmp/list1.txt

# list2 = packages[]
jq -r '.packages[]' output.json > /tmp/list2.txt

# intersection(list2, list1) -> directories under packages/manager/apps
while read -r pkg; do
  if grep -qw "$pkg" /tmp/list1.txt; then
    jq -r --arg package "$pkg" '.tasks[] | select(.package == $package) | .directory' output.json |
      grep '^packages/manager/apps'
  fi
done < /tmp/list2.txt
```

This is exactly what the validation suite’s `computePathsChangedPackages()` function mirrors.

#### CDS debug vs quiet execution (per-package builds)

CDS often runs builds in two modes:

```bash
if DEBUG; then
  yarn pm:build:ci --filter="${package_name}..." --output-logs="new-only"
else
  yarn pm:build:ci --filter="${package_name}..." &> /dev/null
fi
```

Equivalent knobs with manager-pm:
- `--silent` (or `yarn -s …`) for quiet mode
- `--output-logs=new-only` (Turbo) when you want actionable logs without the full noise

#### CDS: upload “packages to deploy” list + release step

**Produce a deploy list from Lerna changed**

```bash
packages=$(
  yarn -s manager-pm --silent --action lerna changed --all -l --json |
    jq -r '.[].name'
)

printf "%s
" "$packages" > packages_to_deploy.txt

if is_ci; then
  worker upload --tag="list-packages" packages_to_deploy.txt
fi

rm -f packages_to_deploy.txt
```

**Run the release action (seeded)**

```bash
yarn -s manager-pm --silent --action release "${opts}" -s "${CDS_APP_CODENAME_SEED}"
```

---

## Typical workflows

### Migrate an application to PNPM

```bash
yarn pm:add:app --app <name|package|path>
yarn install
```

What happens:
- App is moved from **Yarn catalog** → **PNPM catalog**
- React/test deps normalized; Vitest config patched if needed
- App is cleaned (`node_modules`, `dist`, `.turbo`)
- PNPM binary bootstrapped, private packages built+linked
- Per-app `pnpm-workspace.yaml` generated and **PNPM install** executed
- Root workspaces restored

### Roll back an application to Yarn

```bash
yarn pm:remove:app --app <name|package|path>
yarn install
```

- App is moved back to **Yarn catalog**
- PNPM leftovers cleaned; root restored

---

## Configuration knobs (`src/playbook/playbook-config.js`)

- **`managerRootPath`** – auto-resolved to the monorepo root.
- **`pnpmVersion`** – `10.17.0` (pinned).
- **`pnpmBinaryPath`** – target folder for the downloaded PNPM.
- **`privateWorkspaces`** – roots scanned for private packages to build & link.
- **`applicationsBasePath`** – where apps are discovered (default: `packages/manager/apps`).
- **`cleanupDirectories`** – folders removed during clean (`node_modules`, `dist`, `.turbo`, `target`).
- **`containerPackageName`** – used by the interactive `start` action (e.g., `@ovh-ux/manager-container-app`).

To change behavior, update this file and commit.

---

## 🧽 Deep Cleanup Command

When you need to **reset the entire monorepo** (for example after failed installs, corrupted lockfiles, or migration issues), you can use the built-in deep cleanup script.

### Command

```bash
yarn clean:deep
```

This runs:

```bash
node ./packages/manager-tools/manager-pm/src/manager-pm-deep-clean.js
```

### What it does

- Recursively removes:
  - `node_modules`
  - `dist`
  - `.turbo`
  - `target`
- Works cross-platform (Linux, macOS, Windows)
- Uses **shelljs** internally for fast traversal
- Logs progress through `manager-pm`’s unified `logger`
- Gracefully exits if `node_modules` (and thus `shelljs`) is already missing — with helpful reinstall instructions.

---

## 🧩 Validation Tests

The validation suite is designed to prevent regressions while we support:
- Hybrid Yarn + PNPM catalogs
- Multi-runner orchestration (Turbo default, Nx optional)
- Machine-readable CI planning (`--dry-run=json`)

### `yarn validate:cli`

Runs a comprehensive CLI + catalog test matrix:

**Turbo (default runner)**
- `buildCI`, `testCI` (verbose + silent)
- `--dry-run=json` produces valid Turbo JSON
- workspace prepare/remove safety checks

**Nx (`--runner nx`)** — auto-detected and skipped if Nx is not available
- `--dry-run=json` maps to `nx show projects --json`
- Turbo-style SCM filters `--filter="...[base...head]"` map to Nx affected selection (`--base/--head`)
- explicit `--base/--head` forces affected mode
- `--concurrency` maps to `--parallel`
- directory filters normalize `./path` → `path`
- Turbo-only logging flags are not forwarded to Nx
- `.nx` cache directory existence after execution

It also validates:
- PNPM/Yarn catalogs path existence
- private module catalog integrity (`pnpm-private-modules.json`)
- duplicate detection across catalogs
- critical private modules presence

✅ The suite is intentionally runner-parity focused: it checks that the wrapper produces the expected runner command shape and outputs remain parseable under `--silent` + `jq`.


### `yarn manager-pm-cds-validation`

Runs an **end-to-end simulation of the CDS “changed packages” logic** and validates that hybrid orchestration remains deterministic across runners.

What it validates:

- `manager-pm` executable is available (`--version`)
- **Turbo planning** (`buildCI --dry-run=json`) can be parsed and contains `packages[]` + `tasks[]`
- **Nx planning** is executed when available (`--runner nx`) using:
  - SCM filter: `--filter="...[base...head]"`
  - explicit refs: `--base=<base> --head=<head>`
- Nx output is normalized into a Turbo-like schema so the same downstream checks can run
- Computes CDS-equivalent variables:
  - `AFFECTED_PKGS`
  - `PACKAGES_TO_BUILD`
    - **loose**: any `tasks[].directory` under `packages/manager/apps`
    - **strict (CDS)**: mirrors `get_paths_changed_packages()` (packages∩tasks.package → tasks.directory → apps-only)
  - `IMPACTED_UNIVERSES` (derived from `PACKAGES_TO_BUILD`)
- Ensures `dist/client` and universe folders can be created (CDS expectations)
- Writes CI-friendly artifacts:
  - **Snapshots** (for debugging / reproducibility) under `test-results/cds/`
  - **Reports** under `test-results/cds/reports/`:
    - `validation-results.json`
    - `validation-results.xml` (JUnit)

#### Parity & consistency model (Turbo vs Nx)

Nx and Turbo can legitimately differ when Nx does **not** model all workspaces as projects (or when targets are missing).  
So the suite uses a configurable parity model:

- **`overlap`** (recommended): require a minimum overlap coverage between sets  
  `coverage = |A ∩ B| / min(|A|,|B|)`
- **`subset`**: require `Nx ⊆ Turbo` (strict; can fail depending on runner semantics)
- **`equal`**: require `Nx == Turbo` (very strict)

Nx is also run twice (`--filter` and `--base/--head`) and checked for **internal consistency** using the same overlap metric.

All knobs are **constants inside the script** (no `process.env`, no CLI flags).  
Edit the `config` block at the top of:

- `packages/manager-tools/manager-pm/bin/manager-pm-cds-validation.js`

Key tuning options:

- `nxParity`: `'overlap' | 'subset' | 'equal'`
- `nxMinCoverage`: minimum overlap threshold (0..1) for parity checks
- `nxConsistencyMinCoverage`: minimum overlap between Nx(filter) and Nx(base/head)
- `baseBranch`, `gitBranch`: default refs used in the SCM range

Tip: If you want `equal` parity to pass consistently, ensure Nx discovers *all* relevant workspace packages as projects and each has the required targets (`build`, `test`, etc.) via `project.json` / `package.json` or Nx plugins.

---

## License

BSD-3-Clause (c) OVH SAS
