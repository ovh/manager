
# @ovh-ux/manager-pm — Hybrid Package Manager Orchestrator (Yarn + PNPM)

**manager-pm** enables a large monorepo to run **Yarn** and **PNPM** side‑by‑side during an incremental migration.
It keeps Yarn in control of legacy workspaces, bootstraps a **pinned** PNPM locally, installs PNPM‑migrated apps in isolation, and exposes unified dev/test/build commands over **both** catalogs (via Turbo and helper scripts).

This README documents the complete **working flow**, **execution model**, **architecture**, **configuration**, and **CLI commands**.

---

## Goals & Non‑Goals

### Goals
- Migrate app‑by‑app from **Yarn** to **PNPM** without breaking the monorepo.
- Keep Yarn’s lockfile and workflows stable for legacy apps.
- Install PNPM apps with a **local** PNPM (pinned version), **local** store, and **normalized** dependency versions.
- Provide repo‑wide `build`, `test`, `lint`, and `start` commands across **both** Yarn and PNPM apps.

### Non‑Goals
- Replacing the root package manager entirely — root remains Yarn‑driven during the migration.
- Maintaining a global PNPM installation on developer machines or CI images — PNPM is bootstrapped locally per repo/job.

---

## High‑Level Architecture

```
Root (Yarn)                                   PNPM (per app)
---------------------------                   --------------------------------
yarn preinstall
  └─ manager-pm pre-install
     └─ root workspaces.packages = Yarn-only

yarn install
  └─ Yarn sees & installs only Yarn apps

yarn postinstall
  └─ manager-pm post-install
     ├─ bootstrap PNPM (pinned → ./target/pnpm)
     ├─ build private packages (ensure dist/)
     ├─ link private packages into local PNPM store (./target/.pnpm-store)
     ├─ for each PNPM-catalog app:
     │    └─ create temp pnpm-workspace.yaml → pnpm install
     └─ restore root workspaces.packages = (Yarn ∪ PNPM) merged

developer tasks (merged view)
  ├─ manager-pm full-build → turbo run build
  ├─ manager-pm full-test  → turbo run test
  └─ manager-pm full-lint  → lint across merged view
```

**Key properties**
- Root stays Yarn‑driven; PNPM is **local** and used **only** for apps in the PNPM catalog.
- Root lifecycle scripts are **no‑ops under PNPM/NPM** (detected via `npm_config_user_agent`) — no recursion when running PNPM in a migrated app.
- After postinstall, `workspaces.packages` is restored to **merged** (Yarn ∪ PNPM) for Turbo and tooling.

---

## Repository Layout (package subset)

```
packages/manager-tools/manager-pm/
├── bin/manager-pm.js               # CLI entry
├── package.json                    # exposes "manager-pm" binary
├── src/
│   ├── manager-pm-preinstall.js    # Yarn preinstall wrapper (called by root scripts)
│   ├── manager-pm-postinstall.js   # Yarn postinstall wrapper (called by root scripts)
│   ├── playbook/
│   │   ├── catalog/
│   │   │   ├── yarn-catalog.json               # list of Yarn workspaces
│   │   │   ├── pnpm-catalog.json               # list of PNPM workspaces
│   │   │   └── pnpm-normalized-versions.json   # forced versions & link: overrides
│   │   └── pnpm-config.js          # constants: paths, versions, store, etc.
│   └── kernel/
│       ├── pnpm/
│       │   ├── pnpm-bootstrap.js        # downloads & verifies local PNPM binary
│       │   ├── pnpm-deps-manager.js     # yarnPreInstall/yarnPostInstall + installAppDeps
│       │   ├── pnpm-tasks-manager.js    # build/test/lint across merged view
│       │   └── pnpm-start-app.js        # interactive start (container/standalone)
│       └── commons/…                    # catalogs, logging, json, path, workspace utils
```

> **ESM vs CJS:** The sources use ESM `import` syntax. Ensure your repo is configured with `"type": "module"` at the package level, or rename the wrappers to `.mjs`. If you use CJS, convert imports to `require()`.

---

## Execution Flows

### 1) Root Yarn install (with PNPM post‑install)

1. **Preinstall (Yarn only)** → `yarnPreInstall()`
  - Reads the **Yarn catalog** (`src/playbook/catalog/yarn-catalog.json`).
  - Overwrites root `package.json` → `workspaces.packages = Yarn-only`.
  - Ensures `yarn install` never traverses PNPM apps.

