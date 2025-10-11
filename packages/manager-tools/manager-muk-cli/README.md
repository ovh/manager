# 🧩 manager-muk-cli

A Node.js CLI designed to **automate maintenance and synchronization** of the `@ovh-ux/manager-ui-kit` package with the OVHcloud Design System (ODS).  
It checks for new ODS releases, ensures component parity, and automatically generates missing component structures while preserving full test coverage and export integrity.

---

## 🚀 1. Features Overview

### 1.1 `--check-versions`
Checks npm for new ODS package versions and compares them with those declared in `manager-ui-kit/package.json`.

```bash
yarn muk-cli --check-versions
```

**Example Output:**
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

**Example Output:**
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

**Example Output:**
```
✔ Updated 3 ODS dependencies
✔ @ovhcloud/ods-components: 18.6.2 → 18.6.4
✔ @ovhcloud/ods-react: 19.0.1 → 19.2.0
✔ @ovhcloud/ods-themes: 19.0.1 → 19.2.0
✔ package.json successfully updated.
✅ All ODS versions are already up to date!
✨ Done in 1.78s.
```

---

### 1.4 `--add-components`
Generates missing ODS components and subcomponents directly from the ODS React source tarball.

```bash
yarn muk-cli --add-components
```

**Supports:**
- Simple stateless components (`badge`, `skeleton`, `progress-bar`)
- Complex nested components (`form-field`, `combobox`, `range`, `datepicker`)

---

## 🧱 2. Simple Components

A **simple ODS component** has no nested structure or subcomponents.  
These are typically *stateless and flat*, such as `Badge`, `Skeleton`, or `ProgressBar`.

When the CLI detects such a component, it automatically:
- Creates a dedicated folder under `src/components/`
- Generates a minimal React wrapper around the ODS component
- Produces a snapshot test and typed props definition
- Registers the component and its types in `index.ts`

### **Generated Structure**
```
progress-bar/
├── __tests__/
│   └── ProgressBar.snapshot.test.tsx
├── ProgressBar.component.tsx
├── ProgressBar.props.ts
└── index.ts
```

### **Component Implementation**
```tsx
import { ProgressBar as OdsProgressBar } from '@ovhcloud/ods-react';
import type { ProgressBarProps } from './ProgressBar.props';

export const ProgressBar = (props: ProgressBarProps) => (
  <OdsProgressBar {...props} />
);
```

### **Props Definition**
```ts
import type { OdsProgressBarProps } from '@ovhcloud/ods-react';

export type ProgressBarProps = OdsProgressBarProps;
```

### **Index File**
```ts
export { ProgressBar } from './ProgressBar.component';
export type { ProgressBarProps } from './ProgressBar.props';
```

✅ **Key Notes**
- Simple components are generated idempotently: if they already exist, the CLI logs a skip.
- The snapshot test ensures export and rendering integrity.
- The component acts as a transparent proxy between Manager UI Kit and ODS React.

---

## 🪜 3. Nested Components

**Nested ODS components** (e.g. `form-field`, `combobox`, `datepicker`, `range`) consist of a **parent component** and several **child subcomponents**.  
The CLI analyzes the ODS React tarball to reconstruct these relationships automatically.

When generating a nested component, the CLI:
- Detects valid parent–child hierarchies from the ODS package
- Creates all required folders and subcomponent directories
- Determines prop inheritance (parent or own type)
- Detects children rendering patterns (`PropsWithChildren`, `props.children`, etc.)
- Consolidates all exports and types into the parent `index.ts`

### **Example Structure (Range)**
```
range/
├── __tests__/
│   └── Range.snapshot.test.tsx
├── range-thumb/
│   ├── RangeThumb.component.tsx
│   ├── RangeThumb.props.ts
│   └── __tests__/
│       └── RangeThumb.component.spec.tsx
├── range-track/
│   ├── RangeTrack.component.tsx
│   ├── RangeTrack.props.ts
│   └── __tests__/
│       └── RangeTrack.component.spec.tsx
├── Range.component.tsx
├── Range.props.ts
└── index.ts
```

