# 🧪 static-analysis-kit

A modular, extensible, and future-ready toolkit for defining, adapting, and sharing static and dynamic analysis rules across projects in the **Manager monorepo**.

---

## 🚀 What Is It?

`@ovh-ux/manager-static-analysis-kit` provides a unified framework for **code quality automation** across all applications, libraries, and modules — covering both **static** (lint, duplication, type coverage) and **dynamic** (tests, performance) checks.

It separates semantic rule definitions from tool-specific adapters to ensure configurability, reusability, and long-term consistency across the monorepo.

---

## 📦 Tools Exposed by the Kit

The kit currently provides:

- **ESLint** (flat config, adapters for React, TS, a11y, imports, naming, Storybook, Tailwind, TanStack, Vitest)
- **Code Duplication Reports** (`manager-code-duplication`)
- **Performance Budgets** (`manager-perf-budgets`)
- **Tests Coverage Reports** (`manager-tests-coverage`)
- **Types Coverage Reports** (`manager-types-coverage`)
- **W3C & A11Y Unit Tests Matchers** (`expect(container).toBeAccessible()`, `await expect(html).toBeValidHtml()`)

Coming soon:
- **Madge** (dependency graph & circular analysis)
- **Code Health Meter** (complexity, Halstead, maintainability, SLOC)

> Each tool has its own README inside the kit with full usage & configuration details.  
> See:
> - [Code Duplication](src/adapters/code-duplication/README.md)
> - [Performance Budgets](src/adapters/perf-budgets/README.md)
> - [Tests Coverage](src/adapters/tests-coverage/README.md)
> - [Types Coverage](src/adapters/types-coverage/README.md)
> - [HTML Validation](src/adapters/html-w3c-validation/README.md)
> - [Accessibility Validation](src/adapters/html-a11y-validation/README.md)

---

## 🧑‍💻 Combined Quality Checks

The kit also provides a **single entrypoint** for running all static & dynamic quality checks:

```bash
# Run all quality checks
yarn manager-static-dynamic-quality-checks

# Run only test-related checks
yarn manager-static-dynamic-quality-checks --tests
```

---

## 🔧 Launch Modes

Each CLI (e.g. `manager-code-duplication`, `manager-types-coverage`) supports **flexible launch modes** for targeting different scopes within the monorepo.

| Flag | Target | Path Resolution |
|------|---------|----------------|
| `--apps` / `--app` | Manager applications | `manager/apps/*` |
| `--packages` / `--package` | Package-level analysis | Resolves via `package.json` |
| `--libraries` / `--library` | Internal libraries | `packages/manager/core`, `packages/manager/modules`, `packages/components` |

---

### Analyze specific apps (by folder name)

```bash
yarn manager-types-coverage --apps zimbra,container
```

or single app:

```bash
yarn manager-types-coverage --app zimbra
```

> Here you provide **app folders** located under `manager/apps`.

---

### Analyze specific packages (by `package.json` name)

```bash
yarn manager-types-coverage --packages @ovh-ux/manager-container-app,@ovh-ux/manager-zimbra-app
```

or single package:

```bash
yarn manager-types-coverage --package @ovh-ux/manager-container-app
```

> In this mode:
> - The CLI resolves the package names to their corresponding **apps**.
> - Reports are generated per **app folder**.

---

### Analyze specific libraries (by `package.json` name)

```bash
yarn manager-types-coverage --libraries @ovh-ux/manager-wiki,@ovh-ux/manager-react-components
```

or single library:

```bash
yarn manager-types-coverage --library @ovh-ux/manager-react-components
```

> In this mode:
> - The CLI resolves the library names to their corresponding **folders** inside configured library roots:
    >   - `packages/manager-react-components/*`
>   - `packages/manager-wiki/*`
> - Reports are generated per **library folder**.

---

## ⚠️ Important Requirements

⚠️ **Important:**

These analysis tools only process **React-based applications and libraries** — **Angular or legacy frameworks are not supported**.

Each analysis type has specific requirements to run successfully:

| Analysis Type | Required Configuration | Description |
|----------------|-------------------------|--------------|
| **Type Coverage** | `tsconfig.json` | The tool analyzes only TypeScript projects with a valid configuration file. |
| **Tests Coverage** | Vitest or Jest setup | Requires test files (`*.test.ts[x]`, `*.spec.ts[x]`) and a working Vitest/Jest config. |
| **Performance Budgets** | `vite.config.ts` or `vite.config.js` | Requires a Vite-based build configuration to extract bundle metrics. |
| **Code Duplication** | React source files (`.js`, `.ts`, `.tsx`) | Automatically skips non-React or invalid modules. |

