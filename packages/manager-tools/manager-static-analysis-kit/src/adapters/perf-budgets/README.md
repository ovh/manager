# 📊 Performance Budgets Toolkit

A developer and CI/CD utility for analyzing **bundle sizes of Manager React apps**, comparing them against **HTTP Archive medians**, and generating **combined JSON & HTML reports**.

---

## 🚀 Overview

This toolkit runs **`vite-bundle-analyzer`** across selected Manager apps or packages, collects asset size reports, and evaluates them against **performance budgets**.

It provides:

- **Per-target reports**: HTML + JSON with bundle breakdowns.
- **Combined reports**: A global JSON + HTML dashboard with medians and status.
- **Color-coded status**:
  * 🟢 OK: below threshold
  * 🟠 Near: >= 80% of median
  * 🔴 Exceed: above 100% of median
- **Inline asset insights**: Shows total size **and heaviest asset per type** (JS, CSS, HTML, Images).
- **Details dropdown**: Top N assets per target (default: 5).
- **Optimization tips**: Actionable best practices with references.

---

## 🏃 Usage

Run the CLI from the **root of the monorepo**.

### Analyze all apps (auto-discovery)

```bash
yarn manager-perf-budgets
```

This will:
1. Discover all **React apps** under `manager/apps`.
2. Run **Turbo** build for them.
3. Run **vite-bundle-analyzer** for each app (HTML + JSON reports).
4. Generate **combined reports**:
- `perf-budgets-reports/perf-budgets-combined-report.json`
- `perf-budgets-reports/perf-budgets-combined-report.html`

---

### Analyze specific apps (by folder name)

```bash
yarn manager-perf-budgets --apps container,zimbra
```

or single app:

```bash
yarn manager-perf-budgets --app zimbra
```

> Here you provide **app folders** located under `manager/apps`.  
> The CLI will map these folders to their corresponding `package.json` names for Turbo.

---

### Analyze specific packages (by `package.json` name)

```bash
yarn manager-perf-budgets --packages @ovh-ux/manager-container-app,@ovh-ux/manager-zimbra-app
```

or single package:

```bash
yarn manager-perf-budgets --package @ovh-ux/manager-container-app
```

> In this mode:
> - Turbo filters use the **package names** directly.
> - Analyzer still runs on the corresponding **app folders**.  
    >   (e.g. `@ovh-ux/manager-zimbra-app` → `manager/apps/zimbra`)

---

## 📂 Output Structure

```
perf-budgets-reports/
├── manager-catalog-app/
│   ├── bundle-report.html
│   ├── bundle-report.json
├── manager-hub-app/
│   ├── bundle-report.html
│   ├── bundle-report.json
├── perf-budgets-combined-report.json
├── perf-budgets-combined-report.html
```

---

## 🔎 JSON Report Format

Example (`perf-budgets-combined-report.json`):

```json
{
  "results": [
    {
      "app": "manager-catalog-app",
      "jsKb": 4534.0,
      "cssKb": 790.1,
      "htmlKb": 0.8,
      "imgKb": 0,
      "jsStatus": "exceed",
      "cssStatus": "exceed",
      "htmlStatus": "ok",
      "imgStatus": "ok",
      "assets": [
        { "filename": "index.js", "type": "js", "sizeKb": 4126.8 },
        { "filename": "main.css", "type": "css", "sizeKb": 789.9 }
      ]
    }
  ],
  "scores": [
    {
      "app": "manager-catalog-app",
      "scores": { "js": 2, "css": 2, "html": 0, "img": 0 },
      "totalScore": 4,
      "status": "fail"
    }
  ],
  "medians": {
    "jsKb": 747.5,
    "cssKb": 86.8,
    "imgKb": 1066.6,
    "htmlKb": 35.5
  }
}
```

---

## 🌐 HTML Report

- Shows medians at the top (with HTTP Archive references).
- Color-coded per-app analysis table.
- Inline **total vs heaviest asset** per type.
- Dropdown with top N assets.
- Embedded optimization tips.

---

## ✅ Validation Tests

To ensure the CLI behaves correctly in different scenarios, you can run the following commands.  
Assume these apps exist under `manager/apps`: **zimbra**, **pci-ai-tools**, **pci-workflow**, **container**.

### 1. Auto-discovery (all apps)
```bash
yarn manager-perf-budgets
```
- Should analyze all React apps under `manager/apps`.

### 2. Single app (folder)
```bash
yarn manager-perf-budgets --app zimbra
```
- Should analyze only `zimbra`.

### 3. Multiple apps (folders)
```bash
yarn manager-perf-budgets --apps container,zimbra
```
- Should analyze `container` and `zimbra`.

### 4. Single package
```bash
yarn manager-perf-budgets --package @ovh-ux/manager-container-app
```
- Resolves to `container` and analyzes it.

### 5. Multiple packages
```bash
yarn manager-perf-budgets --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app
```
- Resolves to `zimbra` and `pci-workflow`.

### 6. Mixed valid + invalid apps
```bash
yarn manager-perf-budgets --apps zimbra,unknown-app,container
```
- Logs error for `unknown-app`, continues with `zimbra` and `container`.

### 7. Mixed valid + invalid packages
```bash
yarn manager-perf-budgets --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app
```
- Logs error for `manager-ghost-app`, continues with `zimbra`.

### 8. All invalid apps
```bash
yarn manager-perf-budgets --apps doesnotexist1,doesnotexist2
```
- Logs errors, exits with status `1`.

### 9. All invalid packages
```bash
yarn manager-perf-budgets --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app
```
- Logs errors, exits with status `1`.

### 10. Turbo build failure simulation
(break one app’s build, e.g. remove `package.json` temporarily)
```bash
yarn manager-perf-budgets --app pci-ai-tools
```
- Logs Turbo build failure warning.
- Analyzer still runs if possible.

---


---

## 🧪 Automated Validation CLI

In addition to manual commands, you can run **all validation tests automatically** using the provided CLI:

```bash
yarn perf-budgets:tests
```

This will execute a series of predefined scenarios:

- Auto-discovery of all apps
- Single app analysis
- Multiple apps analysis
- Single/multiple package analysis
- Mixed valid + invalid inputs
- All invalid inputs (expected to fail)
- Turbo build failure simulation

Each test runs `yarn manager-perf-budgets ...` with different arguments and validates exit codes.

If all tests succeed, you’ll see:

```
🎉 All perf-budgets CLI validation tests passed!
```

If one or more fail, the script will list them and exit with a non-zero status code.


## 🤝 Contribution

- Use clear, descriptive naming (e.g., `appFolders`, `packageNames`, `parseCliTargets`).
- Run `yarn lint` and `yarn build` before submitting PRs.
- Reports are meant for **CI/CD validation** and **developer awareness**.

---

## 📖 References

- [HTTP Archive Page Weight Report](https://httparchive.org/reports/page-weight)
- [web.dev Performance Guide](https://web.dev/performance)
- [patterns.dev Performance Patterns](https://www.patterns.dev/)  
