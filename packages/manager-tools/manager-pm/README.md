# manager-pm — Hybrid **PNPM + Yarn** Orchestration for Incremental Adoption

`manager-pm` enables a smooth, reversible migration where the monorepo keeps **Yarn** at the root while selected apps adopt **PNPM** in isolation. It manages catalogs of apps, patches configs safely, bootstraps a pinned PNPM binary, and gives you one CLI to build/test/lint across **both** worlds.

> Repo assumptions: applications live under `packages/manager/apps/*` and private packages under `packages/manager/{core,modules,tools}` and `packages/components`.

---

## Why this exists

- Keep the **root** (lockfile, scripts, Turbo) stable on Yarn.
- Migrate apps **one by one** to PNPM with minimal blast radius.
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
- CI/CD pipelines remain unchanged because `manager-pm` hooks into Yarn’s pre/post install lifecycle.
- Legacy `yarn exec turbo` is replaced with direct `yarn build` / `yarn turbo`.
- Non-semver dependencies are overridden via **per-app temporary `pnpm-workspace.yaml`** instead of modifying apps directly.
- Private internal packages are built and **linked into PNPM’s store** to avoid registry fetches, ensuring fresh builds from `dist/`.
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
- In each project’s `node_modules/`, PNPM does **not copy files**. Instead:
  - A **hard link** (or symlink on Windows) is created from the store to `node_modules/.pnpm/...`.
  - A **symlink** is then created to expose the package at the expected path (e.g., `node_modules/react`).
- Result: even if 50 apps depend on `react@18.3.0`, React’s source files exist **only once in the store**.

### Isolated Mode (`node-linker=isolated`)
When using isolated mode (no hoisting):
- Each app (`appA/node_modules`, `appB/node_modules`) gets its own independent dependency tree.
- If both **App A** and **App B** depend on `react@18.3.0`:
  - PNPM stores React once globally.
  - Each app’s `node_modules` contains a hard link pointing to that same store location.
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

## How it works (concepts)

### 1) Catalogs (source of truth)
- **Yarn catalog**: `src/playbook/catalog/yarn-catalog.json`
- **PNPM catalog**: `src/playbook/catalog/pnpm-catalog.json`

An app lives in **one** catalog at a time. Migration = moving its workspace path between catalogs.

### 2) Dynamic root workspaces
During builds/tests, `manager-pm` **merges** Yarn+PNPM catalogs into `package.json > workspaces.packages`, runs Turbo, then **clears** them back. Yarn installs use the Yarn-only catalog. This keeps the root lockfile sane.

### 3) Pinned PNPM
A PNPM binary (version pinned in config) is downloaded to `target/pnpm/` and used for app installs. No global PNPM needed.

### 4) Private package linking
Private packages (e.g., `packages/manager/core/*`, `packages/manager/modules/*`, `packages/components/*`) are **built** then **linked** into a local PNPM store so apps can depend on them via `link:` overrides.

### 5) Per-app workspace overrides
For each PNPM app, a **temporary** `pnpm-workspace.yaml` is generated with:
- `packages: ['.']`
- `overrides:`
  - `link:` entries for private packages (relative paths)
  - normalized versions from `src/playbook/catalog/pnpm-normalized-versions.json`

**The file is removed after install.**

### 6) Safety patches
- React & friends are **normalized** (`pnpm-react-critical-deps.json`) to avoid duplicate Reacts and TS types.
- Vitest config is **patched** to `dedupe` critical deps when needed.
- Root `packageManager` field is temporarily **removed** during PNPM installs, then **restored**.

---

## CLI

### Binary
```
manager-pm --type pnpm --action <action> [options]
```

Supported actions:
- `build --app <name>` – build a single app
- `test --app <name>` – test a single app
- `lint --app <name>` – lint a single app
- `buildCI [--filter <expr>] [...]` – run `turbo run build` with passthrough options
- `testCI  [--filter <expr>] [...]` – run `turbo run test`  with passthrough options
- `start` – interactive runner (choose app/region/container)

Examples:
```bash
# Single app (by folder, package name, or shorthand)
manager-pm --type pnpm --action build --app packages/manager/apps/web
manager-pm --type pnpm --action test  --app @ovh-ux/manager-web
manager-pm --type pnpm --action lint  --app web

# CI-style with Turbo options (strict passthrough)
manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web --graph
manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/docs... --parallel

# Interactive dev
manager-pm --type pnpm --action start
```

### Yarn scripts (wrappers)
```bash
# Migrate an app to PNPM
yarn pm:add:app --app packages/manager/apps/web

# Roll back an app to Yarn
yarn pm:remove:app --app web
```

---

