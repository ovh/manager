# manager-pm — Hybrid Yarn + PNPM orchestration for incremental adoption

**manager-pm** lets a large monorepo run **Yarn Classic** and **PNPM** side‑by‑side during a staged migration.  
It keeps Yarn in charge of its own apps, bootstraps a *pinned* PNPM locally for PNPM apps, and uses Turbo to build/test across **both** catalogs.

---

## Why this exists

Big repos rarely switch package managers all at once. You need to migrate app‑by‑app without breaking the world:

- Keep Yarn’s lockfile stable for legacy apps.
- Allow selected apps to be installed and built with PNPM (local store, overrides, linked privates).
- Run **Turbo** over *everything* as one graph.

`manager-pm` provides that hybrid runtime in a **repeatable** and **idempotent** way.

---

## High‑level flow

```text
yarn preinstall
  └─ manager-pm pre-install
     └─ root package.json.workspaces.packages = Yarn-only

yarn install
  └─ Yarn only sees/install Yarn apps

yarn postinstall
  └─ manager-pm post-install
     ├─ bootstrap PNPM (pinned binary → target/pnpm)
     ├─ build private packages (ensure dist/)
     ├─ link private packages into PNPM local store
     ├─ for each PNPM-catalog app:
     │    └─ installAppDeps(app) with a per-app temporary pnpm-workspace.yaml
     └─ restore root workspaces.packages = (Yarn ∪ PNPM) merged

developer tasks
  ├─ manager-pm full-build → turbo run build (merged)
  ├─ manager-pm full-test  → turbo run test  (merged)
  └─ manager-pm full-lint  → yarn lint:tsx   (merged)
```

---

## Features

- **Yarn‑only preinstall**: sets `workspaces.packages` to the Yarn catalog so Yarn won’t touch PNPM apps.
- **Local PNPM bootstrap**: downloads a pinned PNPM binary into `target/pnpm` (no global install required).
- **Private packages build + link**: builds internal packages (`dist/`) then links them into PNPM’s local store.
- **Per‑app PNPM installs**: each PNPM app installs with its own temporary `pnpm-workspace.yaml`:
  - `packages: ['.']`
  - `overrides` for normalized versions + `link:` overrides to private packages
  - local store at `target/.pnpm-store`
- **Merged workspace for Turbo**: after postinstall, root `workspaces.packages` becomes `(Yarn ∪ PNPM)` so `turbo` sees the entire graph.
- **Idempotent**: safe to run multiple times; temporary files and root `packageManager` field are restored.

---

## Requirements

- **Node.js:** `^22` (matches monorepo `engines.node`)
- **Yarn Classic:** `1.22.x`
- **Turbo:** `^2.5.2` (already a devDependency in the monorepo)
- **OS:** Linux/macOS (Windows works; see note under *Troubleshooting* regarding PNPM executable path)

---

## Install & wire‑up

Install `manager-pm` as a dev dependency in the **root** of your monorepo (via registry or a local workspace).  
Make sure the `manager-pm` binary is available to Yarn scripts.

Add these scripts to **root `package.json`**:

```jsonc
{
  "scripts": {
    "preinstall": "manager-pm --type pnpm --action pre-install",
    "postinstall": "manager-pm --type pnpm --action post-install",
    "pm:build": "manager-pm --type pnpm --action full-build",
    "pm:test": "manager-pm --type pnpm --action full-test",
    "pm:lint:tsx": "manager-pm --type pnpm --action full-lint",
    "pm:start": "manager-pm --type pnpm --action start"
  }
}
```

---

## Catalogs & configuration

`manager-pm` reads two catalogs and merges them into `workspaces.packages` when needed:

- **Yarn catalog**: list of Yarn‑managed workspace globs (e.g., legacy apps)
- **PNPM catalog**: list of PNPM‑managed workspace paths (e.g., modernized apps)

The catalog locations are provided by `getCatalogPaths()` in `src/kernel/commons/catalog-utils.ts`.  
If your paths differ from the defaults, update `getCatalogPaths()` accordingly.

**Private packages discovery**: `getPrivatePackages()` finds internal `private: true` packages (by default under `packages/manager/core`, `packages/manager/modules`, `packages/components`). Adjust if your layout changes.

**Normalized versions**: `installAppDeps()` can apply normalized/override versions (e.g., `src/playbook/pnpm-normalized-versions`). Add or remove entries as your constraints evolve.

---

## CLI usage

```bash
manager-pm --type pnpm --action <action> [--app <name-or-path>] [--region <code>] [--container]
```

**Options**
- `--type`: only `pnpm` is supported today.
- `--action`: one of the actions below.
- `--app`: when an action needs a target app, pass its **path** (recommended).
- `--region`: used by interactive `start` flow (default: `EU`).
- `--container`: run inside a container (boolean).

**Actions**

| Action         | Needs `--app` | What it does |
|----------------|----------------|--------------|
| `bootstrap`    | no             | Download & validate the pinned PNPM binary (idempotent). |
| `add`          | yes            | Add an app (by path or name) to the PNPM catalog. |
| `remove`       | yes            | Remove an app (by path or name) from the PNPM catalog. |
| `install`      | yes            | Install deps for a PNPM‑managed app (pass `--app` as **path**). |
| `build`        | yes            | Build a single app using Turbo (merged catalogs). |
| `test`         | yes            | Test a single app using Turbo (merged catalogs). |
| `lint`         | yes            | Lint a single app using the shared runner. |
| `start`        | no             | Interactively start an application (prompts). |
| `pre-install`  | no             | Set root `workspaces.packages` to **Yarn‑only** (so Yarn installs only its apps). |
| `post-install` | no             | Bootstrap PNPM → build+link privates → install PNPM apps → restore merged workspaces. |
| `full-build`   | no             | Build **all** apps across merged Yarn + PNPM catalogs. |
| `full-test`    | no             | Test **all** apps across merged Yarn + PNPM catalogs. |
| `full-lint`    | no             | Lint **all** apps across merged Yarn + PNPM catalogs. |

---

## Typical workflows

**Fresh clone**

```bash
yarn            # triggers preinstall/postinstall automatically
yarn pm:build   # turbo run build across merged catalogs
yarn pm:test    # turbo run test across merged catalogs
yarn pm:lint:tsx
```

**Migrate an app to PNPM**

```bash
# add an app to PNPM catalog (path or name, depending on your impl)
manager-pm --type pnpm --action add --app packages/manager/apps/zimbra

# ensure PNPM is ready and privates are linked
manager-pm --type pnpm --action bootstrap
manager-pm --type pnpm --action install --app packages/manager/apps/zimbra
```

**Develop**

```bash
# Single app flows (merged view still in effect after postinstall)
manager-pm --type pnpm --action build --app packages/manager/apps/zimbra
manager-pm --type pnpm --action test  --app packages/manager/apps/zimbra
manager-pm --type pnpm --action lint  --app packages/manager/apps/zimbra
```

---

## CI integration (example)

```yaml
steps:
  - run: yarn --frozen-lockfile
  - run: yarn pm:build
  - run: yarn pm:test
  - run: yarn pm:lint:tsx
```

---

## Contributing

- Core code: `src/kernel/pnpm/*`, `src/kernel/commons/*`, `src/playbook/*`, `bin/manager-pm.js`.
- Please write logs with `consola.start` → `consola.success` and prefer **single-process** invocations (aggregate filters) over N× shell loops.
- Keep temporary workspace files ephemeral and always restore `packageManager` on the root.

---

## License

BSD-3-Clause (same as the monorepo).
