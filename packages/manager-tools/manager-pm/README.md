manager-pm — Hybrid **PNPM + Yarn** Orchestration for Incremental Adoption

`manager-pm` enables a smooth, reversible migration where the monorepo keeps **Yarn** at the root while selected apps adopt **PNPM** in isolation. It manages catalogs of apps, patches configs safely, bootstraps a pinned PNPM binary, and gives you one CLI to build/test/lint across **both** worlds.

> Repo assumptions: applications live under `packages/manager/apps/*` and modules (public and private) under `packages/manager/{core,modules,tools}`, `packages/manager-ui-kit`, `packages/manager-wiki` and `packages/components`.

---

## Why this exists

- Keep the **root** (lockfile, scripts, Turbo) stable on Yarn.
- Migrate apps and modules **one by one** to PNPM with minimal blast radius.
- Run Turbo tasks across **all** apps by temporarily merging workspaces.
- Normalize risky deps (React, types, test stack) to prevent duplication conflicts.
- Stay reproducible by pinning a PNPM binary under `target/pnpm/`.

---

## Philosophy & Design Rationale

The approach is inspired by a simple migration principle:  
**separate workflows first, then unify when safe**.

- If you want to migrate from Yarn → PNPM, the naive approach is to split the repo into two completely separate spaces.
- Instead, `manager-pm` keeps **both Yarn and PNPM in the same workspace** and switches context cleverly:
  - When Yarn is needed → PNPM apps are removed from the root `package.json`.
  - When Turbo needs the full graph → PNPM apps are temporarily merged back.
- PNPM is kept **localized** (no hoisting) to avoid interference with Yarn.
- CI/CD pipelines remain unchanged because `manager-pm` hooks into Yarn's pre/post install lifecycle.
- Legacy `yarn exec turbo` is replaced with direct `yarn build` / `yarn turbo`.
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
      │   merge during Turbo ops                      │  temp workspace.yaml
      │                                               │  private deps linked
      │                                               │  react dedupe
      └───────────────────┬───────────────────────────┘
                          │
                  ┌───────▼────────┐
                  │   Turbo Graph  │
                  │  (merged view) │
                  └────────────────┘
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

- **No Disk Bloat**  
  React's code (or any package) is stored only once globally.
- **Dependency Isolation**  
  Each app has its own `node_modules` tree, avoiding hoisting conflicts and version leakage.
- **Runtime Behavior**  
  Each app may resolve its own React instance at runtime.
  - If apps are deployed independently, this is fine.
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
- `clearRootWorkspaces()` → empty the merged view (used after tasks / on finally blocks).

### 2) Pinned PNPM

- `src/playbook/playbook-config.js` pins PNPM to **`10.17.0`** and stores it under `target/pnpm`.
- `pnpm-bootstrap` downloads the right binary for the platform and verifies it with `pnpm --version`.

### 3) Private package linking

- `dependencies-utils.getPrivatePackages()` scans these workspace roots (configurable in `playbook-config`):
- `packages/manager/core`, `packages/manager/modules`, `packages/manager-tools`, `packages/components` (excluding this tool and the generator).  

Private packages are **built via Turbo** then **linked** (`link:` overrides) into each PNPM app’s *temporary* workspace file.

### 4) Per-app temporary `pnpm-workspace.yaml`

During PNPM install for a PNPM-app, a **temporary** `pnpm-workspace.yaml` is created in **that app folder** with:

- `packages: ['.']`
- `overrides:`
  - **Private packages** → `link:` to local paths.
  - **Normalized versions** → from `src/playbook/catalog/pnpm-normalized-versions.json`.

Install runs with:  

- `pnpm install --ignore-scripts --no-lockfile --store-dir=target/.pnpm-store` (at the repo root).  

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

Both **applications** and **modules** can now be built, tested, or linted individually or in bulk.

| Scope | Example Command | Description |
|--------|-----------------|--------------|
| **Application** | `manager-pm --action build --app web` | Build one app |
| **Module** | `manager-pm --action build --module @ovh-ux/manager-core-api` | Build one module |
| **All** | `manager-pm --action full-build` | Build all apps and modules |

Each reference (`--app` or `--module`) may be:
- a **package name** (`@scope/name`)
- a **workspace path** (`packages/manager/core/api`)
- or a **bare folder name** (`web`, `core-api`)

### Binary

