# 🧪static-analysis-kit

A modular, extensible, and future-ready toolkit for defining, adapting, and sharing static analysis rules across projects in the `manager` monorepo.

---

## 🚀 What Is It?

`static-analysis-kit` provides a unified platform for code quality, complexity, duplication, and architectural analysis. It separates semantic rule definitions from tool-specific integrations using a clean adapter-based architecture.

It currently supports:
- ESLint (flat config)
- Madge (dependency graph & circular analysis)
- JSCPD (code duplication detection)
- Code Health Meter (complexity, Halstead, maintainability, SLOC, architecture)

---

## 🎯 Why We Built This

- Reuse rules across projects and tools
- Avoid duplication of `.eslintrc`, `.prettierrc`, `.madgerc`, etc.
- Standardize how we measure code health and enforce architectural boundaries
- Enable safe and gradual migration to new tooling

---

## 🧱 Structure Overview

```
static-analysis-kit/
├── src/
│   ├── code-analysis.ts               # Central entry point (exports adapters)
│   ├── configs/                       # Tool-agnostic semantic rule definitions
│   │   ├── complexity.ts
│   │   ├── madge-options.ts
│   │   └── jscpd-options.ts
│   └── adapters/
│       ├── eslint/                    # ESLint flat config + rules
│       │   ├── config/
│       │   │   └── eslint.config.ts
│       │   └── rules/
│       ├── madge/                     # Madge analysis adapter
│       ├── jscpd/                     # JSCPD (duplication) adapter
│       ├── prettier/                  # Optional: shared formatting config
│       └── code-health-meter/         # Halstead, MI, Cyclomatic, SLOC
```

---

## 🛠️ Usage in an App

```ts
// apps/zimbra/eslint.config.ts
import { eslintConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [...eslintConfig];
```

This will apply all enabled ESLint rule groups from the toolkit, using flat config format (ESLint v8+).

```ts
// apps/zimbra/prettier.config.ts
import { prettierConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [...prettierConfig];
```

---

## 🧠 Design Principles

- **Composable**: Adapters are modular, rules are grouped by category
- **Decoupled**: Semantic configs live separately from tool logic
- **Pluggable**: Easy to add new tools (e.g. Biome, Oxlint)
- **Testable**: Configs are plain TS, easy to mock and verify

---

## 🔮 Future Flexibility

This architecture is designed to easily accommodate:

- `biome/` adapter (Rust-based formatter/linter)
- `oxlint/` adapter (high-performance Rust linter)
- `depcruise/`, `pmd/`, `stylelint/` or internal tools

Each would follow the same adapter pattern and pull from shared `configs/` where applicable.

---

## 🧑‍💻 Contributing

If you’re adding a new rule or adapter:

1. Put semantic/shared config in `configs/` if reusable.
2. Create a new adapter directory in `adapters/` (e.g., `eslint`, `madge`).
3. Add a domain-specific config, transformer, or wrapper.
4. Wire into `code-analysis.ts` as needed.
5. Document your addition.

---

## 📬 Feedback Welcome

The goal is to create a robust, composable, and organization-wide standard for static analysis.

Feel free to suggest improvements or new integrations!
