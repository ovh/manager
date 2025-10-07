# 🧩 manager-muk-cli

A Node.js CLI designed to **automate maintenance and synchronization** of the `@ovh-ux/muk` package with OVHcloud Design System (ODS).  
It checks for new ODS releases, ensures component parity, and can automatically update both versions and missing component structures.

---

## 🚀 Features

### 1. `--check-versions`
Checks for new versions of ODS packages on npm and compares them with the versions currently declared in `manager-ui-kit/package.json`.

**Example:**
```bash
yarn muk-cli --check-versions
```
**Output:**
```
ℹ 🔍 Checking ODS package versions...
⚠ Updates available:
ℹ @ovhcloud/ods-components: 18.6.2 → 18.6.4
ℹ @ovhcloud/ods-react: 19.0.1 → 19.1.0
ℹ @ovhcloud/ods-themes: 19.0.1 → 19.1.0
```

---

### 2. `--check-components`
Compares the components available in ODS React (`@ovhcloud/ods-react`) with those implemented in `manager-ui-kit/src/components`.

**Example:**
```bash
yarn muk-cli --check-components
```
**Output:**
```
ℹ ℹ Checking component parity between ODS and Manager...
ℹ 📁 Found 34 local components
ℹ 📦 Fetching ODS React tarball: https://registry.npmjs.org/@ovhcloud/ods-react/-/ods-react-19.1.0.tgz
ℹ ℹ Remote count: 112, Local count: 34
⚠ ⚠ Missing 104 ODS components:
ℹ • accordion
ℹ • accordion-content
ℹ • accordion-item
ℹ • accordion-trigger
ℹ • breadcrumb-ellipsis
ℹ • breadcrumb-item
ℹ • breadcrumb-link
```

---

### 3. `--update-version`
Updates the ODS package versions (`@ovhcloud/ods-components`, `@ovhcloud/ods-react`, `@ovhcloud/ods-themes`) in `package.json` to the latest ones published on npm.

**Example:**
```bash
yarn muk-cli --update-version
```
**Output:**
```
✔ ✔ Updated 3 ODS dependencies:
ℹ @ovhcloud/ods-components: 18.6.2 → 18.6.4
ℹ @ovhcloud/ods-react: 19.0.1 → 19.1.0
ℹ @ovhcloud/ods-themes: 19.0.1 → 19.1.0
ℹ 📦 package.json successfully updated at: ./packages/manager-ui-kit/package.json
ℹ 🔧 Running yarn install from project root...
warning Resolution field "sass@1.56.1" is incompatible with requested version "sass@1.71.0"
warning Resolution field "sass@1.56.1" is incompatible with requested version "sass@1.71.0"
warning Resolution field "sass@1.56.1" is incompatible with requested version "sass@1.71.0"
```

If no update is available:
```
ℹ ✅ Successfully loaded JSON from ./packages/manager-ui-kit/package.json
• Sample keys: name, version, license, author, types ...
ℹ ℹ Checking ODS package versions...
✔ @ovhcloud/ods-components is up to date (18.6.4)
✔ @ovhcloud/ods-react is up to date (19.1.0)
✔ @ovhcloud/ods-themes is up to date (19.1.0)
✔ ✅ All ODS versions are already up to date!
✨  Done in 1.78s.
```

---

### 🧩 Auto-Install Behavior

After updating package versions, `manager-muk-cli` automatically runs:

```bash
yarn install
```

from the **repository root**, ensuring that:
- `yarn.lock` remains synchronized with the new dependency versions,
- all workspace packages get the correct ODS versions,
- and `node_modules` are fully up to date.

**Example:**
```bash
yarn muk-cli --update-version
```
**Output:**
```
ℹ Checking for latest ODS versions...
✔ Updated 3 ODS dependencies:
ℹ @ovhcloud/ods-components: 18.6.2 → 18.6.4
ℹ @ovhcloud/ods-react: 19.0.1 → 19.1.0
ℹ @ovhcloud/ods-themes: 19.0.1 → 19.1.0
📦 package.json successfully updated at: packages/manager-ui-kit/package.json
🔧 Running yarn install from project root...
✅ Yarn install completed successfully.
```

---

### 4. `--update-components`
(Coming next) Detects missing components based on ODS React and creates corresponding placeholder folders and files in `manager-ui-kit/src/components`.

**Example (planned):**
```bash
yarn muk-cli --update-components
```
Would create missing component directories and log the steps clearly.

---

### 5. `--update`
Runs both update steps (`--update-version` + `--update-components`) sequentially for full sync automation.

**Example:**
```bash
yarn muk-cli --update
```
**Output:**
```
🔁 Running full update (versions + components)
✔ Updated ODS versions successfully.
⚠ Created 5 missing component folders.
📦 manager-ui-kit is now fully up to date!
```

---

## 🧰 CLI Help

Run:
```bash
yarn muk-cli --help
```

**Available commands:**

| Command | Description |
|----------|-------------|
| `--check-versions` | Check npm for new ODS package versions |
| `--check-components` | Compare ODS vs Manager React components |
| `--update-version` | Update ODS versions in `package.json` |
| `--update-components` | Add missing component folders (planned) |
| `--update` | Run both updates sequentially |
| `--with-install` | (optional) Run \`yarn install\` after version updates |

> 💡 **Tip:** Output uses ANSI colors and icons (✔, ⚠, ℹ).  
> If running in CI or scripts, you can disable color or redirect to stderr via:
> ```js
> setLoggerMode('stderr'); // or 'silent' for no output
> ```

---

## 📂 Project Structure

```
manager-muk-cli/
├─ src/
│  ├─ commands/
│  │  ├─ check-versions.js        # Checks npm versions of ODS packages
│  │  ├─ check-components.js      # Compares ODS vs Manager component lists
│  │  ├─ update-version.js        # Updates ODS versions in package.json
│  │  └─ update-components.js     # Creates missing component folders
│  ├─ config/
│  │  └─ muk-config.js           # Central constants: paths, URLs, packages
│  ├─ utils/
│  │  ├─ log-manager.js          # Colorful logging utility (stdout/stderr modes)
│  │  └─ json-utils.js           # Safe JSON read/write helpers
│  └─ index.js                   # CLI entrypoint and command dispatcher
└─ package.json
```

---

## ⚙️ Configuration

All key constants (paths, URLs, and package targets) live in `src/config/muk-config.js`:

```js
export const TARGET_PACKAGES = [
  '@ovhcloud/ods-components',
  '@ovhcloud/ods-react',
  '@ovhcloud/ods-themes',
];

export const MUK_COMPONENTS_PATH = path.resolve('packages/manager-ui-kit');
export const MUK_COMPONENTS_SRC = path.join(
  MUK_COMPONENTS_PATH,
  'src',
  'components',
);
export const ODS_REACT_LATEST_URL = 'https://registry.npmjs.org/@ovhcloud%2Fods-react/latest';
```

---

## 🧠 Design Philosophy

- **Modular commands:** each task has its own file (`check`, `update-version`, `update-components`).
- **Composable CLI:** `--update` orchestrates both sub-tasks.
- **Idempotent and safe:** atomic JSON writes and safe folder creation.
- **Readable logs:** consistent, colorized output across all operations.

---

## License

BSD-3-Clause (c) OVH SAS
