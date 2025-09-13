# 📊 TypeScript Types Coverage

A developer and CI/CD utility for analyzing **TypeScript type coverage** of Manager React apps.  
It generates **per-app reports** and a **combined JSON + HTML dashboard** with detailed coverage stats and worst covered files.

---

## 🚀 Overview

This toolkit runs the **type-coverage CLI** across selected Manager apps or packages, collects per-file stats, and merges them into aggregated reports.

It provides:

- **Per-app reports**: HTML + JSON with coverage breakdowns.
- **Combined reports**: A global JSON + HTML dashboard with totals.
- **Color-coded status**:
  * 🟢 Green: above threshold
  * 🟠 Orange: between warning and pass thresholds
  * 🔴 Red: below warning threshold
- **Worst covered files**: Top N files below the configured threshold.
- **Interactive details**: Collapsible tables per app.

---

## 🏃 Usage

Run the CLI from the **root of the monorepo**.

### Analyze all apps (auto-discovery)

```bash
yarn manager-types-coverage
```

This will:
1. Discover all **React apps** under `manager/apps`.
2. Run **type-coverage** for them.
3. Generate **combined reports**:
  - `types-coverage-reports/types-coverage-combined-report.json`
  - `types-coverage-reports/types-coverage-combined-report.html`

---

### Analyze specific apps (by folder name)

```bash
yarn manager-types-coverage --apps container,zimbra
```

or single app:

```bash
yarn manager-types-coverage --app zimbra
```

> Here you provide **app folders** located under `manager/apps`.

---

### Analyze specific packages (by `package.json` name)

```bash
yarn manager-types-coverage --packages @ovh-ux/manager-container-app,@ovh-ux/manager-zimbra-app
```

or single package:

```bash
yarn manager-types-coverage --package @ovh-ux/manager-container-app
```

> In this mode:
> - The CLI resolves packages to their corresponding **apps**.
> - Reports still run per app folder.

---

### Mixed valid + invalid apps or packages

- Valid apps will generate reports.
- Invalid ones are ignored.
- Exit code = **0** if at least one valid app/package is processed.

```bash
yarn manager-types-coverage --apps zimbra,unknown-app,container
yarn manager-types-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-ghost-app
```

### All invalid apps/packages

- If all targets are invalid, exit code = **1**.

```bash
yarn manager-types-coverage --apps doesnotexist1,doesnotexist2
yarn manager-types-coverage --packages @ovh-ux/manager-ghost-app,@ovh-ux/manager-missing-app
```

---

## 📂 Output Structure

```
types-coverage-reports/
├── manager-container-app/
│   ├── typescript-coverage.json
│   ├── index.html
│   └── files/
│       ├── src_App.tsx.html
│       └── ...
├── manager-zimbra-app/
│   ├── typescript-coverage.json
│   ├── index.html
│   └── files/
│       └── ...
├── types-coverage-combined-report.json
├── types-coverage-combined-report.html
```

---

## 🔎 JSON Report Format

Example (`types-coverage-combined-report.json`):

```json
{
  "apps": {
    "zimbra": {
      "covered": 25760,
      "total": 26213,
      "percentage": 98.27,
      "worstFiles": [
        ["src/components/index.ts", { "covered": 0, "total": 0, "percentage": 0 }],
        ["src/data/api/domain/index.ts", { "covered": 0, "total": 0, "percentage": 0 }]
      ]
    }
  },
  "totalCovered": 25760,
  "totalTypes": 26213,
  "percentage": 98.27
}
```

---

## 🌐 HTML Report

- Global summary at the top (all apps).
- Color-coded per-app coverage table.
- Collapsible sections with **worst files** (below threshold).
- Per-app drilldown (links to `index.html` and file-level pages).

---

## ✅ Validation Tests

To ensure the CLI behaves correctly in different scenarios, run:

```bash
yarn manager-types-coverage-tests
```

This executes predefined scenarios (see `scripts/types-coverage-tests.js`):

1. Single app (`--app zimbra`)
2. Multiple apps
3. Single package
4. Multiple packages
5. Mixed valid + invalid apps/packages
6. All invalid apps/packages (expected fail)

If all tests succeed, you’ll see:

```
🎉 All types-coverage-tests CLI validation tests passed!
```

If one or more fail, the script will list them and exit with a non-zero status code.

---

## ⚙️ Configuration

See [`configs/types-coverage-config.ts`](../../../configs/types-coverage-config) to adjust:

- Coverage thresholds (`green`, `orange`, `red`).
- Worst files detection (`threshold`, `count`).

---

## 🤝 Contribution

- Use clear, descriptive naming.
- Run `yarn lint` and `yarn build` before submitting PRs.
- Reports are designed for **CI/CD validation** and **developer awareness**.

---
