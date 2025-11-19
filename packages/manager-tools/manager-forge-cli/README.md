# 🚀 Forge-CLI

**Forge-CLI** is the scaffolding tool for OVHcloud Manager.  
It creates fully structured *uApps* (Manager applications), generates typed building blocks inside existing apps, **and now forges fully-configured Manager modules** with automatic workspace registration.

Supported generators:

- ⚙️ Interactive **application generator** (`yarn generate:uapp`)
- 📦 **Module generator** (`yarn generate:module`)
- 🔌 **API client** generator
- 🎨 **Component** generator
- 🪝 **Hook** generator
- 📄 **Page** generator

All generators follow the OVHcloud Manager architecture, folder layout, and Static Analysis Kit rules.

---

## 📦 Installation & Context

This package is intended for the **OVHcloud Manager monorepo** and marked `"private": true`.

From the monorepo root:

```bash
yarn install
```

Registered commands:

```bash
yarn generate:uapp
yarn generate:uapp:api --app <appName> --api <ApiName>
yarn generate:uapp:component --app <appName> --component <ComponentName>
yarn generate:uapp:hook --app <appName> --hook <HookName>
yarn generate:uapp:page --app <appName> --page <PageName>
yarn generate:module
```

Underlying binaries:

```jsonc
"bin": {
  "manager-forge-application": "bin/manager-forge-application.mjs",
  "manager-forge-api": "bin/manager-forge-api.mjs",
  "manager-forge-component": "bin/manager-forge-component.mjs",
  "manager-forge-hook": "bin/manager-forge-hook.mjs",
  "manager-forge-page": "bin/manager-forge-page.mjs",
  "manager-forge-module": "bin/manager-forge-module.mjs"
}
```

---

## ⚡️ Commands Overview

### 1️⃣ Generate a new application (uApp)

```bash
yarn generate:uapp
```

Interactive prompts include:

- Application name
- Package name
- Description
- Regions
- Universes & tracking data
- Template-specific options

Forge-CLI then:

- Creates the application under `packages/manager/apps/`
- Copies templates
- Applies constants and replacements
- Registers the application in the workspace

---

### 2️⃣ Generate a new module (React or Node)

```bash
yarn generate:module
```

This creates:

```
packages/manager/modules/<moduleName>/
```

The interactive wizard asks:

- `moduleName` (kebab-case)
- `modulePackageName` (auto-generated)
- `moduleDescription`
- `isPrivate` (**supports both public and private modules**)
- `moduleType` (**React** or **Node**, fully handled automatically)

#### 🧠 Automatic Module Type Handling

The CLI **automatically configures**:

### ✅ React Modules
- React runtime dependencies
- `tsconfig/react-strict`
- `@tanstack/react-query` (+ devtools)
- React Router, i18next, translations
- MSW testing
- Modern ESLint config
- Vite configuration boilerplate

### ✅ Node Modules
- Minimal TypeScript environment
- `tsconfig/node-strict`
- Zero React deps
- Clean TS/lint/test pipeline

### Shared across both module types:
- `tsc` + `tsc-alias`
- `manager-lint` scripts
- `manager-test` integration
- `src/` and `__tests__/` structure
- `dist/` + typed outputs in `dist/types`

---

## 🗂 Automatic Workspace Integration (PNPM + Yarn Hybrid)

Forge-CLI **automatically registers every new module** into the workspace:

- Adds the module via `pm:add:module`
- Registers it into the **PNPM workspace** by default
- Updates **pnpm-catalog.json**
- Updates **pnpm-private-modules.json** when the module is private
- Ensures dependency normalization
- Ensures module discoverability in future builds

This means no manual workspace editing is ever required.

> ✔️ *React or Node*  
> ✔️ *Public or Private*  
> ✔️ *Workspace registration fully automated*

---

### 3️⃣ Generate an API client

```bash
yarn generate:uapp:api --app <appName> --api <ApiName>
```

Outputs:

```
packages/manager/apps/<appName>/src/data/<ApiName>.api.ts
```

---

### 4️⃣ Generate a component

```bash
yarn generate:uapp:component --app <appName> --component <ComponentName>
```

Outputs:

```
packages/manager/apps/<appName>/src/components/<ComponentName>.component.tsx
```

---

### 5️⃣ Generate a hook

```bash
yarn generate:uapp:hook --app <appName> --hook <HookName>
```

Outputs:

```
packages/manager/apps/<appName>/src/hooks/<HookName>.ts
```

---

### 6️⃣ Generate a page

```bash
yarn generate:uapp:page --app <appName> --page <PageName>
```

Outputs:

```
packages/manager/apps/<appName>/src/pages/<PageName>.page.tsx
```

---

## 🆘 Help System

All commands support:

```bash
-h
--help
```

---

## 🎛 Unified CLI Runner

Common behavior across all binaries:

- Screen clearing
- ASCII banner
- Spinner display
- Centralized help
- Standardized error handling

---

## 🧩 Architecture Overview

```
src/
  manager-forge-application.ts
  manager-forge-api.ts
  manager-forge-component.ts
  manager-forge-hook.ts
  manager-forge-page.ts
  manager-forge-module.ts

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