2. **Yarn install** runs across the Yarn catalog only.

3. **Postinstall (Yarn only)** → `yarnPostInstall()`
  - **Bootstrap PNPM**: downloads a pinned binary to `./target/pnpm` and validates it.  
    Temporarily removes `packageManager` at root to avoid tooling conflicts; restores it afterward.
  - **Build private packages** (core/modules/components) so `dist/` exists.
  - **Link private packages** into the local PNPM store `./target/.pnpm-store`.
  - For each app in the **PNPM catalog**:
    - Create a **temporary `pnpm-workspace.yaml`** with:
      - `packages: ['.']`
      - `overrides`: merge of private `link:` overrides and **normalized versions**.
    - Run `pnpm install` in isolation (local store, no lockfile by default unless overridden).
    - Clean up temp files; restore `packageManager` even on error.
  - **Restore** root `workspaces.packages` to the **merged** view (Yarn ∪ PNPM).

> **Safety:** Consider a `try/finally` inside the postinstall flow to *always* restore merged workspaces even if a PNPM app install fails.

### 2) Per‑app PNPM install (inside a migrated app)

- Developer runs `pnpm install` inside the app folder.
- Root Yarn pre/post wrappers are **no‑ops** under PNPM; no recursion.

### 3) Unified build/test/lint (Turbo + helpers)

- **Build all apps:** `manager-pm --type pnpm --action full-build` → `turbo run build` over the merged view.
- **Test all apps:**  `manager-pm --type pnpm --action full-test`  → `turbo run test`.
- **Lint all apps:**  `manager-pm --type pnpm --action full-lint`  → runs configured lint scripts across the merged view.
- **Single app:** `--action build|test|lint --app <name|path>` determines the Turbo filter.

### 4) Interactive start (container or standalone)

- `manager-pm --type pnpm --action start` prompts for app/region and spawns:
  - **Container mode**:  
    `VITE_CONTAINER_APP=<appId> turbo run start --filter=@ovh-ux/manager-container-app` and  
    `CONTAINER=1 turbo run start --filter=<pkgName>`
  - **Standalone mode**:  
    `turbo run start --filter=<pkgName>`

---

## Configuration

**File:** `src/playbook/pnpm-config.js`

Key constants (adapt names/paths to your repo if they differ):

```js
export const pnpmVersion = "10.11.1";            // pinned PNPM
export const pnpmBinaryPath = "<repo>/target/pnpm";
export const pnpmExecutablePath = "<repo>/target/pnpm/pnpm";  // or pnpm.exe on Windows
export const pnpmStorePath = "<repo>/target/.pnpm-store";

export const managerRootPath = "<repo>";         // absolute path to repo root
export const rootPackageJsonPath = "<repo>/package.json";

// Catalog locations (make sure these point to 'catalog/', not 'apps/'):
export const yarnAppsPlaybookPath = "<repo>/packages/manager-tools/manager-pm/src/playbook/catalog/yarn-catalog.json";
export const pnpmAppsPlaybookPath = "<repo>/packages/manager-tools/manager-pm/src/playbook/catalog/pnpm-catalog.json";
export const normalizedVersionsPath = "<repo>/packages/manager-tools/manager-pm/src/playbook/catalog/pnpm-normalized-versions.json";

// Discovery and cleanup
export const privateWorkspaces = [
  "packages/manager/core",
  "packages/manager/modules",
  "packages/components"
];
export const cleanupDirectories = ["node_modules","dist",".turbo"];
export const applicationsBasePath = "packages/manager/apps";

// Optional
export const containerPackageName = "@ovh-ux/manager-container-app";
```

> **Important:** If these three paths point to the wrong place, Yarn preinstall may set an **empty** workspace list and PNPM postinstall may fail to load normalized versions:
> - `yarnAppsPlaybookPath`
> - `pnpmAppsPlaybookPath`
> - `normalizedVersionsPath`

---

## Catalogs

**Yarn catalog** — `src/playbook/catalog/yarn-catalog.json`  
List of Yarn‑managed workspaces, e.g.:
```json
[
  "docs",
  "packages/components/*",
  "packages/manager/apps/account"
]
```

