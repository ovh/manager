# 🧪 static-analysis-kit

A modular, extensible, and future-ready toolkit for defining, adapting, and sharing static analysis rules across projects in the `manager` monorepo.

---

## 🚀 What Is It?

`static-analysis-kit` provides a unified platform for **static & dynamic quality checks**: linting, duplication, type coverage, tests coverage, and performance budgets.

It separates semantic rule definitions from tool-specific integrations using a clean adapter-based architecture.

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
> - [HTML W3C Validation](src/adapters/html-w3c-validation/README.md)
> - [HTML Accessibility Matcher](src/adapters/html-a11y-validation/README.md)

---

## 🧑‍💻 Combined Quality Checks

The kit also provides a **single entrypoint** for running all static & dynamic quality checks in parallel:

```bash
# Run all quality checks
yarn manager-static-dynamic-quality-checks

# Run only tests-related checks
yarn manager-static-dynamic-quality-checks --tests
```

### Run by Type

You can also target subsets of checks:

```bash
yarn manager-code-duplication
yarn manager-perf-budgets
yarn manager-tests-coverage
yarn manager-types-coverage
```

---

## 🔧 Launch Modes

Each CLI (`manager-code-duplication`, `manager-tests-coverage`, `manager-types-coverage`, etc.) supports multiple **launch modes** for targeting different scopes.

---

### Analyze specific apps (by folder name)

```bash
yarn manager-types-coverage --apps container,zimbra
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

## 🧱 Structure Overview

```
static-analysis-kit/
├── src/
│   ├── code-analysis.ts               # Central entry point (exports adapters)
│   ├── configs/                       # Tool-agnostic semantic rule definitions
│   └── adapters/                      # Tool integrations
│       ├── eslint/                    
│       ├── code-duplication/          # Duplication reports
│       ├── perf-budgets/              # Performance analyzer
│       ├── tests-coverage/            # Test coverage reports
│       ├── types-coverage/            # TS coverage reports
│       ├── madge/                     # Coming soon
│       └── code-health-meter/         # Coming soon
```

---

## 🧠 Design Principles

- **Composable**: Adapters are modular, rules are grouped by category.
- **Decoupled**: Semantic configs live separately from tool logic.
- **Pluggable**: Easy to add new tools (e.g., Biome, Oxlint).
- **CI/CD Ready**: All tools produce JSON + HTML reports for pipelines.

---

## 📬 Feedback Welcome

The goal is to create a **robust, composable, and organization-wide standard** for static analysis and dynamic quality checks.

Suggestions & contributions are welcome.  