```bash
manager-pm --type pnpm --action <action> [options] [--<passthrough>]
```

**Common flags**
- `--type <pnpm>`: package manager type (future-proof, default: `pnpm`).
- `--action <name>`: command to run.
- `--app <name|workspace|path>`: single-app operations (build/test/lint).
- `--module <name|workspace|path>`: single-module operations (build/test/lint).
- `--filter <expr>`: Turbo filter for CI commands.
- `--container`: hint for “start” (container mode).
- `--region <code>`: informational; surfaced in logs.
- `--version` / `-V`: print CLI version.

---

### Single app / module

```bash
# Build / Test / Lint one app
yarn manager-pm --type pnpm --action build --app packages/manager/apps/web
yarn manager-pm --type pnpm --action test  --app @ovh-ux/manager-web
yarn manager-pm --type pnpm --action lint  --app web

# Build / Test / Lint one module
yarn manager-pm --type pnpm --action build --module @ovh-ux/manager-core-api
yarn manager-pm --type pnpm --action test  --module packages/manager/core/api
yarn manager-pm --type pnpm --action lint  --module core-api
```

### CI — Turbo passthrough

```bash
# Using --filter
yarn manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web
yarn manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/docs... --parallel

# Using raw passthrough
yarn manager-pm --action buildCI --filter=@ovh-ux/manager-web --graph
yarn manager-pm --action testCI --filter=tag:unit --parallel
```

### Global

```bash
yarn manager-pm --action full-build     # Build ALL apps (uses merged workspaces)
yarn manager-pm --action full-test      # Test ALL apps
yarn manager-pm --action full-lint      # Lint ALL apps
yarn manager-pm --action start          # Interactive app starter (region/container prompt)
yarn manager-pm --action docs           # Build @ovh-ux/manager-documentation docs
yarn manager-pm --action cli ...        # Passthrough to @ovh-ux/manager-migration-cli (with merged workspaces)
yarn manager-pm --action workspace --mode prepare|remove   # Prepare/Clear merged root workspaces
```

Examples:

```bash
yarn manager-pm --action cli migrations-status --type all
```

### Publish & Release (delegates to repo scripts)

```bash
# Publish (scripts/publish.js)
yarn manager-pm --action publish --dry-run
yarn manager-pm --action publish --tag v1.2.3 --access public

# Release (scripts/release/release.sh)
yarn manager-pm --action release --dry-run
yarn manager-pm --action release --tag v1.2.3
yarn manager-pm --action release --conventional-prerelease --preid rc
```

> These commands **delegate to the repository’s** publishing/release tooling. Ensure `scripts/publish.js` and `scripts/release/release.sh` exist at the repo root.

### Lifecycle (wired by root package.json)

```bash
yarn manager-pm --action preinstall
yarn manager-pm --action postinstall
```

---

## Silent & Machine-Readable Mode

By default, `manager-pm` logs version, context, and execution details (useful for humans).  

When automating tasks (e.g., in CI/CD pipelines or JSON parsers), you can suppress these logs with `--silent`.

### Behavior
| Mode | Output | Use Case |
|------|---------|----------|
| Default (verbose) | Context summary, logs, task info | Local debugging, interactive runs |
| `--silent` | Only raw tool output (Turbo, Lerna, etc.) | Parsing JSON or feeding results to `jq`, `grep`, etc. |
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

---

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

---

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

---

### Example output

```
🚀 manager-pm pm:isolated:install CLI started...
📦 Isolated workspaces to: packages/manager-tools/manager-pm
✔ Dependencies installed for isolated modules.
🧹 Restored original root workspaces.
✅ manager-pm pm:isolated:install completed in 87.12s
✨  Done in 87.94s.
```

After the process:

- Only `packages/manager-tools/manager-pm/node_modules` exists.
- No `postinstall`, PNPM bootstrap, or Turbo tasks are triggered.
- The root `package.json` is automatically restored.

---

### Why this matters

| Scenario | Benefit |
|-----------|----------|
| **CI/CD pipelines** | Speeds up runs where only `manager-pm` CLI is needed |
| **Developer onboarding** | Enables using `manager-pm` without waiting for full monorepo install |
| **Hotfix and release tooling** | Allows quick access to CLI scripts (publish, release, catalog sync) |
| **Offline or cached environments** | Avoids unnecessary dependency downloads |

