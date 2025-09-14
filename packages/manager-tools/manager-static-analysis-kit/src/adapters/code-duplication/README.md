# 🧬 Code Duplication Analysis

A developer and CI/CD utility for analyzing **code duplication** across Manager React apps using **jscpd**.  
It generates **per-app reports** and a **combined JSON + HTML dashboard** with detailed duplication stats and worst duplicated files.

---

## 🚀 Overview

This toolkit runs **jscpd** across selected Manager apps or packages, collects per-file duplicate blocks, and merges them into aggregated reports.

It provides:

- **Per-app reports**: HTML + JSON with duplication breakdowns.
- **Combined reports**: A global JSON + HTML dashboard with totals.
- **Color-coded status** (config-driven) by app duplication %:
  - 🟢 **Green**: `% < thresholds.green`
  - 🟠 **Orange**: `thresholds.green ≤ % < thresholds.orange`
  - 🔴 **Red**: `% ≥ thresholds.orange`
  - _Defaults: green = 10, orange = 20._
- **Worst duplicated files**: Top **N** files with duplication `≥ threshold` (default **5%**).
  - Prioritization: **TS/TSX** → **JS/JSX** → others ( `.d.ts` is demoted to “others” ).
  - Paths displayed as `apps/<appName>/…` (full absolute path shown on hover).
- **Interactive details**: Collapsible tables per app.

---

## 🏃 Usage

Run the CLI from the **root of the monorepo**.

### Analyze all apps (auto-discovery)

```bash
yarn manager-code-duplication
```

This will:
1. Discover all **React apps** under `manager/apps`.
2. Run **jscpd** for them.
3. Generate **combined reports**:
- `code-duplication-reports/code-duplication-combined-report.json`
- `code-duplication-reports/code-duplication-combined-report.html`

---

### Analyze specific apps (by folder name)

```bash
yarn manager-code-duplication --apps container,zimbra
```

or single app:

```bash
yarn manager-code-duplication --app zimbra
```

> Provide **app folders** located under `manager/apps`.

---

### Analyze specific packages (by `package.json` name)

```bash
yarn manager-code-duplication --packages @ovh-ux/manager-container-app,@ovh-ux/manager-zimbra-app
```

or single package:

```bash
yarn manager-code-duplication --package @ovh-ux/manager-container-app
```

> In this mode:
> - The CLI resolves packages to their corresponding **apps**.
> - Reports still run per app folder.

---

### Mixed valid + invalid apps or packages

- Valid apps will generate reports; invalid ones are ignored.
- Exit code = **0** if at least one valid app/package is processed.

```bash
yarn manager-code-duplication --apps zimbra,unknown-app,container
yarn manager-code-duplication --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app
```

### All invalid apps/packages

- If all targets are invalid, exit code = **1**.

```bash
yarn manager-code-duplication --apps doesnotexist1,doesnotexist2
yarn manager-code-duplication --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app
```

---

## 📂 Output Structure

```
code-duplication-reports/
├── manager-container-app/
│   ├── jscpd-report.json
│   └── index.html
├── manager-zimbra-app/
│   ├── jscpd-report.json
│   └── index.html
├── code-duplication-combined-report.json
├── code-duplication-combined-report.html
```

---

## 🔎 JSON Report Format

Example (`code-duplication-combined-report.json`):

```json
{
  "apps": {
    "container": {
      "totalLines": 23106,
      "totalTokens": 0,
      "duplicateLines": 254,
      "duplicateTokens": 0,
      "percentage": 1.10,
      "clonesCount": 17,
      "worstFiles": [
        ["apps/container/src/container/legacy/account-sidebar/UsefulLinks/constants.ts", { "duplicatedLines": 56, "totalLines": 86, "percentage": 65.12 }],
        ["apps/container/src/container/common/urls-constants.ts", { "duplicatedLines": 30, "totalLines": 91, "percentage": 32.97 }]
      ]
    }
  },
  "totalLines": 23106,
  "totalTokens": 0,
  "totalDuplicateLines": 254,
  "totalDuplicateTokens": 0,
  "percentage": 1.10
}
```

> Notes:
> - `worstFiles` are filtered by a configurable **threshold** and capped to **N** items.
> - File paths are shortened to start at `apps/<appName>/…` in HTML, with a tooltip containing the full path.

---

## 🌐 HTML Report

- Global totals at the top (all apps).
- Color-coded per-app table using the UI thresholds described above.
- Collapsible **Worst duplicated files** per app:
  - Shows **duplicated/total lines** and **%**.
  - Orders files by **TS/TSX → JS/JSX → others**, then by **% desc**, **duplicated lines desc**, **total lines desc**.
  - `.d.ts` files are listed in the “others” bucket.

---

## ✅ Validation Tests

Run the predefined CLI validation scenarios:

```bash
yarn manager-code-duplication-tests
```

This executes cases like:

1. Single app (`--app zimbra`)
2. Multiple apps
3. Single package
4. Multiple packages
5. Mixed valid + invalid apps/packages
6. All invalid apps/packages (expected fail)

If all tests succeed, you’ll see:

```
🎉 All code-duplication-tests CLI validation tests passed!
```

If any fail, the script lists them and exits non-zero.

---

## ⚙️ Configuration

See `configs/code-duplication-config.ts` to adjust:

```ts
export const codeDuplicationConfig = {
  // jscpd detection sensitivity (defaults aligned with jscpd)
  minTokens: 50,
  minLines: 5,
  maxLines: 2000,
  maxSize: '500kb',

  // Exit threshold (%). If duplication > threshold, jscpd exits non-zero.
  // Keep `null` to NOT fail CI; set e.g. 10 to enforce.
  threshold: null,

  // mild | weak | strict (weak ignores comments/whitespace)
  mode: 'weak',

  // Include absolute paths in reports
  absolute: true,

  // Formats to analyze (empty = all supported formats)
  formats: [],

  // Ignore globs
  ignore: sharedExclusionPatterns,

  // Reporters used by the pipeline
  reporters: ['html', 'json', 'console'],

  // Worst duplicated files (used in combined HTML)
  worstFiles: {
    threshold: 5, // include files with ≥ 5% duplicated lines
    count: 10     // show top 10 files
  }
};
```

> **UI status colors** are currently fixed in the HTML renderer (Green `<10%`, Orange `≥10% & <20%`, Red `≥20%`).  
> If you want these configurable later, add a `statusThresholds` section and use it in the renderer.

---

## 🛠 Implementation Notes

- Uses **jscpd v4 JSON** as the detector output.
- Per-file totals are computed robustly:
  1. **Read the file** to count lines when available,
  2. Else **fallback** to the max `endLoc.line` seen in duplicates,
  3. Ensure denominator ≥ duplicated lines (avoid >100% / div-by-zero).
- **Extension priority** for “worst files”:
  - **0**: `.ts`, `.tsx`, `.mts`, `.cts` (except `.d.ts`)
  - **1**: `.js`, `.jsx`, `.mjs`, `.cjs`
  - **2**: everything else (including `.d.ts`)
- **Path display**: Absolute paths are shortened to `apps/<appName>/…` in HTML, with a tooltip preserving the full path.
