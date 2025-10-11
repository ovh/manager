# 🧩 manager-muk-cli

A Node.js CLI designed to **automate maintenance and synchronization** of the `@ovh-ux/manager-ui-kit` package with the **OVHcloud Design System (ODS)**.
It checks for new ODS releases, ensures component parity, and automatically generates missing component structures, hooks, constants, and type passthroughs while preserving test coverage and export integrity.

---

## 🚀 1. Features Overview

### 1.1 `--check-versions`

Checks npm for new ODS package versions and compares them with those declared in `manager-ui-kit/package.json`.

```bash
yarn muk-cli --check-versions
```

**Example Output**

```
ℹ 🔍 Checking ODS package versions...
⚠ Updates available:
ℹ @ovhcloud/ods-components: 18.6.2 → 18.6.4
ℹ @ovhcloud/ods-react: 19.0.1 → 19.1.0
ℹ @ovhcloud/ods-themes: 19.0.1 → 19.1.0
```

---

### 1.2 `--check-components`

Compares components between `@ovhcloud/ods-react` and `manager-ui-kit/src/components`, identifying missing or outdated ones.

```bash
yarn muk-cli --check-components
```

**Example Output**

```
ℹ 📁 Found 34 local components
ℹ 📦 Fetching ODS React v19.2.0 tarball...
⚠ Missing 8 ODS components:
ℹ • form-field
ℹ • form-field-label
ℹ • form-field-error
ℹ • range
ℹ • range-thumb
ℹ • range-track
```

---

### 1.3 `--update-version`

Updates all ODS dependencies in `package.json` to their latest versions, validates linting, and runs unit tests.

```bash
yarn muk-cli --update-version
```

**Example Output**

```
✔ Updated 3 ODS dependencies
✔ @ovhcloud/ods-components: 18.6.2 → 18.6.4
✔ @ovhcloud/ods-react: 19.0.1 → 19.2.0
✔ @ovhcloud/ods-themes: 19.0.1 → 19.2.0
✔ package.json successfully updated.
```

If all versions are up-to-date:

```
✅ All ODS versions are already up to date!
✨ Done in 1.78s.
```

---

### 1.4 `--add-components`

Generates **missing ODS components** and subcomponents directly from the ODS React source tarball.

```bash
yarn muk-cli --add-components
```

Supports:

* Simple components (e.g. `badge`, `progress-bar`)
* Nested components (e.g. `form-field`, `combobox`, `range`, `datepicker`)
* Hook passthroughs (e.g. `useFormField`)
* Constants passthroughs (e.g. `DatepickerConstants`)
* External type re-exports (from contexts or shared ODS types)

---

## 🧱 2. Simple Components

A *simple* ODS component has no subcomponents or nested structure.

**Generated Structure**

```
progress-bar/
├── __tests__/
│   └── ProgressBar.snapshot.test.tsx
├── ProgressBar.component.tsx
├── ProgressBar.props.ts
└── index.ts
```

**Component**

```tsx
import { ProgressBar as OdsProgressBar } from '@ovhcloud/ods-react';
import { ProgressBarProps } from './ProgressBar.props';

export const ProgressBar = (props: ProgressBarProps) => <OdsProgressBar {...props} />;
```

**Index**

```ts
export { ProgressBar } from './ProgressBar.component';
export type { ProgressBarProps } from './ProgressBar.props';
```

---

## 🪜 3. Nested Components

Nested components (e.g. `form-field`, `combobox`, `datepicker`, `range`) contain child components such as `form-field-label` or `datepicker-control`.

The CLI automatically:

1. Detects parent–child relationships
2. Generates base and subcomponent folders
3. Determines prop inheritance (own vs parent type)
4. Detects if components **have or lack children**
5. Creates passthroughs for hooks, constants, and external types
6. Consolidates all exports into the parent `index.ts`

**Example Structure**

```
range/
├── __tests__/
│   └── Range.snapshot.test.tsx
├── range-track/
│   └── RangeTrack.component.tsx
├── range-thumb/
│   └── RangeThumb.component.tsx
├── Range.component.tsx
├── Range.props.ts
└── index.ts
```

**Parent Index**

```ts
export { Range } from './Range.component';
export type { RangeProps } from './Range.props';
export { RangeTrack } from './range-track/RangeTrack.component';
export { RangeThumb } from './range-thumb/RangeThumb.component';
```

---

### 3.1 Detection Logic

| Detection Type     | Logic                                                                     | Examples                                                |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Children**       | Detects `PropsWithChildren`, `children:` props, or `props.children` usage | Differentiates with vs without children                 |
| **Subcomponent**   | Scans ODS index exports to build parent–child tree                        | `form-field`, `datepicker`                              |
| **Hooks**          | Detects any export containing `use` prefix                                | Generates `hooks/use<Component>.ts` passthrough         |
| **Constants**      | Extracts all non-type exports from `constants` paths                      | Creates `constants/<Component>Constants.ts` passthrough |
| **External Types** | Detects `type` or `interface` exports from non-component paths            | Appends imports/exports in `.props.ts`                  |

---

### 3.2 Behavior Summary

| Type                  | Structure            | Children | Hooks    | Constants | Types         | Index Linking | Test Coverage   |
| --------------------- | -------------------- | -------- | -------- | --------- | ------------- | ------------- | --------------- |
| **Simple Component**  | Single folder        | No       | Optional | Optional  | Own           | Root index    | Snapshot        |
| **Nested Component**  | Parent + children    | Yes/No   | Auto     | Auto      | Parent or Own | Parent index  | Snapshot + Spec |
| **Invalid Component** | Not found in tarball | —        | —        | —         | —             | Skipped       | None            |

---

## ⚙️ 4. Architecture Overview

```
manager-muk-cli/
├─ src/
│  ├─ commands/
│  │  ├─ check-versions.js
│  │  ├─ check-components.js
│  │  ├─ update-version.js
│  │  └─ add-components.js
│  ├─ core/
│  │  ├─ component-utils.js
│  │  ├─ ods-tarball-utils.js
│  │  ├─ file-utils.js
│  │  └─ tasks-utils.js
│  ├─ config/
│  │  └─ muk-config.js
│  └─ utils/
│     ├─ log-manager.js
│     └─ json-utils.js
```

---

## 🧠 5. Design Principles

| Principle               | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| **Modular CLI**         | Each command is standalone and composable            |
| **Granular Heuristics** | Detects children, hooks, constants, and type exports |
| **Idempotent Safety**   | Prevents overwriting or duplication                  |
| **Verbose Logging**     | Colorized emoji logs for transparency                |

---

## ✅ 6. Advantages

* Detects components **with and without children**
* Automatically generates **hooks**, **constants**, and **external types** passthroughs
* Builds fully linked exports for parent and subcomponents
* Modularized, reusable, and testable architecture
* Caches and reuses ODS tarball during execution

---

## 🧩 7. Example Output (Range + FormField)

```
ℹ 📦 Fetching ODS React v19.2.0 tarball...
👶 form-field supports children
🚫 range has no children
🧩 form-field-error exports its own Prop type
🪝 Created hook passthrough for FormField (1 identifier)
⚙️ Created constants passthrough for Datepicker (4 identifiers)
✔ Component structure ready for FormField
✔ Component structure ready for Range
```

---

## 🪪 8. License

BSD-3-Clause © OVH SAS