> Modules that don't meet these conditions are **skipped automatically with a warning**, but the CLI will still analyze all valid React apps and libraries to ensure partial success in mixed environments.

---

## 🧱 Structure Overview

```
static-analysis-kit/
├── src/
│   ├── code-analysis.ts               # Central export point
│   ├── configs/                       # Tool-agnostic rule definitions
│   └── adapters/                      # Tool integrations
│       ├── eslint/                    
│       ├── code-duplication/
│       ├── perf-budgets/
│       ├── tests-coverage/
│       ├── types-coverage/
│       ├── ts-config/
│       ├── html-a11y-validation/
│       ├── html-w3c-validation/
│       └── architecture-analysis/      # Coming soon
├── bin/
│   ├── utils/                         # Shared CLI utilities
│   │   ├── args-parse-utils.js        # CLI flags parsing (apps/libs/packages)
│   │   ├── module-utils.js            # Discovery and resolution logic
│   │   ├── file-utils.js              # JSON read/write helpers
│   │   └── log-utils.js               # Colored CLI logging
│   └── cli-path-config.js             # Centralized base paths & root dirs
└── README.md
```

---

## 🧠 Design Principles

- **Composable**: Adapters are modular, rules are grouped by category.
- **Decoupled**: Semantic configs live separately from tool logic.
- **Pluggable**: Easy to add new tools (e.g., Biome, Oxlint).
- **CI/CD Ready**: All tools produce JSON + HTML reports for pipelines.

---

## 🧪 Validation & CLI Testing

Each CLI in the Static Analysis Kit (e.g., `manager-code-duplication`, `manager-perf-budgets`, `manager-tests-coverage`, `manager-types-coverage`) includes automated validation suites that ensure correct argument parsing, module discovery, and exit-code semantics.

These tests simulate **real-world usage** across apps, packages, and libraries — both valid and invalid — to guarantee stability and predictable CLI behavior.

To execute these tests, from the root run:

```bash
yarn static-dynamic-quality-check-tests
```

---

### 🧭 Test Matrix

| Category | Example Command | Expected Exit |
|-----------|----------------|----------------|
| **Single app** | `yarn manager-code-duplication --app zimbra` | ✅ `0` |
| **Multiple apps** | `yarn manager-code-duplication --apps container,zimbra` | ✅ `0` |
| **Single package** | `yarn manager-code-duplication --package @ovh-ux/manager-container-app` | ✅ `0` |
| **Multiple packages** | `yarn manager-code-duplication --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app` | ✅ `0` |
| **Single library (static)** | `yarn manager-code-duplication --library manager-react-components` | ✅ `0` |
| **Single library (dynamic)** | `yarn manager-code-duplication --library shell-client` | ✅ `0` |
| **Multiple libraries** | `yarn manager-code-duplication --libraries manager-wiki,manager-react-components,shell-client` | ✅ `0` |
| **Mixed valid + invalid apps** | `yarn manager-code-duplication --apps zimbra,unknown-app,container` | ✅ `0` |
| **All invalid apps** | `yarn manager-code-duplication --apps doesnotexist1,doesnotexist2` | ❌ `1` |
| **Turbo build simulation** | `yarn manager-code-duplication --app pci-ai-tools` | ✅ `0` |

> 🧩 Each case asserts CLI correctness, exit codes, and resilience against unknown modules.

---

### 🧰 Supported CLIs

| CLI | Purpose |
|-----|----------|
| `manager-code-duplication` | Detects duplicated code across apps and libs |
| `manager-perf-budgets` | Evaluates bundle and asset sizes |
| `manager-tests-coverage` | Aggregates Jest/Vitest coverage reports |
| `manager-types-coverage` | Reports TypeScript type coverage |

Each CLI supports:
- `--apps` / `--app`
- `--packages` / `--package`
- `--libraries` / `--library`

---

## 📬 Feedback & Contributions

The **Static Analysis Kit** aims to become the central standard for static and dynamic quality assurance across all OVHcloud Manager projects.

We welcome contributions that:
- Add new analyzers or integrations
- Improve performance or modularity
- Enhance developer experience or CI/CD compatibility

💡 **Goal:** A composable, maintainable, and organization-wide framework for modern code quality governance.

---

© 2025 OVHcloud — Manager Engineering Team
