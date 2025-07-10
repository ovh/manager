# ESLint Static Analysis Kit — Plugin Overview & Rule Index

This document provides a full breakdown of all ESLint plugins, rules, and conventions used in the `@ovh-ux/manager-static-analysis-kit`.

---

## 📦 Package Overview

```json
{
  "name": "@ovh-ux/manager-static-analysis-kit",
  "version": "x.x.x",
  "description": "A modular, extensible, and future-ready toolkit for defining, adapting, and sharing static analysis rules across projects in the `manager` monorepo."
}
```

---

## 🔌 Installed ESLint Plugins

### 🎯 Core ESLint

| Package         | Purpose                                |
|----------------|----------------------------------------|
| `eslint`        | Core linting engine                    |
| `@eslint/js`    | Base rule set for JS/TS                |
| `@eslint/css`   | CSS linting support                    |

---

### 🧱 Structure & Naming Enforcement

| Plugin                          | Description |
|----------------------------------|-------------|
| `eslint-plugin-check-file`      | File and folder naming rules |
| `eslint-import-resolver-typescript` | Type-aware path resolution for imports |

---

### 🧩 Code Style & Formatting

| Plugin / Tool                      | Description |
|------------------------------------|-------------|
| `prettier`                         | Formatter |
| `eslint-plugin-prettier`           | Runs Prettier as a lint rule |
| `eslint-config-prettier`          | Disables ESLint rules conflicting with Prettier |
| `@trivago/prettier-plugin-sort-imports` | Sorts imports automatically |
| `prettier-plugin-tailwindcss`      | Sorts Tailwind classes |

---

### 🧠 Language & Syntax

| Plugin                             | Description |
|-----------------------------------|-------------|
| `@typescript-eslint/eslint-plugin`| TypeScript lint rules |
| `@typescript-eslint/parser`       | TS parser for ESLint |
| `typescript-eslint`               | TypeScript rule tooling |
| `@types/eslint`, `@types/node`    | Type support |

---

### ⚛️ React & JSX

| Plugin                             | Description |
|-----------------------------------|-------------|
| `eslint-plugin-react`             | React best practices |
| `eslint-plugin-react-hooks`       | React Hook rules |
| `eslint-plugin-jsx-a11y`          | JSX accessibility |
| `eslint-plugin-storybook`         | Storybook-specific rules |

---

### 💨 Tailwind CSS

| Plugin                             | Description |
|-----------------------------------|-------------|
| `eslint-plugin-tailwindcss`       | Tailwind usage validation |
| `@types/eslint-plugin-tailwindcss`| Types for Tailwind plugin |
| `tailwind-csstree`                | Tailwind CSS AST analysis |

---

### 🔍 HTML & Templates

| Plugin                             | Description |
|-----------------------------------|-------------|
| `@html-eslint/eslint-plugin`      | HTML rules |
| `@html-eslint/parser`             | HTML parsing support |

---

### 🧪 Testing

| Plugin                             | Description |
|-----------------------------------|-------------|
| `@vitest/eslint-plugin`           | Vitest rules |

---

### 🧶 TanStack Query

| Plugin                             | Description |
|-----------------------------------|-------------|
| `@tanstack/eslint-plugin-query`   | Best practices for `tanstack-query` |

---

## 📁 Rule Modules

Available in `src/adapters/eslint/rules/`:

- `eslint-a11y.ts`
- `eslint-complexity.ts`
- `eslint-css.ts`
- `eslint-html.ts`
- `eslint-imports.ts`
- `eslint-javascript.ts`
- `eslint-naming-conventions.ts`
- `eslint-prettier.ts`
- `eslint-react.ts`
- `eslint-storybook.ts`
- `eslint-tailwind-jsx.ts`
- `eslint-tanstack.ts`
- `eslint-tests.ts`
- `eslint-typescript.ts`

---

## 📤 Package Export Map

