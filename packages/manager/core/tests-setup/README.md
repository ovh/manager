# `@ovh-ux/manager-tests-setup`

> Shared unit test configuration for OVHcloud Manager apps  
> Modular, hexagonally-structured test infrastructure layer  
> Promotes consistency, reuse, and decoupling across 30+ React applications

---

## Overview

`@ovh-ux/manager-tests-setup` centralizes **test configuration** (unit, integration, and future test layers) for all OVHcloud Manager apps. It provides:

- A reusable, opinionated `sharedConfig` for unit and integration testing
- Exports (`createConfig`, `mergeConfig`, `defaultCoverageConfig`) to **decouple applications from test runner internals**
- A CLI tool (`manager-test`) for seamless test execution—no need to locally install or configure the test runner

The setup follows **Hexagonal Architecture principles**, ensuring test logic remains isolated from application code and tooling can evolve independently.

---

## Installation

In the OVHcloud Manager monorepo:

```bash
yarn add -D @ovh-ux/manager-tests-setup
```

---

## Usage

Each app consumes the shared configuration by combining `sharedConfig` with local overrides via `mergeConfig`.

### Example: `vitest.config.js`

```js
import path from 'path';
import {
  sharedConfig,
  createConfig,
  mergeConfig,
  defaultCoverageConfig,
} from '@ovh-ux/manager-tests-setup';

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

## CLI: `manager-test`

A unified CLI wrapper for executing tests without requiring per-app test runner dependencies:

```bash
yarn manager-test
```

Supported flags:

```bash
yarn manager-test run --coverage
yarn manager-test --ui
```

> Applications do **not** need to install `vitest`, `@vitejs/plugin-react`, or `@vitest/coverage-v8` individually.

---

## Exports API

| Export                   | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `sharedConfig`           | Base configuration (includes `jsdom`, React plugin, coverage)              |
| `createConfig()`         | Factory to create custom config fragments (wraps `defineConfig`)           |
| `mergeConfig()`          | Merges shared and local config (wraps `mergeConfig` from Vitest)           |
| `defaultCoverageConfig`  | Shared defaults for coverage settings (excludes, reporters, etc.)          |

---

## Architectural Principles

This package follows **Hexagonal Architecture**:

- **Ports**: `createConfig`, `mergeConfig`, `defaultCoverageConfig`
- **Adapters**: Vitest, Vite, React plugin
- **Applications remain independent** of the underlying testing technology

### Benefits

- Centralized maintenance and upgrades
- Consistent test behavior across projects
- Easy future migration (e.g., to `vitest/browser` or Jest)

---

## License

[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)  
© OVH SAS — for use with any OVHcloud Manager testing needs (unit, integration, etc.)
