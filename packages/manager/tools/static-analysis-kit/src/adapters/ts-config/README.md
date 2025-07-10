# TypeScript Config — `@ovh-ux/manager-static-analysis-kit`

This guide describes the TypeScript configuration layers provided by the `@ovh-ux/manager-static-analysis-kit`, supporting both standard and strict type safety modes for Node, React, and Testing environments.

---

## 📦 Package Structure

```
ts-config/
├── config/
│   ├── standard/
│   │   ├── tsconfig.node.ts
│   │   ├── tsconfig.react.ts
│   │   └── tsconfig.test.ts
│   └── strict/
│       ├── tsconfig.node.ts
│       ├── tsconfig.react.ts
│       └── tsconfig.test.ts
├── rules/
│   ├── tsconfig.base.ts
│   └── tsconfig.base.strict.ts
└── README.md
```

---

## 🧩 Base Rule Sets

### `tsconfig.base.ts`

A relaxed, default TypeScript ruleset including:

- `strict: false`
- `skipLibCheck: true`
- `esModuleInterop: true`
- `resolveJsonModule: true`
- `jsx: preserve`
- Includes DOM/ESNext lib targets

### `tsconfig.base.strict.ts`

A stricter variant enabling full type-safety:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `exactOptionalPropertyTypes: true`

---

## 🔧 Config Variants

Each environment has two variants: `standard` (base rules) and `strict` (stricter rules).

| Purpose     | Standard Config                          | Strict Config                          |
|-------------|-------------------------------------------|-----------------------------------------|
| React App   | `tsconfig/react`                         | `tsconfig/react-strict`                |
| Node Scripts| `tsconfig/node`                          | `tsconfig/node-strict`                 |
| Unit Tests  | `tsconfig/test`                          | `tsconfig/test-strict`                 |

These extend the appropriate base config and add contextual settings (e.g. `dom` lib for React, `node` lib for backend).

---

## 🚀 Usage in µ-Applications

### Example: Zimbra App

```jsonc
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/public/*": ["./public/*"],
      "@/*": ["./src/*"]
    },
    "outDir": "dist",
    "allowJs": true
  },
  "include": [
    "src",
    "public/**/*.json"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "types"
  ]
}
```

---

## ✍️ Extend & Compose Configs

Each base or strict config can be used as-is or composed via `extends` in your app-level `tsconfig.json`.

For example:

```json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/node-strict"
}
```

---

## 🛠 Compiler Features in Use

All configurations benefit from:

- Native ES Module support (`module: nodenext`)
- JSX + TSX support (for React configs)
- JSON module resolution
- Local path mapping (`@/*`, `@/public/*`)
- Out-of-the-box support for Vite


---

## ⚙️ Per-App Customization

To ensure consistency while enabling per-app customization, applications may override the following:

- `compilerOptions.paths`
- `compilerOptions.outDir`
- `compilerOptions.allowImportingTsExtensions` (only if required)
- `compilerOptions.allowJs` (only if required)
- `compilerOptions.resolveJsonModule` (only if required)
- `compilerOptions.noImplicitAny` (only if required)
- `include`
- `exclude`

---

## ✅ Allowed Overrides for µ-Apps

To ensure consistency while enabling per-app customization, applications may override the following:

- `compilerOptions.paths`
- `compilerOptions.outDir`
- `compilerOptions.allowImportingTsExtensions` (only if required)
- `include`
- `exclude`

Apps **must not** redefine:

- `target`, `module`, `jsx`, `strict`, `lib`, etc.
- Any `strict`-level rules overridden by the base config

This policy ensures a reliable shared base while supporting edge-case requirements per project.