**PNPM catalog** — `src/playbook/catalog/pnpm-catalog.json`  
List of PNPM apps (paths), e.g.:
```json
[
  "packages/manager/apps/zimbra"
]
```

**Normalized versions** — `src/playbook/catalog/pnpm-normalized-versions.json`  
Force `link:` and specific versions for PNPM installs, e.g.:
```json
{
  "@ovh-ux/manager-core-utils": "link:../../../packages/manager/core/utils",
  "@ovh-ux/manager-react-core-application": "link:../../../packages/manager/core/application",
  "some-external-lib": "1.2.3"
}
```

---

## CLI Reference

**Binary:** `manager-pm`  
**Entry:** `bin/manager-pm.js`

### Options
- `--type <type>`: Package manager type (currently `pnpm`).
- `--action <name>`: One of the actions listed below.
- `--app <name|path>`: Target application (package name, folder name, or workspace path).
- `--region <region>`: Region for `start` (default: `EU`).
- `--container`: Enable container mode for `start` (boolean).

### Actions

| Action         | Needs `--app` | Description |
|----------------|----------------|-------------|
| `bootstrap`    | no             | Download & validate the pinned PNPM binary (idempotent). |
| `add`          | yes            | Add an app (name or path) to the **PNPM** catalog (and remove from Yarn catalog). |
| `remove`       | yes            | Remove an app from the PNPM catalog (rollback to Yarn). |
| `install`      | yes            | Install dependencies for a PNPM-managed app (path or name). |
| `build`        | yes            | Build a single app via Turbo (merged view). |
| `test`         | yes            | Test a single app via Turbo (merged view). |
| `lint`         | yes            | Lint a single app (merged view). |
| `start`        | no             | Interactive app starter (prompts for app/region/container). |
| `pre-install`  | no             | Set root `workspaces.packages` to **Yarn-only** (for `yarn install`). |
| `post-install` | no             | Bootstrap PNPM → build+link privates → install PNPM apps → restore merged workspaces. |
| `full-build`   | no             | Build **all** apps across Yarn + PNPM catalogs. |
| `full-test`    | no             | Test **all** apps across Yarn + PNPM catalogs. |
| `full-lint`    | no             | Lint **all** apps across Yarn + PNPM catalogs. |
| `help`         | no             | Show help. |

### Examples

```bash
# Bootstrap PNPM (downloads to ./target/pnpm)
manager-pm --type pnpm --action bootstrap

# Move an app to PNPM flow
manager-pm --type pnpm --action add --app packages/manager/apps/zimbra

# Install PNPM deps for one app
manager-pm --type pnpm --action install --app packages/manager/apps/zimbra

# Build/test/lint one app
manager-pm --type pnpm --action build --app packages/manager/apps/zimbra
manager-pm --type pnpm --action test  --app packages/manager/apps/zimbra
manager-pm --type pnpm --action lint  --app packages/manager/apps/zimbra

# Build/test/lint everything
manager-pm --type pnpm --action full-build
manager-pm --type pnpm --action full-test
manager-pm --type pnpm --action full-lint

# Manually run lifecycle (debugging only)
manager-pm --type pnpm --action pre-install
manager-pm --type pnpm --action post-install
```

---

## Wiring The Root Scripts

You can integrate lifecycle hooks in this way:

**Root `package.json`:**
```jsonc
{
  "scripts": {
    "preinstall": "node ./packages/manager-tools/manager-pm/src/manager-pm-preinstall.js",
    "postinstall": "node ./packages/manager-tools/manager-pm/src/manager-pm-postinstall.js"
  }
}
```

---

## Developer Workflows

**Fresh clone**
```bash
yarn install
# Preinstall → Yarn-only workspaces
# Yarn install → legacy/Yarn apps
# Postinstall → PNPM bootstrap + per-app installs, merged workspaces restored
```

**Move an app to PNPM**
```bash
manager-pm --type pnpm --action add --app packages/manager/apps/<app>
yarn install
```

**Rollback an app to Yarn**
```bash
manager-pm --type pnpm --action remove --app packages/manager/apps/<app>
yarn install
```

**Start an app (interactive)**
```bash
manager-pm --type pnpm --action start
```

**Build/test/lint everything**
```bash
manager-pm --type pnpm --action full-build
manager-pm --type pnpm --action full-test
manager-pm --type pnpm --action full-lint
```