---

### Behavior summary

| Step | Description |
|------|--------------|
| 🧭 **Read** | Reads the current root `package.json` |
| ✏️ **Rewrite** | Sets `workspaces.packages = ['packages/manager-tools/manager-pm']` |
| 📦 **Install** | Runs `yarn install --ignore-scripts` |
| 🧹 **Restore** | Calls `clearRootWorkspaces()` to revert to the original configuration |

---

### Typical CI/CD usage

```bash
# Install only manager-pm dependencies
yarn pm:isolated:install

# Run manager-pm CLI immediately
yarn manager-pm --action buildCI --filter=@ovh-ux/manager-web --silent
```

This reduces setup time from 15+ minutes to under 2 minutes in large repos —  
ideal for quick CI runners, release automation, or script-driven catalog operations.

---

## Continuous Delivery (CDS)

In our previous workflow, Continuous Delivery jobs relied on **direct Lerna invocations** such as:

```bash
node_modules/.bin/lerna list   --all   --json   --toposort   | jq -r '.[].location | select(. | test("/packages/manager/apps"))'
```

This worked but bypassed the hybrid logic of `manager-pm`.  

Now, all Lerna calls should go **through `manager-pm`**, ensuring that catalogs and hybrid workspaces are prepared/cleaned consistently.

### New recommended usage

```bash
yarn -s manager-pm --silent --action lerna list --all --json --toposort --loglevel silent   | jq -r '.[].location | select(test("/packages/manager/apps"))'
```

Or equivalently:

```bash
node node_modules/.bin/manager-pm --silent --action lerna list --all --json --toposort --loglevel silent   | jq -r '.[].location | select(test("/packages/manager/apps"))'
```

Both commands guarantee:
- Correct workspace preparation/cleanup before and after the run.
- Silent Yarn headers/footers suppressed (so JSON remains parseable).
- Full passthrough of flags and options to **Lerna**.

### Passing arbitrary Lerna options

`manager-pm` exposes a **Lerna passthrough mode**, so you can use any existing Lerna subcommand:

```bash
# Help
yarn -s manager-pm --silent --action lerna --help

# Info
yarn -s manager-pm --silent --action lerna info  

# Version
yarn -s manager-pm --silent --action lerna -version

# List packages
yarn -s manager-pm --silent --action lerna list --all --json --toposort

# Publish from local versions
yarn -s manager-pm --silent --action lerna publish from-package --yes

# Version with conventional commits
yarn -s manager-pm --silent --action lerna version --conventional-commits
```

This ensures **CD pipelines and developers** use a single, unified CLI (`manager-pm`), regardless of whether the repo is Yarn-only, PNPM-only, or hybrid.

Example:

```bash
yarn -s manager-pm --silent --action lerna -version
5.6.2

yarn -s manager-pm --silent --action lerna info    
lerna notice cli v5.6.2
lerna info versioning independent

 Environment info:

  System:
  ...
  
yarn -s manager-pm --silent --action lerna list    
lerna notice cli v5.6.2
lerna info versioning independent
@ovh-ux/ng-at-internet-ui-router-plugin
@ovh-ux/ng-log-live-tail
@ovh-ux/ng-ovh-actions-menu
@ovh-ux/ng-ovh-browser-alert
...

```

### 🟡 Staging

#### Detect changed packages (apps only)

**Before**

```bash
PACKAGES_TO_BUILD=$(node_modules/.bin/lerna changed   --all   --include-merged-tags   --json --toposort   | jq -r '.[].location | select(. | test("/packages/manager/apps"))')
```

**Now**

```bash
PACKAGES_TO_BUILD=$(yarn -s manager-pm --silent --action lerna changed   --all   --include-merged-tags   --json --toposort   | jq -r '.[].location | select(test("/packages/manager/apps"))')
```

Example:

