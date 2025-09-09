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

## 🤝 Contribution

- Use clear, descriptive naming (e.g., `appFolders`, `packageNames`, `parseCliTargets`).
- Run `yarn lint` and `yarn build` before submitting PRs.
- Reports are meant for **CI/CD validation** and **developer awareness**.

---

## 📖 References

- [HTTP Archive Page Weight Report](https://httparchive.org/reports/page-weight)
- [web.dev Performance Guide](https://web.dev/performance)
- [patterns.dev Performance Patterns](https://www.patterns.dev/)  