```json
"exports": {
  ".": "./dist/code-analysis.js",
  "./eslint/config": "./dist/adapters/eslint/config/eslint-shared-config.js",
  "./eslint/storybook": "./dist/adapters/eslint/rules/eslint-storybook.js",
  "./eslint/a11y": "./dist/adapters/eslint/rules/eslint-a11y.js",
  "./eslint/complexity": "./dist/adapters/eslint/rules/eslint-complexity.js",
  "./eslint/css": "./dist/adapters/eslint/rules/eslint-css.js",
  "./eslint/html": "./dist/adapters/eslint/rules/eslint-html.js",
  "./eslint/imports": "./dist/adapters/eslint/rules/eslint-imports.js",
  "./eslint/javascript": "./dist/adapters/eslint/rules/eslint-javascript.js",
  "./eslint/naming-conventions": "./dist/adapters/eslint/rules/eslint-naming-conventions.js",
  "./eslint/prettier": "./dist/adapters/eslint/rules/eslint-prettier.js",
  "./eslint/react": "./dist/adapters/eslint/rules/eslint-react.js",
  "./eslint/tailwind-jsx": "./dist/adapters/eslint/rules/eslint-tailwind-jsx.js",
  "./eslint/tanstack": "./dist/adapters/eslint/rules/eslint-tanstack.js",
  "./eslint/tests": "./dist/adapters/eslint/rules/eslint-tests.js",
  "./eslint/typescript": "./dist/adapters/eslint/rules/eslint-typescript.js"
}
```

---

## 🧪 Custom CLI

```json
"bin": {
  "manager-lint": "./bin/lint.js"
}
```

You can run:

```bash
yarn manager-lint path/to/package
```

To lint using the shared ESLint configuration.

---

## 📜 License

BSD-3-Clause — © OVH SAS

---

## 🔧 Usage Options

### Option 1: Use the Full Shared Config

```ts
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;
```

### Option 2: Use Granular Configs

```ts
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';

export default [
  ...typescriptEslintConfig,
  ...a11yEslintConfig,
];
```

---

## 🚀 CLI Support

The package includes a dedicated CLI tool `manager-lint` with Flat Config support:

```json
{
  "scripts": {
    "lint": "manager-lint --config eslint.config.mjs ./src",
    "lint:fix": "manager-lint --fix --config eslint.config.mjs ./src"
  }
}
```

---

## 📁 File Naming Conventions

| Purpose        | Pattern                         | Format               |
|----------------|---------------------------------|----------------------|
| Component      | `*.component.tsx`               | `PASCAL_CASE`        |
| Hook           | `use*.ts`, `use*.tsx`           | `CAMEL_CASE`        |
| Hook Test      | `use*.spec.ts`, `use*.test.ts`  | `CAMEL_CASE`         |
| Test           | `*.spec.tsx`, `*.test.tsx`      | `PASCAL_CASE`        |
| Constants      | `*.constants.ts`                | `PASCAL_CASE`        |
| Types          | `*.type.ts`, `*.interface.ts`   | `PASCAL_CASE`        |
| Translations   | `Messages_en_GB.json`           | `SCREAMING_SNAKE_CASE` |
| Styles         | `*.css`, `*.scss`               | `KEBAB_CASE`         |
| Configs        | `*.config.ts`, `vite.config.ts` | `KEBAB_CASE`         |

---

## 🧼 React Best Practices

### 📛 One Component per File

We enforce **a single React component per file** to encourage modularity and readability.

This is implemented using:

```json
"react/no-multi-comp": ["error", { "ignoreStateless": false }]
```

This ensures both class and functional components are defined one per file.

---

## 📊 Complexity Rules Summary

| Rule                       | Target                  | Limit               |
|----------------------------|-------------------------|---------------------|
| `max-depth`               | Any block               | 4 levels            |
| `max-params`              | Function parameters     | 4 parameters        |
| `max-nested-callbacks`    | Callbacks               | 3 levels            |
| `complexity`              | Cyclomatic complexity   | 10–15 (context-based)|
| `max-lines`               | Per file                | 300 lines           |
| `max-lines-per-function`  | Function body           | 50–80 lines         |
