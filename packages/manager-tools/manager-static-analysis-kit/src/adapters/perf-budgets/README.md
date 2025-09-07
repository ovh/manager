# 📊 Performance Budgets Toolkit

A developer and CI/CD utility for analyzing **bundle sizes of Manager React apps**, comparing them against **HTTP Archive medians**, and generating **combined JSON & HTML reports**.

---

## 🚀 Overview

This toolkit runs **`vite-bundle-analyzer`** across all (or specific) Manager apps, collects asset size reports, and evaluates them against **performance budgets**.

It provides:

- **Per-app reports**: HTML + JSON with bundle breakdowns.
- **Combined reports**: A global JSON + HTML dashboard with medians and status.
- **Color-coded status**:
  - 🟢 OK – below threshold
  - 🟠 Near – >= 80% of median
  - 🔴 Exceed – above 100% of median
- **Inline asset insights**: Shows total size **and heaviest asset per type** (JS, CSS, HTML, Images).
- **Details dropdown**: Top N assets per app (default: 5).
- **Optimization tips**: Actionable best practices with references.

---

## 🏃 Usage

Run the CLI from the **root of the monorepo**:

### Analyze all apps

```bash
yarn manager-perf-budgets
```

This will:
1. Run **Turbo** build for all apps under `packages/manager/apps`.
2. Run **vite-bundle-analyzer** for each app (HTML + JSON reports).
3. Generate **combined reports**:
  - `perf-budgets-reports/perf-budgets-combined-report.json`
  - `perf-budgets-reports/perf-budgets-combined-report.html`

### Analyze a single app

```bash
yarn manager-perf-budgets --app manager-catalog-app
```

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

- Follow the existing code style and TypeScript types.
- Run `yarn lint` and `yarn build` before submitting PRs.
- Reports are meant for **CI/CD validation** and **developer awareness**.

---

## 📖 References

- [HTTP Archive Page Weight Report](https://httparchive.org/reports/page-weight)
- [web.dev Performance Guide](https://web.dev/performance)
- [patterns.dev Performance Patterns](https://www.patterns.dev/)