### **Parent Component**
```tsx
import { Range as OdsRange } from '@ovhcloud/ods-react';
import type { RangeProps } from './Range.props';

export const Range = (props: RangeProps) => <OdsRange {...props} />;
```

### **Child Component Example (`RangeThumb`)**
```tsx
import { RangeThumb as OdsRangeThumb } from '@ovhcloud/ods-react';
import type { RangeThumbProps } from './RangeThumb.props';

export const RangeThumb = (props: RangeThumbProps) => (
  <OdsRangeThumb {...props} />
);
```

### **Parent Index**
```ts
export { Range } from './Range.component';
export type { RangeProps } from './Range.props';

export { RangeThumb } from './range-thumb/RangeThumb.component';
export type { RangeThumbProps } from './range-thumb/RangeThumb.props';

export { RangeTrack } from './range-track/RangeTrack.component';
export type { RangeTrackProps } from './range-track/RangeTrack.props';
```

---

## 🧩 4. Advanced Run Example (Real CLI Output)

```
ℹ 📦 Dynamic grouping summary:
combobox → combobox-content, combobox-control
datepicker → datepicker-content, datepicker-control
form-field → form-field-error, form-field-helper, form-field-label
range → (no children)

ℹ 📦 Fetching ODS React v19.2.0 tarball...
ℹ 👶 combobox supports children
ℹ 📁 Created folder: src/components/combobox
ℹ 🧩 combobox-content exports its own Prop type
ℹ 🧩 combobox-control exports its own Prop type
ℹ 🔗 Updated index.ts with 2 new exports
✔ Component structure ready for Combobox

ℹ 👶 datepicker supports children
ℹ 📁 Created folder: src/components/datepicker
ℹ 🧩 Created subcomponent 'datepicker-content' (🧩 own type, 🚫 stateless)
ℹ 🧩 Created subcomponent 'datepicker-control' (🧩 own type, 🚫 stateless)
ℹ ⚙️ Created constants passthrough for Datepicker (4 identifiers)
ℹ 🔗 Updated index.ts with 3 new exports
✔ Component structure ready for Datepicker

ℹ 👶 form-field supports children
ℹ 📁 Created folder: src/components/form-field
ℹ 📁 Created subcomponents: form-field-error, form-field-helper, form-field-label
ℹ 🪝 Created hook passthrough for FormField (1 identifier)
ℹ 🔗 Updated index.ts with 4 new exports
✔ Component structure ready for FormField

ℹ 🚫 range has no children
ℹ 🧩 Added 3 external types to props
✔ Component structure ready for Range

✔ 🎉 Created folder structure for 4 components.
✔ 🏁 Component sync completed — 4 new folders created.
✨ Done in 72.20s.
```

---

## 🧰 5. Behavior Summary

| Type | Structure | Props | Index Linking | Test Coverage |
|------|------------|--------|----------------|----------------|
| Simple Component | Single folder | Own `.props.ts` | Exported in root index | Snapshot |
| Nested Component | Parent + children | Children reuse parent props | Auto-linked exports | Snapshot + Spec |
| Invalid Component | Not found in tarball | Skipped safely | Logged as warning | None |

---

## ⚙️ 6. Architecture Overview

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
│  │  ├─ tasks-utils.js
│  ├─ config/
│  │  └─ muk-config.js
│  └─ utils/
│     ├─ log-manager.js
│     └─ json-utils.js
```

---

## 🧠 7. Design Principles

| Principle | Description |
|------------|-------------|
| Modular CLI | Each subcommand is independent and composable |
| Dynamic Detection | Automatically adapts to future ODS layouts |
| Heuristic Analysis | Uses regex and index parsing for accurate generation |
| Safe Idempotence | Never overwrites or duplicates existing files |
| Transparent Logging | All steps are logged with emojis and color output |

---

## ✅ 8. Key Advantages

- Handles legacy and modern ODS layouts seamlessly
- Dynamically groups related components (`range-track`, `form-field-label`, etc.)
- Automatically includes hooks, constants, and external types
- Provides modular internal functions for reuse and testing
- Fast and cache-friendly (ODS tarball loaded once per run)

---

## 🪪 9. License

BSD-3-Clause © OVH SAS
