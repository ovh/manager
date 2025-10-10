# 🧩 manager-muk-cli

A Node.js CLI designed to **automate maintenance and synchronization** of the `@ovh-ux/muk` package with OVHcloud Design System (ODS).
It checks for new ODS releases, ensures component parity, and can automatically update both versions and missing component structures.

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
Compares components between `@ovhcloud/ods-react` and `manager-ui-kit/src/components`.

```bash
yarn muk-cli --check-components
```

**Example Output:**
```
ℹ Checking component parity between ODS and Manager...
ℹ 📁 Found 34 local components
ℹ 📦 Fetching ODS React tarball...
⚠ Missing 104 ODS components:
ℹ • accordion
ℹ • accordion-content
ℹ • accordion-item
ℹ • accordion-trigger
```

---

### 1.3 `--update-version`
Updates all ODS packages to the latest versions, then validates with lint and tests.

```bash
yarn muk-cli --update-version
```

**Example Output:**
```
✔ Updated 3 ODS dependencies
✔ @ovhcloud/ods-components: 18.6.2 → 18.6.4
✔ @ovhcloud/ods-react: 19.0.1 → 19.1.0
✔ @ovhcloud/ods-themes: 19.0.1 → 19.1.0
✔ package.json successfully updated.
```
If everything is already up-to-date:
```
✔ ✅ All ODS versions are already up to date!
✨ Done in 1.78s.
```

---

### 1.4 Post-Update Verification
After updating, the CLI automatically executes:
1. `yarn install` — update dependencies
2. `yarn lint:modern` — enforce consistent lint rules
3. `yarn test` — run all unit tests to ensure stability

This guarantees that each update is **safe, consistent, and verifiable**.

---

### 1.5 `--update-components`
Synchronizes missing components from **ODS → Manager UI Kit**, creating all necessary folders, files, tests, and exports.

```bash
yarn muk-cli --update-components
```

This command supports both:
- **Simple components**
- **Nested components (with subcomponents)**

---

## 🧱 2. Simple Components

A *simple component* (e.g. `progress-bar`, `badge`, `error`) is generated as follows:

```
progress-bar/
├── __tests__/
│   ├── snapshot/
│   │   └── .gitkeep
│   └── ProgressBar.snapshot.test.tsx
├── ProgressBar.component.tsx
├── ProgressBar.props.ts
└── index.ts
```

**Component Example:**
```tsx
import { ProgressBar as OdsProgressBar } from '@ovhcloud/ods-react';
import { ProgressBarProps } from './ProgressBar.props';

export const ProgressBar = (props: ProgressBarProps) => <OdsProgressBar {...props} />;
```

**Index Example:**
```ts
export { ProgressBar } from './ProgressBar.component';
export type { ProgressBarProps } from './ProgressBar.props';
```

---

## 🪜 3. Nested Components

Nested components (e.g. `range`, `step`, `tooltip`) have subcomponents such as `range-track` or `step-body`.  
The CLI automatically:

1. Detects parent–child relationships from the ODS tarball
2. Creates a base component folder
3. Generates subcomponent folders and files
4. Reuses parent props for subcomponents
5. Consolidates all exports in the parent’s `index.ts`

**Example Structure:**
```
range/
├── __tests__/
│   ├── snapshot/
│   │   └── .gitkeep
│   └── Range.snapshot.test.tsx
├── range-track/
│   ├── RangeTrack.component.tsx
│   └── __tests__/
│       └── RangeTrack.component.spec.tsx
├── range-thumb/
│   ├── RangeThumb.component.tsx
│   └── __tests__/
│       └── RangeThumb.component.spec.tsx
├── Range.component.tsx
├── Range.props.ts
└── index.ts
```

**Subcomponent Example:**
```tsx
import { PropsWithChildren } from 'react';
import { RangeProps } from '../Range.props';

export const RangeTrack = ({ children }: PropsWithChildren<RangeProps>) => <>{children}</>;
```

**Parent Index Example:**
```ts
export { Range } from './Range.component';
export type { RangeProps } from './Range.props';

export { RangeTrack } from './range-track/RangeTrack.component';
export { RangeThumb } from './range-thumb/RangeThumb.component';
export { RangeBounds } from './range-bounds/RangeBounds.component';
```

---

### 3.1 Behavior Summary

| Type | Structure | Props | Index Linking | Test Coverage |
|------|------------|--------|----------------|----------------|
| **Simple Component** | Single folder | Own `.props.ts` | Auto-exported in root index | Snapshot test |
| **Nested Component** | Parent + children | Children reuse parent props | All subcomponents exported in parent index | Each subcomponent has `.spec.tsx` |

---

## 🧰 4. CLI Help

```bash
yarn muk-cli --help
```

| Command               | Description                                  |
| --------------------- |----------------------------------------------|
| `--check-versions`    | Check npm for new ODS package versions       |
| `--check-components`  | Compare ODS vs Manager UI components         |
| `--update-version`    | Update ODS versions and run lint/test checks |
| `--update-components` | Add missing component folders                |
| `--update`            | Run both updates sequentially                |

> 💡 **Tip:** Output uses icons and colors (✔, ⚠, ℹ).  
> Use `setLoggerMode('stderr')` or `'silent'` to disable colored output.

---

## 📂 5. Project Structure

```
manager-muk-cli/
├─ src/
│  ├─ commands/
│  │  ├─ check-versions.js
│  │  ├─ check-components.js
│  │  ├─ update-version.js
│  │  └─ update-components.js
│  ├─ config/
│  │  └─ muk-config.js
│  ├─ utils/
│  │  ├─ log-manager.js
│  │  └─ json-utils.js
│  ├─ core/
│  │  ├─ npm-utils.js
│  │  └─ tasks-utils.js
│  └─ index.js
└─ package.json
```

---

## ⚙️ 6. Configuration

Defined in `src/config/muk-config.js`:

```js
export const TARGET_PACKAGES = [
  '@ovhcloud/ods-components',
  '@ovhcloud/ods-react',
  '@ovhcloud/ods-themes',
];

export const MUK_COMPONENTS_PATH = path.resolve('packages/manager-ui-kit');
export const MUK_COMPONENTS_SRC = path.join(MUK_COMPONENTS_PATH, 'src', 'components');
export const ODS_REACT_LATEST_URL = 'https://registry.npmjs.org/@ovhcloud%2Fods-react/latest';
```

---

## ✅ 7. Key Features

- Dynamic detection of missing ODS components
- Differentiation of **simple** vs **nested** components
- Shared prop inheritance for subcomponents
- Auto-generation of `index.ts` exports
- Full test scaffolding (`snapshot` + `spec`)
- Safe, idempotent, and repeatable

---

## 🧠 8. Design Philosophy

- **Modular commands** — each operation runs independently
- **Composable CLI** — `--update` orchestrates all sub-steps
- **Idempotent & Safe** — no destructive overwrites
- **Transparent validation** — lint + tests after updates
- **Readable logs** — colorized and consistent output

---

## 🪪 9. License

BSD-3-Clause © OVH SAS
