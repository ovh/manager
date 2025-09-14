# Tests Coverage CLI — Combined Coverage Reports for Manager Apps

Generate **per-app** and **combined** test coverage reports across Manager apps/packages with a single command.  
This CLI builds selected apps, **runs tests with coverage** (Vitest/Jest), harvests each app’s
`coverage-summary.json` / `lcov.info`, and produces:

- Per-app folders under `tests-coverage-reports/<app>/`
- A **combined JSON**: `tests-coverage-reports/tests-coverage-combined-report.json`
- A **combined HTML**: `tests-coverage-reports/tests-coverage-combined-report.html`
  - Includes a compact table (Lines/Branches/Functions/Statements)
  - Plus collapsible **“Worst covered files”** per app (metric/threshold/count configurable)

---

## Usage

Run the CLI from the **root of the monorepo**.

### Auto-discover all apps

```bash
yarn manager-tests-coverage
```

### Single app

```bash
yarn manager-tests-coverage --app zimbra
```

### Multiple apps

```bash
yarn manager-tests-coverage --apps container,zimbra
```

### Single package

```bash
yarn manager-tests-coverage --package @ovh-ux/manager-container-app
```

### Multiple packages

```bash
yarn manager-tests-coverage --packages @ovh-ux/manager-zimbra-app,@ovh-ux/manager-pci-workflow-app
```

The CLI will:

1. `turbo run build` for the selected targets
2. `turbo run test` with coverage flags
3. Harvest coverage artifacts into `tests-coverage-reports/`
4. Create combined JSON + HTML summaries

---

## Output Layout

```
tests-coverage-reports/
├── container/
│   ├── coverage-summary.json
│   └── lcov.info
├── zimbra/
│   ├── coverage-summary.json
│   └── lcov.info
├── tests-coverage-combined-report.json
└── tests-coverage-combined-report.html
```

- Per-app files are copied from each app’s coverage output.
- The HTML includes color-coded percentages and a collapsible section listing the least-covered files per app (below your configured threshold).

---

## Configuration

Edit `configs/tests-coverage-config.ts` (in the static kit) to control the
“worst files” drill-down and table coloring:

```ts
export const testsCoverageConfig = {
  worstFiles: {
    metric: 'lines' as const, // 'lines' | 'branches' | 'functions' | 'statements'
    threshold: 60,            // Only show files below this %
    count: 10,                // Show top X least-covered files
  },
  thresholds: {
    green: 80,                // >= green → green
    orange: 60,               // >= orange → orange; else red
  },
};
```

---

## How coverage files are found

For each selected app, the CLI searches for:

- `coverage/coverage-summary.json` at the app root, or
- one-level deep: `<subdir>/coverage/coverage-summary.json`

If found, it also copies the adjacent `lcov.info` and `html/` report (optional).  
If no summary is found, the app is skipped and a warning is printed.

---

## Combined JSON shape

```json
{
  "apps": {
    "zimbra": {
      "lines":     { "total": 1234, "covered": 987, "pct": 79.97 },
      "branches":  { "total":  456, "covered": 300, "pct": 65.79 },
      "functions": { "total":  120, "covered":  98, "pct": 81.67 },
      "statements":{ "total": 1400, "covered": 1100,"pct": 78.57 }
    }
  },
  "totals": {
    "lines":     { "total": ..., "covered": ..., "pct": ... },
    "branches":  { "total": ..., "covered": ..., "pct": ... },
    "functions": { "total": ..., "covered": ..., "pct": ... },
    "statements":{ "total": ..., "covered": ..., "pct": ... }
  }
}
```

---

## Tips

- Keep tests deterministic; flaky tests can skew coverage.
- If your app nests the test project in a subfolder, the one-level deep scan should still find it.
- For large repos, prefer filtering with `--apps` / `--packages` to keep CI time in check.
