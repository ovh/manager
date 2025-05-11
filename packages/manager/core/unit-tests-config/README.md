# `@ovh-ux/manager-unit-tests-config`

> 🧪 Shared unit test configuration for OVHcloud Manager apps  
> 📦 Modular, hexagonally-structured test infrastructure layer  
> 🎯 Promotes consistency, reuse, and decoupling across 30+ React applications

---

## 🔍 Overview

`@ovh-ux/manager-unit-tests-config` centralizes unit test configuration for all OVHcloud Manager apps. It provides:

- A reusable, opinionated `sharedConfig`
- Exports (`createConfig`, `mergeConfig`, `defaultCoverageConfig`) to **decouple applications from test runner internals**
- A CLI tool (`manager-test`) for seamless test execution across apps—no need to locally install or configure the test runner

The configuration is designed around **Hexagonal Architecture principles**, ensuring test runner logic remains isolated and does not leak into application code.

---

## 🚀 Installation

In the OVHcloud Manager monorepo (Yarn Workspaces):

```bash
yarn add -D @ovh-ux/manager-unit-tests-config
```

---

## 🛠 Usage

Each app consumes the shared configuration by combining `sharedConfig` with local overrides via `mergeConfig`.

### ✅ Example: `vitest.config.js`

```js
import path from 'path';
import {
  sharedConfig,
  createConfig,
  mergeConfig,
  defaultCoverageConfig,
} from '@ovh-ux/manager-unit-tests-config';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        exclude: ['src/specific/setup.ts', ...defaultCoverageConfig.exclude],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
```

---

## 🧪 CLI: `manager-test`

A unified CLI wrapper for executing tests without requiring per-app test runner dependencies:

```bash
yarn manager-test
```

Supported flags:

```bash
yarn manager-test run --coverage
yarn manager-test --ui
```

> ✅ Applications do **not** need to install `vitest`, `@vitejs/plugin-react`, or `@vitest/coverage-v8` individually.

---

## 🔐 Exports API

| Export                   | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `sharedConfig`           | Base configuration (includes `jsdom`, React plugin, coverage)              |
| `createConfig()`         | Factory to create custom config fragments (wraps `defineConfig`)           |
| `mergeConfig()`          | Merges shared and local config (wraps `mergeConfig` from Vitest)           |
| `defaultCoverageConfig`  | Shared defaults for coverage settings (excludes, reporters, etc.)          |

---

## 📦 Package Structure

```
manager-unit-tests-config/
├── bin/
│   └── manager-unit-tests-cli.js     # CLI wrapper (Vitest / future adapters)
├── src/
│   ├── index.js                      # Main entry: shared config and exports
│   └── test-shared-config/
│       ├── vite.config.mjs           # Test runner config for self-tests
│       ├── shared.config.test.js     # Self-validation tests
│       └── setupTests.js             # Optional internal setup
```

---

## 🧱 Architectural Principles

This package follows **Hexagonal Architecture**:

- **Ports**: `createConfig`, `mergeConfig`, `defaultCoverageConfig`
- **Adapters**: Vitest, Vite, React plugin
- **Applications remain independent** of the underlying testing technology

### Benefits

- Centralized maintenance and upgrades
- Consistent test behavior across projects
- Easy future migration (e.g., to `vitest/browser` or Jest)

---

## 🧩 License

[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)  
© OVH SAS
