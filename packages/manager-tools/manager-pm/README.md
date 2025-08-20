# 📦 Manager PM CLI (`manager-pm`)

The **Manager PM CLI** is a unified command-line tool designed to orchestrate package manager workflows in the OVH Manager monorepo.  
It provides a structured interface to bootstrap, install, build, lint, test, and start applications, with support for incremental **Yarn → PNPM migration**.

---

## 🚀 Why This CLI?

Historically, the monorepo used Yarn v1 workspaces with custom scripts.  
As part of the **incremental migration to PNPM**, we needed:

- A **single CLI entry point** to unify actions across package managers.
- **Incremental adoption**: keep Yarn at the root but allow apps to migrate one by one to PNPM.
- Reuse of **Turbo tasks** (`build`, `test`, `lint`, `start`) across both PMs.
- **App-scoped operations** (install deps, start app, etc.) without affecting the whole repo.
- **Automation** for Yarn ↔ PNPM compatibility (temporary workspace injection, cleanup).

---

## 🛠️ Installation

```bash
yarn install
```

The CLI binary is exposed as:

```bash
yarn manager-pm
```

---

## 📖 CLI Overview

```bash
yarn manager-pm --help
```

```
Usage: manager-pm [options]

Manager Package Manager CLI (incremental pnpm adoption)

Options:
  --type <type>     package manager type (pnpm)
  --action <name>   action (bootstrap|linkPrivates|add|remove|install|build|test|lint|start|help)
  --app <name>      Target app name (required for app-specific actions)
  -V, --version     output the version number
  -h, --help        display help for command
```

---

## ⚙️ Actions & How They Work

### 1. **Bootstrap**
```bash
yarn manager-pm --type pnpm --action bootstrap
```
- Installs the **PNPM binary** in `target/pnpm/`.
- Ensures reproducible, isolated PNPM setup.
- Logs installation with `consola`.

---

### 2. **Link Privates**
```bash
yarn manager-pm --type pnpm --action linkPrivates
```
- Scans all **internal private packages** (`packages/components`, `packages/manager/core`, `packages/manager/modules`).
- Creates **`link:` overrides** inside PNPM local store.
- Ensures that local apps resolve internal dependencies without publishing.

---

### 3. **Add App**
```bash
yarn manager-pm --type pnpm --action add --app zimbra
```
- Adds the app into PNPM workflow:
  - Generates a temporary `pnpm-workspace.yaml` with `packages: ['.']`.
  - Updates overrides/links for internal packages.
  - Writes `.npmrc` with local store config.

---

### 4. **Remove App**
```bash
yarn manager-pm --type pnpm --action remove --app zimbra
```
- Cleans up the app from PNPM workflow.
- Removes temporary workspace entries and overrides.

---

### 5. **Install**
```bash
yarn manager-pm --type pnpm --action install --app zimbra
```
- Creates an **isolated PNPM workspace** for the app.
- Runs:
  ```bash
  target/pnpm/pnpm install
  ```
- Ensures **hoisting rules** and **shared-workspace-lockfile=false** for app-local installs.

---

### 6. **Build**
```bash
yarn manager-pm --type pnpm --action build --app zimbra
```
- Runs:
  ```bash
  turbo run build --filter=./packages/manager/apps/zimbra...
  ```
- Uses our `getAppTaskCommand` utility:
  - Returns both the **command** and **description**.
  - Logs the executed command with `consola`.

---

### 7. **Test**
```bash
yarn manager-pm --type pnpm --action test --app zimbra
```
- Runs:
  ```bash
  turbo run test --filter=./packages/manager/apps/zimbra...
  ```
- Migration-aware:
  - Ensures app uses `manager-test` instead of legacy `vitest`.
  - Verifies no deprecated dependencies remain.

---

### 8. **Lint**
```bash
yarn manager-pm --type pnpm --action lint --app zimbra
```
- Runs:
  ```bash
  yarn lint:tsx -- --app zimbra
  ```
- Reuses our **static-analysis-kit** ESLint configs.
- Supports both legacy and modern linting setups.

---

### 9. **Start**
```bash
yarn manager-pm --type pnpm --action start --app zimbra
```

👉 **Interactive Mode**  
If `--region` and `--container` are not passed, prompts are shown:
- Select app (search list).
- Select region.
- Container or standalone.

👉 **Non-Interactive Mode**
```bash
yarn manager-pm --type pnpm --action start --app zimbra --region US --container
```

👉 Under the hood:
- Adds the app to Yarn workspaces temporarily (`addAppToYarnWorkspaces`).
- Starts the app via `turbo run start`.
- If container enabled:
  ```bash
  VITE_CONTAINER_APP=<appId> turbo run start --filter=@ovh-ux/manager-container-app
  CONTAINER=1 turbo run start --filter=zimbra
  ```
- After exit, removes the app from Yarn workspaces (`removeAppFromYarnWorkspaces`).

---

## 🔄 Internals & Utilities

- **`applicationsBasePath`** → centralized location for apps.
- **`getAvailableApps()`** → lists all apps with metadata (regions, name, packageName).
- **`getAppTaskCommand()`** → builds task command + description for logging.
- **`addAppToYarnWorkspaces` / `removeAppFromYarnWorkspaces`** → manage hybrid Yarn/PNPM state safely.
- **`loadJson<T>()`** → typed JSON reader for configs.

---

## 📌 Summary

With `manager-pm`, we now have:

- One CLI for **all package manager tasks**.
- **Migration-safe workflows**: Yarn stays at the root, PNPM works per-app.
- **Consistency**: all tasks (build, test, lint, start) unified under Turbo + Yarn wrappers.
- **Flexibility**: both interactive (prompts) and non-interactive (flags) supported.
- **Safety**: apps added/removed from Yarn dynamically, no leftover state.