```bash
yarn -s manager-pm --silent --action lerna changed   --all   --include-merged-tags   --json --toposort   | jq -r '.[].location | select(test("/packages/manager/apps"))'

/packages/manager/apps/restricted
/packages/manager/apps/billing
/packages/manager/apps/carbon-calculator
/packages/manager/apps/carrier-sip
/packages/manager/apps/cda
/packages/manager/apps/cloud-connect
/packages/manager/apps/container
/packages/manager/apps/dbaas-logs
/packages/manager/apps/dedicated
/packages/manager/apps/email-domain
/packages/manager/apps/email-pro
/packages/manager/apps/exchange
/packages/manager/apps/freefax
/packages/manager/apps/iam
/packages/manager/apps/iplb
/packages/manager/apps/metrics
/packages/manager/apps/nasha
/packages/manager/apps/netapp
/packages/manager/apps/nutanix
/packages/manager/apps/order-tracking
/packages/manager/apps/overthebox
/packages/manager/apps/pci
/packages/manager/apps/pci-ai-tools
/packages/manager/apps/pci-databases-analytics
/packages/manager/apps/pci-dataplatform
/packages/manager/apps/procedures
/packages/manager/apps/public-cloud
/packages/manager/apps/sign-up
/packages/manager/apps/sms
/packages/manager/apps/support
/packages/manager/apps/telecom
/packages/manager/apps/telecom-dashboard
/packages/manager/apps/telecom-task
/packages/manager/apps/veeam-enterprise
/packages/manager/apps/vps
/packages/manager/apps/vrack
/packages/manager/apps/web
/packages/manager/apps/account
/packages/manager/apps/catalog
/packages/manager/apps/communication
/packages/manager/apps/dedicated-servers
/packages/manager/apps/hpc-vmware-public-vcf-aas
/packages/manager/apps/hub
/packages/manager/apps/hycu
/packages/manager/apps/identity-access-management
/packages/manager/apps/key-management-service
/packages/manager/apps/okms
/packages/manager/apps/pci-ai-endpoints
/packages/manager/apps/pci-billing
/packages/manager/apps/pci-block-storage
/packages/manager/apps/pci-cold-archive
/packages/manager/apps/pci-gateway
/packages/manager/apps/pci-instances
/packages/manager/apps/pci-kubernetes
/packages/manager/apps/pci-load-balancer
/packages/manager/apps/pci-object-storage
/packages/manager/apps/pci-private-network
/packages/manager/apps/pci-private-registry
/packages/manager/apps/pci-public-ip
/packages/manager/apps/pci-quota
/packages/manager/apps/pci-rancher
/packages/manager/apps/pci-savings-plan
/packages/manager/apps/pci-ssh-keys
/packages/manager/apps/pci-users
/packages/manager/apps/pci-volume-backup
/packages/manager/apps/pci-volume-snapshot
/packages/manager/apps/pci-vouchers
/packages/manager/apps/pci-workflow
/packages/manager/apps/sap-features-hub
/packages/manager/apps/veeam-backup
/packages/manager/apps/vrack-services
/packages/manager/apps/web-domains
/packages/manager/apps/web-hosting
/packages/manager/apps/web-office
/packages/manager/apps/web-ongoing-operations
/packages/manager/apps/zimbra
```

#### Search an existing app on the list

**Before**

```bash
app_path="$(node_modules/.bin/lerna list   --all   --parseable   --toposort   --long | grep ":${app}:" | cut -d: -f1)"
```

**Now**

```bash
app_path="$(yarn -s manager-pm --silent --action lerna list   --all   --parseable   --toposort   --long | grep ":${app}:" | cut -d: -f1)"
```

Example:

```bash
yarn -s manager-pm --silent --action lerna list   --all   --parseable   --toposort   --long | grep "zimbra" | cut -d: -f1

/packages/manager/apps/zimbra
```

### 🔵 Production

#### Changed packages on the release

**Before**

```bash
packages=$(node_modules/.bin/lerna changed --all -l --json | jq -r '.[].name')
```

**Now**

```bash
packages=$(yarn -s manager-pm --silent --action lerna changed --all -l --json | jq -r '.[].name')
```

Example:

```bash
yarn -s manager-pm --silent --action lerna changed --all -l --json | jq -r '.[].name'

@ovh-ux/manager-documentation
@ovh-ux/ng-at-internet-ui-router-plugin
@ovh-ux/ng-at-internet
@ovh-ux/ng-log-live-tail
@ovh-ux/ng-ovh-actions-menu
@ovh-ux/ng-ovh-browser-alert
@ovh-ux/ng-ovh-chart
@ovh-ux/ng-ovh-checkbox-table
@ovh-ux/ng-ovh-contact
...
```

#### Get changed package in build pipeline

**Before**

```bash
package_path=$(node_modules/.bin/lerna list -ap --scope="XXX")
```

