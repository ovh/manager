# Secrets (Secret Manager)

## What are Secrets?

Secrets are versioned key-value JSON payloads stored securely within an OKMS instance. They are designed for storing sensitive configuration data such as API keys, passwords, tokens, and connection strings.

Each secret:
- Has a **hierarchical path** (like a file path) used as its unique identifier
- Contains **JSON object data** (not arrays; must have unique, non-empty keys)
- Supports **multiple versions** with independent lifecycle states
- Can have **metadata** controlling versioning and expiration behavior

---

## Secret Path Rules

The secret path acts as both the identifier and the organizational structure for secrets. Paths follow these rules:

| Rule | Detail |
|------|--------|
| Allowed characters | `A-Z`, `a-z`, `0-9`, `.` `_` `:` `/` `=` `@` `-` |
| Cannot start with `/` | Paths must begin with a valid character segment |
| Cannot end with `/` | Paths must end with a valid character segment |
| Cannot contain `//` | No consecutive forward slashes |
| Length | 1–255 characters |

**Examples of valid paths:**
- `myapp/db/password`
- `prod/api-keys/stripe`
- `infra:core/tls_cert`

**Examples of invalid paths:**
- `/leading-slash` (starts with `/`)
- `trailing-slash/` (ends with `/`)
- `double//slash` (consecutive `/`)

---

## Secret Creation Form

### Fields

| Field | Rules |
|-------|-------|
| `path` | Required. Must satisfy all path rules above. Used as the secret's unique identifier within the instance. |
| `data` | Required. Must be a valid JSON **object** (not an array). Keys must be unique and non-empty. |

### Data Entry Modes

The `data` field supports two entry modes, and users can toggle between them:

| Mode | Description |
|------|-------------|
| Key-Value editor | A table-based interface where each row represents a key-value pair. Easier for simple secrets. |
| Raw JSON editor | A text area for writing raw JSON. Useful for complex or large payloads. |

Both modes are kept in sync — switching modes converts the current content.

### Optional Metadata

Each metadata option is independently toggleable. When disabled, the instance-level default applies.

| Field | Format | Description |
|-------|--------|-------------|
| `deactivateVersionAfter` | Duration string: `^(?:\d+[dhms])+$` (e.g., `7d`, `2h30m`, `1d12h`) | How long after creation a version is automatically deactivated. `0s` = disabled (never auto-deactivate). |
| `maxVersions` | Integer, 0–24,000 | Maximum number of versions to retain. When the limit is reached, the oldest version is deleted. `0` = unlimited. |
| `casRequired` | `active` \| `inactive` | Check-And-Set enforcement. When `active`, write operations must include the current version number to prevent concurrent update conflicts. |

---

## Secret Versioning

Every write to a secret creates a new **version**. Versions are numbered sequentially and each has its own lifecycle state.

### Version States

| State | Meaning |
|-------|---------|
| `ACTIVE` | The version is current and readable. |
| `DEACTIVATED` | The version has been deactivated (manually or via `deactivateVersionAfter`). Still exists but is flagged as inactive. |
| `DELETED` | The version has been permanently removed. |

### Create New Version

A new version can be created from the secret's detail view. The user provides:

| Field | Rules |
|-------|-------|
| `data` | Required. Must be a valid JSON object (same rules as secret creation). |

Submitting creates a new version with `ACTIVE` state. The previous latest version remains accessible in the version history.

### View Version Value

A version's data can be viewed by opening a **drawer** from the version list. The raw JSON payload is displayed in full.

### Delete Version

A specific version can be deleted via a **modal confirmation** from the version list. Deletion is permanent and transitions the version to `DELETED` state.

---

## Secret Metadata Edit

Secret metadata can be edited after creation via a **drawer** on the secret's detail view.

Editable fields:
- `deactivateVersionAfter`
- `maxVersions`
- `casRequired`

The drawer indicates, for each field, whether the current value is:
- **Instance default** — the value is inherited from the OKMS instance-level configuration.
- **Overridden** — a custom value has been set specifically for this secret.

Removing a custom override reverts the field to the instance default.

---

## OKMS-Level Secret Configuration

Each OKMS instance has a set of **default secret configuration** values that apply to all secrets within the instance unless overridden at the secret level.

These defaults are accessible and editable via a **drawer** in the OKMS instance dashboard.

| Field | Description |
|-------|-------------|
| `casRequired` | Default Check-And-Set enforcement for new secrets |
| `deactivateVersionAfter` | Default auto-deactivation duration for new secret versions |
| `maxVersions` | Default maximum version retention for new secrets |

Changes to instance-level defaults do not retroactively affect secrets that already have custom overrides.

---

## Secret Actions Summary

| Action | Entry Point | Description |
|--------|-------------|-------------|
| Delete secret | Secret list row / Secret dashboard | Permanently removes the secret and all its versions. Requires modal confirmation. |
| Edit metadata | Secret dashboard | Opens a drawer to edit `deactivateVersionAfter`, `maxVersions`, and `casRequired`. |
| Add version | Secret dashboard | Opens a drawer to submit new `data` for a new version. |
| View version value | Version list row | Opens a drawer displaying the full JSON payload of the selected version. |
| Delete version | Version list row | Modal confirmation to permanently delete a specific version. |
