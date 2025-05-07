# @ovh-ux/manager-unit-tests-config

> 🧪 Shared Vitest configuration for OVHcloud Manager apps  
> 📦 Hexagonally-structured test infrastructure layer  
> 🎯 Promotes consistency, reuse, and isolation across 30+ React applications

---

## 🔍 Overview

This package encapsulates a common `vitest` configuration used across all OVHcloud Manager apps. It provides:

- A reusable `sharedConfig` for unit testing
- Controlled exports (`createConfig`, `mergeConfig`, `defaultCoverageConfig`) to **decouple apps from Vitest internals**
- A CLI tool (`manager-test`) to run tests without requiring local `vitest` installation

Designed with **Hexagonal Architecture principles**, this package isolates the test runner and avoids leaking implementation details into app code.

---

## 🚀 Installation

In the Manager monorepo (Yarn workspaces):

```bash
yarn add -D @ovh-ux/manager-unit-tests-config
```

---

## 🛠 Usage

Each app uses the shared config via `mergeConfig` + local overrides:

### `vitest.config.js`

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

## 🧪 CLI Usage

This package includes a CLI wrapper around Vitest to run tests centrally:

```bash
yarn manager-test
```

Optional flags:
```bash
yarn manager-test run --coverage
yarn manager-test --ui
```

Apps do **not** need to install `vitest`, `vite`, or plugins directly.

---

## 🔐 API

This package exposes:

| Export | Description |
|--------|-------------|
| `sharedConfig` | Baseline test config with `jsdom`, `@vitejs/plugin-react`, and coverage setup |
| `createConfig` | Re-exported `defineConfig()` from Vitest |
| `mergeConfig` | Re-exported `mergeConfig()` from Vitest |
| `defaultCoverageConfig` | Re-exported `coverageConfigDefaults` for consistent extension logic |

---

## 📦 Package Structure

```
unit-tests-config/
├── bin/
│   └── manager-unit-tests-cli.js   # CLI runner for Vitest
├── src/
│   ├── index.js                    # Main shared config + exports
│   └── test-shared-config/
│       ├── vite.config.mjs         # Test runner for this package
│       ├── shared.config.test.js   # Self-validation tests
│       └── setupTests.js           # Optional setup file
```

---

## 🧱 Architecture

This config follows **Hexagonal Architecture principles**:

- **Ports:** `createConfig`, `mergeConfig`, and `defaultCoverageConfig`
- **Adapters:** Vitest, Vite, React plugin
- **App code stays fully decoupled** from test tooling internals

This allows for:
- Easy replacement (e.g., switch to `vitest/browser`)
- Central upgrades
- Consistent test environments

---

## 🔄 Future Plans

- Evaluate default switch from `jsdom` to `vitest/browser`
- Add optional per-domain test setup extensions (e.g. with MSW)
- Provide a test generator for new apps

---

## 🧩 License

[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause) – © OVH SAS
