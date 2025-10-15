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

---

### 🪄 Example Output

```
ℹ 📦 Starting Design System documentation sync…
ℹ ℹ️ ODS React latest version: 19.2.1
ℹ 📦 Preparing to extract ODS docs (v19.2.1)…
ℹ 📦 Using cached v19.2.1 (age: 0.0 days, fresh < 7.0 days)
✔ 💾 Served 85 documentation files from cache.
ℹ ℹ️ Starting component documentation sync (streaming mode)…
ℹ 📁 Found existing component: 'accordion'
ℹ 💾 Writing file → packages/manager-wiki/.../accordion/base-component-doc/documentation.mdx
ℹ 💾 Writing file → packages/manager-wiki/.../accordion/base-component-doc/technical-information.mdx
✔ ✅ Completed streaming sync — created: 2, updated: 40, files written: 84
✔ ✅ Sync complete — 2 new, 40 updated, 84 files streamed.
```

---

## ⚙️ 2. Streaming Architecture

### 🧩 High-Level Data Flow

```
GitHub tarball (.tar.gz)
   │
   ├─▶ streamTarGz(url)
   │     ├─→ Reads tarball as Node.js stream (HTTP + gzip)
   │     └─→ Emits each entry (file) as a readable stream
   │
   ├─▶ extractDesignSystemDocs()
   │     ├─→ Wraps tar stream with cache management
   │     └─→ Calls onFileStream(entryPath, stream)
   │
   ├─▶ createAsyncQueue()
   │     ├─→ Async generator buffering file streams
   │     └─→ Handles backpressure automatically
   │
   └─▶ streamComponentDocs()
         ├─→ Extracts component name and relative path
         ├─→ Ensures directories exist
         └─→ Pipes content stream to disk
```

---

### ⚙️ Core Streaming Mechanisms

#### 2.1 Stream Extraction

`streamTarGz()` uses Node’s streaming API to extract `.tar.gz` contents:

```js
pipeline(
  https.get(url),
  zlib.createGunzip(),
  tar.extract({ onentry(entry) { ... } })
)
```

Each `entry` is processed **as it’s read** — no full-file buffering.

---

#### 2.2 Stream Bridge (Async Queue)

To decouple producer (tar extractor) and consumer (file writer):

```js
const queue = createAsyncQueue();

await extractDesignSystemDocs({
  onFileStream: async (tarPath, fileStream) => {
    await queue.push({ tarPath, stream: fileStream });
  },
});

queue.end();
await streamComponentDocs(queue);
```

`createAsyncQueue()` exposes an async iterator with controlled concurrency and backpressure handling — perfect for file I/O workloads.

---

#### 2.3 Stream Consumer (File Writer)

Each `.mdx` file is streamed to disk via `stream.pipeline()` for safety:

```js
await pipeline(
  fileStream,
  fs.createWriteStream(destFile)
);
```

This ensures:
- Automatic cleanup on error
- Backpressure-aware writes
- Consistent memory usage even for large archives

---

#### 2.4 Cache Layer

ODS tarballs and extracted documentation are cached in:

```
packages/manager-tools/manager-muk-cli/target/.cache/ods-docs/
│
├── ods-docs-meta.json        # { version, timestamp, checksum }
├── ods-docs-files.json       # Extracted files (path → buffer)
└── history/                  # (optional future rollback snapshots)
```

TTL: 7 days. Subsequent runs read directly from cache if fresh.

---

### ⚡ Why Streams?

| Concern | Solution |
|----------|-----------|
| Large tarballs | Streamed processing — no buffering in memory |
| Network efficiency | Progressive gzip decompression |
| Parallel tasks | Async queue for backpressure-safe file writes |
| Crash safety | `pipeline()` handles errors atomically |
| Reuse | Cached tarball enables offline operation |

---

## 🧱 3. Codebase Layout

```
manager-muk-cli/
├─ src/
│  ├─ commands/
│  │  ├─ check-versions.js
│  │  ├─ check-components.js
│  │  ├─ update-versions.js
│  │  ├─ add-components.js
│  │  └─ add-components-documentation.js
│  ├─ core/
│  │  ├─ ods-documentation-tarball-utils.js
│  │  ├─ ods-components-tarball-utils.js
│  │  ├─ tarball-utils.js
│  │  ├─ file-utils.js
│  │  ├─ tasks-utils.js
│  │  └─ log-manager.js
│  ├─ config/
│  │  └─ muk-config.js
└─ target/.cache/ods-docs/
```

---

## 🧠 4. Design Principles

| Principle | Description |
|------------|--------------|
| **Streaming-first** | All large I/O and network ops use Node.js streams |
| **Memory-safe** | No buffering — constant memory footprint |
| **Composable** | Modular functions for each pipeline stage |
| **Idempotent** | Re-running the CLI produces deterministic results |
| **Offline-safe** | Cached tarballs enable repeated runs without network |
| **Verbose logging** | Emoji logs for visibility at every stage |

---

## ✅ 5. Advantages

* 🔁 Automatic synchronization of ODS documentation
* ⚡ Cached and resumable (7-day TTL)
* 🧩 Full parity with ODS components
* 🧠 Low-memory stream pipeline with async backpressure
* 🪶 Reusable architecture (can be extended for storybook or theme docs)
* 🧱 Modular, testable, and CI-ready

---

## 🧩 6. Cache Troubleshooting

Remove corrupted cache:
```bash
rm -rf packages/manager-tools/manager-muk-cli/target/.cache/ods-docs
```

Re-run the sync to rebuild it.

---

## 🪪 7. License

BSD-3-Clause © OVH SAS