## Typical workflows

### Migrate an app to PNPM
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

### Roll back to Yarn
```bash
yarn pm:remove:app --app <name|package|path>
yarn install
```
- App is moved back to **Yarn catalog**
- PNPM leftovers cleaned; root restored

### Build / Test everything
```bash
# Uses a merged view of Yarn+PNPM catalogs for Turbo
manager-pm --type pnpm --action full-build
manager-pm --type pnpm --action full-test
manager-pm --type pnpm --action full-lint
```

### CI with fine-grained filters
```bash
manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web --cache-dir=.turbo
manager-pm --type pnpm --action testCI  --filter=packages/manager/apps/web --continue=always
```

---

## Adding dependencies

Because the monorepo runs **Yarn at the root** and **PNPM per-app**, you must follow a strict workflow so the two stay in sync:

1. **Manually edit the app’s `package.json`**  
   Add your new dependency (`dependencies` / `devDependencies`) directly in the target app folder, e.g.:

   ```json
   {
     "dependencies": {
       "lodash": "^4.17.21"
     }
   }
   ```

2. **Run `yarn install` from the root**  
   This updates the root lockfile and triggers `manager-pm` hooks to:
- normalize versions
- rebuild PNPM overrides
- re-install PNPM apps if necessary

3. **Verify**
- For Yarn apps: `yarn workspace <app> why <dep>`
- For PNPM apps: `manager-pm --type pnpm --action build --app <app>`

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

### ✅ Do / ❌ Don’t

| ✅ Do                                                                 | ❌ Don’t                                  |
|----------------------------------------------------------------------|------------------------------------------|
| Add deps manually to the app’s `package.json`                        | Run `pnpm add` inside an app              |
| Run `yarn install` at the **root** after editing deps                | Run `yarn add` or `pnpm add` directly     |
| Commit both `package.json` changes **and** updated `yarn.lock`       | Forget to update lockfile after changing  |
| Use `manager-pm` commands (`build`, `test`, `lint`) to verify        | Assume Yarn & PNPM auto-sync without root |

- ❌ Don’t use `yarn workspace`.
- ❌ Don’t use `yarn exec turbo` (legacy way to call Turbo).  
  ✅ Instead, run `yarn build`, `yarn test`, etc.

---

## File map (key parts)

- `bin/manager-pm.js` — Commander CLI
- `src/manager-pm-*.js` — Yarn hooks & wrappers (`preinstall`, `postinstall`, add/remove app)
- `src/kernel/commons/*` — logging, catalogs, JSON utils, workspace resolution
- `src/kernel/pnpm/*` — PNPM bootstrap, dependency manager, vitest patcher, tasks
- `src/playbook/catalog/*.json` — Yarn/PNPM app catalogs, normalized versions, critical deps
- `src/playbook/playbook-config.js` — paths, PNPM version, private workspace roots, cleanup dirs

---

## Troubleshooting

- **Turbo not found**: ensure `turbo` is available in the root (`devDependencies`) and on PATH during CI.
- **React duplication / invalid hooks**: run migration again (normalization & Vitest patch), or inspect overrides.
- **Stuck installs**: delete `target/pnpm/` and any lingering per-app `pnpm-workspace.yaml`, then retry.
- **Windows**: a `pnpm-win.exe` is bootstrapped automatically; ensure path permissions allow execution.
- If you see errors like *“Workspace not found in Turbo graph”* or *duplicate workspaces in lockfile*, run:

```bash
yarn pm:remove:legacy:workspace
yarn pm:prepare:legacy:workspace
```

This resets the root workspace view and ensures Turbo sees the right catalogs.

---

## Maintenance

- Update normalized versions in `src/playbook/catalog/pnpm-normalized-versions.json` when bumping shared deps.
- Update critical deps in `src/playbook/catalog/pnpm-react-critical-deps.json` if new React-family packages are introduced.
- Adjust private workspace roots in `src/playbook/playbook-config.js` if the repo layout changes.

---

## Security & safety notes

- The tool **restores** the root `packageManager` field and clears merged workspaces **even on failure**.
- Vitest config mutations are **idempotent** and minimal (only adding `dedupe` for critical deps).
- Catalog edits are atomic: invalid workspaces are rejected with logs.

---

## Future Migration Path

Once **all apps** migrate to PNPM:

- [ ] Replace all `yarn` commands with `pm` (custom manager).
- [ ] Remove legacy Yarn usage entirely from packages and scripts.
- [ ] Replace localized PNPM installs with a **single hoisted PNPM workspace**.
- [ ] Simplify CI/CD by removing compatibility hooks.

---

## License

BSD-3-Clause (c) OVH SAS
