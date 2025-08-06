# 🛠️ Manager CLI — OVH Manager Monorepo Automation Toolkit

The `@ovh-ux/manager-cli` is a developer productivity tool built to assist in automating repetitive migration, transformation, and verification tasks across µ-applications in the OVH Manager monorepo.

---

## 📦 Package Metadata

```json
{
  "name": "@ovh-ux/manager-cli",
  "description": "Manager CLI automation packages",
  "license": "BSD-3-Clause"
}
```

---

## 🧭 Supported Commands

| Command                  | Description |
|--------------------------|-------------|
| `routes-migrate`         | Migrate JSON-based routing to React Router JSX |
| `tests-migrate`          | Migrate unit/integration test setups to shared configs |
| `duplicated-translations`| Detect and flag duplicate i18n keys |
| `static-analysis-migrate`| Migrate ESLint and TypeScript to static-analysis-kit |
| `migrations-status`      | Audit migration statuses across all apps |

---

## 📘 Usage

```bash
yarn manager-cli <command> [--app <app-name>] [--testType <unit|integration>] [--framework <jest|vitest>] [--dry-run] [--type <routes|tests|swc>] [--format <json|html>]
```

### Help and App Listing

```bash
yarn manager-cli --help     # Show help & examples
yarn manager-cli --list     # List available apps in packages/manager/apps
```

### Example Commands

```bash
# Migrate routes in "zimbra" app
yarn manager-cli routes-migrate --app zimbra

# Run test config migration for unit tests
yarn manager-cli tests-migrate --app zimbra --testType unit

# Run static analysis migration (ESLint & TS)
yarn manager-cli static-analysis-migrate --app zimbra

# Preview without changing files
yarn manager-cli routes-migrate --app zimbra --dry-run

# Get full status report
yarn manager-cli migrations-status --type all --format html
```

---

## 🧰 Internals

The CLI delegates to local scripts:

```json
"scripts": {
  "manager-cli": "node ./manager-cli.mjs",
  "routes-migrate": "node ./routes-migrate/json-to-component-route-migration.mjs",
  "tests-migrate": "node ./tests-migrate/common-tests-config-migration.mjs",
  "duplicated-translations": "node ./translations-checker/check-duplicated-translations.mjs",
  "static-analysis-migrate": "node ./static-analysis-migrate/static-analysis-migration.mjs",
  "migrations-status": "node migrations-status/generate-migrations-status-reports.mjs"
}
```

---

## 🔍 App Resolution

Applications are resolved under:

```
packages/manager/apps/
```

Use:

```bash
yarn manager-cli --list
```

To list all detected µ-apps.

---

## 🧪 Flags Summary

| Flag                | Description |
|---------------------|-------------|
| `--app <name>`      | Target µ-app name |
| `--dry-run`         | Preview without writing changes |
| `--testType`        | `unit` or `integration` |
| `--framework`       | `jest`, `vitest`, etc. |
| `--type`            | Migration type: `routes`, `tests`, `swc`, `all` |
| `--format`          | Output format: `json`, `html` |
| `--help` / `-h`     | Show usage |
| `--list`            | List available apps |

---

## 📜 License

BSD-3-Clause — © OVH SAS