**Now**

```bash
package_path=$(yarn -s manager-pm --silent --action lerna list -ap --scope="XXX")
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

---

### Roll back and application to Yarn

```bash
yarn pm:remove:app --app <name|package|path>
yarn install
```
- App is moved back to **Yarn catalog**
- PNPM leftovers cleaned; root restored

---

### Migrate a **Private Module** to PNPM

Private modules (e.g. `@ovh-ux/manager-core-*`, `@ovh-ux/manager-modules-*`) can now be migrated to PNPM in **isolated mode** using the `--private` flag.  
This ensures that the module is also registered in the **private PNPM catalog** (`src/playbook/catalog/pnpm-private-modules.json`), allowing Turbo and PNPM to correctly link local builds instead of fetching from the registry.

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
  - Its entry includes both Turbo and PNPM filters:
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

Example CLI output:
```bash
📦 Adding module: packages/manager/core/utils (private)
➕ Added @ovh-ux/manager-core-utils to PNPM catalog
🔒 Marking module as private in package.json
➕ Added private module to catalog: --filter @ovh-ux/manager-core-utils (packages/manager/core/utils)
✅ Migration complete
```

---

### Roll Back a **Private Module** to Yarn

To revert a private module back to Yarn-managed mode:

```bash
yarn pm:remove:module --module packages/manager/core/utils --private
```

or

```bash
yarn pm:remove:module --module @ovh-ux/manager-core-utils --private
```

**Behavior:**

- Module is moved from **PNPM → Yarn catalog**
- PNPM artifacts (`dist`, `.turbo`, `node_modules`) are cleaned
- If `--private` is provided:
  - The entry is **removed** from `pnpm-private-modules.json`
- Yarn workspaces are restored
- A final cleanup banner confirms rollback success

Example output:
```bash
🗑️  Removing module: packages/manager/core/utils (private)
🗑️  Removed private module from catalog: --filter @ovh-ux/manager-core-utils (packages/manager/core/utils)
✔ Rollback complete
```

---

### Private Catalog Overview

| Catalog | Path | Purpose |
|----------|------|----------|
| **PNPM Catalog** | `src/playbook/catalog/pnpm-catalog.json` | Tracks all PNPM-managed apps & modules |
| **Private Modules Catalog** | `src/playbook/catalog/pnpm-private-modules.json` | Tracks all locally linked, non-published private packages |
| **Yarn Catalog** | `src/playbook/catalog/yarn-catalog.json` | Tracks Yarn-managed apps & modules |

Private modules listed in `pnpm-private-modules.json` are automatically:
- Linked as `link:` dependencies for PNPM apps
- Excluded from npm registry publishing
- Available as Turbo filters for incremental builds
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

### Build / Test everything

```bash
# Uses a merged view of Yarn+PNPM catalogs for Turbo
yarn manager-pm --type pnpm --action full-build
yarn manager-pm --type pnpm --action full-test
yarn manager-pm --type pnpm --action full-lint
```

---

### CI with fine-grained filters

```bash
yarn manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web --cache-dir=.turbo
yarn manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/web --continue=always
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

⚠️ **Warning about `yarn add`**

- Running `yarn add` **does trigger** the same `preinstall`/`postinstall` hooks as a full `yarn install`.
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
  → merges Yarn + PNPM catalogs into `package.json > workspaces.packages` at the root, so Turbo can see **all apps** at once.

- **Remove (`--mode remove`)**  
  Calls `clearRootWorkspaces()`  
  → clears the merged workspace entries, restoring the root `package.json` to its safe Yarn-only state.

### When to use

- Use `prepare` **before running full builds/tests** if you suspect missing workspaces in Turbo.
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

## Configuration knobs (`src/playbook/playbook-config.js`)

- **`managerRootPath`**: auto-resolved to the monorepo root.
- **`pnpmVersion`**: `10.17.0` (pinned).
- **`pnpmBinaryPath`**: target folder for the downloaded PNPM.
- **`privateWorkspaces`**: roots scanned for private packages to build & link.
- **`applicationsBasePath`**: where apps are discovered (default: `packages/manager/apps`).
- **`cleanupDirectories`**: folders removed during clean (`node_modules`, `dist`, `.turbo`).
- **`containerPackageName`**: used by the interactive `start` action (`@ovh-ux/manager-container-app`).

To change behavior, update this file and commit.

