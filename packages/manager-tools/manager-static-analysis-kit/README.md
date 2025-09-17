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
