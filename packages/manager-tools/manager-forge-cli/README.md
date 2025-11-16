# 🚀 Forge-CLI

**Forge-CLI** is the scaffolding tool for OVHcloud Manager.  
It creates fully structured *uApps* (Manager applications) and generates typed building blocks inside existing apps:

- ⚙️ Interactive **application generator** (`yarn generate:uapp`)
- 📦 **API client** generator
- 🎨 **Component** generator
- 🪝 **Hook** generator
- 📄 **Page** generator

All generators follow the OVHcloud Manager architecture, **folder layout**, and **linting / naming conventions** enforced by the Static Analysis Kit.

---

## 📦 Installation & Context

This package is meant to be used **inside the OVHcloud Manager monorepo** and is marked as `"private": true`.

From the monorepo root:

```bash
yarn install
```

Typical usage (wired at the monorepo level) is:

```bash
yarn generate:uapp
yarn generate:uapp:api --app <appName> --api <ApiName>
yarn generate:uapp:component --app <appName> --component <ComponentName>
yarn generate:uapp:hook --app <appName> --hook <HookName>
yarn generate:uapp:page --app <appName> --page <PageName>
```

Under the hood, these map to binaries exposed by this package:

```jsonc
"bin": {
  "manager-forge-application": "bin/manager-forge-application.mjs",
  "manager-forge-api": "bin/manager-forge-api.mjs",
  "manager-forge-component": "bin/manager-forge-component.mjs",
  "manager-forge-hook": "bin/manager-forge-hook.mjs",
  "manager-forge-page": "bin/manager-forge-page.mjs"
}
```

You can also invoke those binaries directly if needed:

```bash
yarn manager-forge-application
yarn manager-forge-api --app <appName> --api <ApiName>
…
```

---

## ⚡️ Commands Overview

### 1️⃣ Generate a new application (uApp)

```bash
yarn generate:uapp
```

This launches an **interactive wizard** powered by `enquirer`.

It will ask for:

- Application name (`appName`, typically kebab-case)
- NPM package name
- Description
- Universe / sub-universe / tracking level2
- Supported regions
- Template-related options (as defined in `manager-forge-prompts-config.ts`)

Forge-CLI then:

- Creates a new application under the **apps root** (`APPS_DIR` from `manager-forge-config.ts`)
- Copies the base template from the template directory
- Applies template replacements to: `package.json`, `src/Tracking.constants.ts` and `src/App.constants.ts`.
- Registers the new app in the workspace (via `addAppToWorkspace`).

---

### 2️⃣ Generate an API client

```bash
yarn generate:uapp:api --app <appName> --api <ApiName>
```

Creates:

```
packages/manager/apps/<appName>/src/data/<ApiName>.api.ts
```

### 3️⃣ Generate a component

```bash
yarn generate:uapp:component --app <appName> --component <ComponentName>
```

Creates:

```
packages/manager/apps/<appName>/src/components/<ComponentName>.component.tsx
```

### 4️⃣ Generate a hook

```bash
yarn generate:uapp:hook --app <appName> --hook <HookName>
```

Creates:

```
packages/manager/apps/<appName>/src/hooks/<HookName>.ts
```

### 5️⃣ Generate a page

```bash
yarn generate:uapp:page --app <appName> --page <PageName>
```

Creates:

```
packages/manager/apps/<appName>/src/pages/<PageName>.page.tsx
```

---

## 🆘 Help System

Every command supports:

```bash
--help
-h
```

---

## 🎛 Unified CLI Runner

Handles:

- Clearing screen
- Banner
- Spinner
- Help messages
- Error handling

---

## 🧩 Architecture Overview

```
src/
  manager-forge-application.ts
  manager-forge-api.ts
  manager-forge-component.ts
  manager-forge-hook.ts
  manager-forge-page.ts

  configs/
  helpers/
  types/
```

---

## 🧪 Development

```bash
yarn build
yarn lint:modern
yarn lint:modern:fix
yarn test
```

---

## 📝 License

BSD-3-Clause
