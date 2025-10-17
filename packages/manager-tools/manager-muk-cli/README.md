# 🧩 manager-muk-cli

A Node.js CLI designed to **automate maintenance, synchronization, and documentation** of the `@ovh-ux/manager-ui-kit` with the **OVHcloud Design System (ODS)**.

It checks ODS versions, detects missing components, generates passthroughs (hooks, constants, types), and **synchronizes ODS component documentation** directly from GitHub, using a fully-streamed, cache-aware architecture.

---

## 🚀 1. Features Overview

### 1.1 `--check-versions`

Checks npm for new ODS package releases and compares them with the versions declared in `manager-ui-kit/package.json`.

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

Compares ODS React components with those in `manager-ui-kit/src/components`, identifying missing or outdated ones.

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
ℹ • range
ℹ • range-thumb
ℹ • range-track
```

---

### 1.3 `--update-versions`

Automatically updates all ODS dependencies in `package.json` to their latest versions, validates, and runs post-update checks.

```bash
yarn muk-cli --update-versions
```

**Example Output**
```
✔ Updated 3 ODS dependencies
✔ @ovhcloud/ods-components: 18.6.2 → 18.6.4
✔ @ovhcloud/ods-react: 19.0.1 → 19.2.0
✔ @ovhcloud/ods-themes: 19.0.1 → 19.2.0
✔ package.json successfully updated.
```

If all are current:
```
✅ All ODS versions are already up to date!
✨ Done in 1.78s.
```

---

### 1.4 `--add-components`

Generates **missing ODS components** from the ODS React source tarball, preserving hooks, constants, and external types.

```bash
yarn muk-cli --add-components
```

#### Supported Scenarios
* Simple components (no children, e.g. `badge`, `progress-bar`)
* Nested components (with subcomponents, e.g. `form-field`, `datepicker`, `range`)
* Hook passthroughs (`useFormField`)
* Constants passthroughs (`DatepickerConstants`)
* External type re-exports

---

### 1.5 `--add-components-documentation`

Fetches and synchronizes **official ODS component documentation** (`.mdx` files) from the [ovh/design-system](https://github.com/ovh/design-system) repository directly into `manager-wiki`.

```bash
yarn muk-cli --add-components-documentation
```

#### 🧠 What It Does
1. Detects the latest `@ovhcloud/ods-react` version from npm.
2. Downloads (or reuses) the GitHub tarball for that version.
3. Streams documentation files under `/storybook/stories/components/`.
4. Extracts per-component documentation and writes it to:
   ```
   packages/manager-wiki/stories/manager-ui-kit/components/<component>/base-component-doc/
   ```
5. Caches the tarball for **7 days** to avoid redundant downloads.
6. Synchronizes Storybook base-documents:
   ```
   packages/manager-wiki/stories/manager-ui-kit/base-documents/
   ```
7. Rewrites imports:
  - `../../../src/` → `../../../base-documents/`
  - `ods-react/src/` → `@ovhcloud/ods-react`

**Example Output**
```
ℹ 📦 Starting Design System documentation sync…
ℹ ℹ️ ODS React latest version: 19.2.1
✔ 💾 Served 85 documentation files from cache.
ℹ 📁 Found existing component: 'accordion'
✔ ✅ Sync complete — 45 new, 42 updated, 171 files streamed.
```

---

## ⚙️ 2. Streaming Architecture

### 2.1 High-Level Flow
```
GitHub tarball (.tar.gz)
   │
   ├─▶ streamTarGz()
   ├─▶ extractDesignSystemDocs()
   ├─▶ createAsyncQueue()
   └─▶ streamComponentDocs()
```

### 2.2 Core Streaming Functions
#### Stream Extraction
```js
pipeline(
  https.get(url),
  zlib.createGunzip(),
  tar.extract({ onentry(entry) { ... } })
);
```
Each `entry` is processed **as it’s read** — no full buffering.

#### Stream Bridge
```js
const queue = createAsyncQueue();
await extractDesignSystemDocs({ onFileStream: q.push });
await streamComponentDocs(queue);
```
Manages concurrency and backpressure.

#### Stream Consumer
```js
await pipeline(fileStream, fs.createWriteStream(destFile));
```
Backpressure-safe, cleans up on error.

#### Cache Layer
```
target/.cache/ods-docs/
├── ods-docs-meta.json
└── ods-docs-files.json
```
TTL: 7 days — fully reusable offline.

---

## 🧱 3. Codebase Layout
```
manager-muk-cli/
├─ src/
│  ├─ commands/
│  ├─ core/
│  ├─ config/
└─ target/.cache/ods-docs/
```

---

## 🧠 4. Design Principles

| Principle | Description |
|------------|--------------|
| **Streaming-first** | All I/O ops use Node streams |
| **Memory-safe** | Constant memory footprint |
| **Composable** | Modular, small functions |
| **Idempotent** | Deterministic results |
| **Offline-safe** | Cache-first retry |
| **Verbose logging** | Emoji logs for visibility |
| **Configurable** | Rewrite rules in `muk-config.js` |

---

## ✅ 5. Advantages
* 🔁 Auto-synced ODS documentation and base-docs
* ⚡ Cached and resumable (7-day TTL)
* 🧩 Full parity with ODS React components
* 🧠 Low-memory async pipeline
* 🧱 Modular, testable, CI-ready
* 🔧 Configurable rewriting rules

---

## 🧩 6. Cache Troubleshooting
```bash
rm -rf packages/manager-tools/manager-muk-cli/target/.cache/ods-docs
```
Rebuilds clean cache on rerun.

---

## 🧩 7. Configuration Extraction

`muk-config.js` centralizes regex, rewrite, and Storybook folder logic.

```js
export const MUK_IMPORT_REWRITE_RULES = [
  {
    name: 'base-documents',
    pattern: /((?:\..\/){2,3})src\//g,
    replacer: (_, prefix) => `${prefix}base-documents/`,
  },
  {
    name: 'ods-react',
    pattern: /(['"])[^'"]*ods-react\/src[^'"]*/g,
    replacer: (_, quote) => `${quote}@ovhcloud/ods-react`,
  },
];
```

---

## 🪪 8. License
BSD-3-Clause © OVH SAS