---

## 🧽 Deep Cleanup Command

When you need to **reset the entire monorepo** (for example after failed installs, corrupted lockfiles, or migration issues), you can now use the built-in deep cleanup script.

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

### Example output

```
🧽 Starting deep cleanup...
🧹 Removing 145 'node_modules' directories...
   • packages/manager/apps/web/node_modules
   • packages/manager/core/utils/node_modules
   • packages/manager/modules/foo/node_modules
   ...and 142 more.
✅ Deep cleanup complete!
```

If dependencies were already removed:

```
⚠️  It looks like node_modules were already removed during a previous cleanup.

👉 Please reinstall dependencies:
   yarn install

Then re-run your command if needed:
   yarn clean:deep
```

### Typical usage

| Situation | Command | Purpose |
|------------|----------|----------|
| Full reset after migration | `yarn clean:deep && yarn install` | Clears all artifacts and restores clean PNPM/Yarn hybrid state |
| After branch switch | `yarn clean:deep` | Removes stale `.turbo` caches and mismatched modules |
| Before CI debugging | `yarn clean:deep` | Cleans up all build outputs and binary stores |
| Rebuild private packages from scratch | `yarn clean:deep && yarn build` | Forces complete rebuild from fresh state |

---

## 🧩 Validation Tests

Before any push, release, or migration, the **validation suite** ensures the hybrid ecosystem remains consistent, deterministic, and CI/CD-ready.

Two complementary validation commands exist:

| Command | Description | Purpose |
|----------|--------------|----------|
| `yarn manager-pm-validation` | Runs local integrity tests (catalogs, private package linking, version normalization, workspace safety) | Guarantees internal coherence |
| `yarn manager-pm-cds-validation` | Simulates Continuous Delivery (CDS) build pipeline with dry-run validation and report export | Guarantees CI/CD reproducibility |

---

### 1️⃣ `yarn manager-pm-validation`

Validates **local workspace integrity**:

- Catalog synchronization (Yarn, PNPM, Private)
- PNPM binary version pinning and availability
- Root workspace safety (Yarn + PNPM merged view)
- Private package linking and dependency normalization

✅ **Pass Criteria:**
All checks return “✅” in the final summary.

Example:
```
📊 Manager-PM Validation Summary
✅ Catalog integrity
✅ PNPM binary version 10.17.0
✅ Linked private modules
✅ Safe root workspaces state
🎉 All validation tests passed
```

---

### 2️⃣ `yarn manager-pm-cds-validation`

Performs a **full CDS pipeline simulation** — deterministic and CI-ready.

It runs from the repo root and executes the following sequence:

1. CLI sanity check (`manager-pm --version`)
2. Dry-run execution (`--action buildCI --dry-run=json`)
3. Validation of exported variables (`AFFECTED_PKGS`, `PACKAGES_TO_BUILD`, `IMPACTED_UNIVERSES`)
4. Universe folder and dist folder verification
5. Package existence validation across the entire monorepo
6. Snapshot persistence and cleanup
7. Structured report generation (`validation-results.json`, `validation-results.xml`)

📁 **Output directory:**
```
test-results/cds/reports/
 ├─ validation-results.json
 ├─ validation-results.xml
 └─ dry-run-snapshot.json
```

✅ **Pass Criteria:**
```
📊 CDS Validation Summary
✅ Passed: 13
❌ Failed: 0
🎉 All CDS validation tests passed successfully!
```

If any test fails, CI exits with code 1 and detailed failure information is available in the exported reports.

---

## 🧭 When to Run Validation Tests

| Scenario | Command | Purpose |
|-----------|----------|----------|
| Before merging any migration branch | `yarn manager-pm-cds-validation` | Ensure PNPM apps don’t break CDS pipelines |
| Before publishing a new release | `yarn manager-pm-validation` | Confirm catalogs and linking consistency |
| After refactoring `manager-pm` internals | Both | Detect regressions early |
| During CI/CD pipeline runs | `yarn -s manager-pm --silent --action buildCI` + `yarn manager-pm-cds-validation` | Reproducible build validation |

---

## ✅ Rule of Thumb

> If both `manager-pm-validation` and `manager-pm-cds-validation` pass from the repository root,  
> you are safe to **push, release, or evolve** the toolchain.

---

## License

BSD-3-Clause (c) OVH SAS
