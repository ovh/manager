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
| `eslint-config-prettier`           | Disables ESLint rules conflicting with Prettier |
| `@trivago/prettier-plugin-sort-imports` | Sorts imports automatically |
| `prettier-plugin-tailwindcss`      | Sorts Tailwind classes |

---

### 🧠 Language & Syntax

| Plugin                             | Description |
|-----------------------------------|-------------|
| `@typescript-eslint/eslint-plugin`| TypeScript lint rules |
| `@typescript-eslint/parser`       | TS parser for ESLint |
| `@typescript-eslint/utils`        | TypeScript rule tooling |
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

| Module                         | Purpose                          |
|--------------------------------|----------------------------------|
| `eslint-a11y.ts`               | Accessibility rules              |
| `eslint-complexity.ts`         | Code complexity constraints      |
| `eslint-css.ts`                | Linting for stylesheets          |
| `eslint-html.ts`               | HTML linting rules               |
| `eslint-imports.ts`            | Import rules and conventions     |
| `eslint-javascript.ts`         | Generic JavaScript rules         |
| `eslint-naming-conventions.ts` | Folder/file naming enforcement   |
| `eslint-prettier.ts`           | Prettier integration             |
| `eslint-react.ts`              | React conventions and structure  |
| `eslint-storybook.ts`          | Storybook-specific lint rules    |
| `eslint-tailwind-jsx.ts`       | Tailwind inside JSX              |
| `eslint-tanstack.ts`           | Linting for TanStack Query usage|
| `eslint-tests.ts`              | Testing rules (e.g., Vitest)     |
| `eslint-typescript.ts`         | TypeScript-specific rules        |

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

To lint your codebase:

```bash
yarn manager-lint path/to/package
```

---

## 🔧 Usage Options

### ✅ Option 1: Full Shared Config

```ts
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;
```

### 🔀 Option 2: Progressive Adoption

```ts
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import { complexityJsxTsxConfig, complexityTsJsConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  cssEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
];
```

### ❌ Option 3: Override or Disable Rules

```ts
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/await-thenable': 'off'
    },
  },
];
```

**Disable all rules:**

```ts
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {},
  },
];
```

---

## 🚀 CLI Support

With Flat Config enabled, use the following script definitions:

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
| Hook           | `use*.ts`, `use*.tsx`           | `CAMEL_CASE`         |
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

We enforce **one React component per file** to encourage modularity and readability:

```json
"react/no-multi-comp": ["error", { "ignoreStateless": false }]
```

---

## 📊 Complexity Rules Summary

| Rule                      | Target                | Limit                  |
|---------------------------|------------------------|-------------------------|
| `max-depth`              | Any block             | 4 levels                |
| `max-params`             | Function parameters   | 4 parameters            |
| `max-nested-callbacks`   | Callbacks             | 3 levels                |
| `complexity`             | Cyclomatic complexity | 10–15 (context-based)   |
| `max-lines`              | Per file              | 300 lines               |
| `max-lines-per-function` | Function body         | 50–80 lines             |

---

## 📎 Related Links

- [TypeScript Config Guide](./README_tsconfig_static_analysis_kit.md)
- [Monorepo Guidelines](https://github.com/ovh/manager/tree/master/packages/manager)

---

## 📜 License

BSD-3-Clause — © OVH SAS
