# OVHcloud µ-App Generator – Developer Guide

## 1) Architecture at a glance

**Separation of concerns**:

- **`src/kernel/`** — _Engine_ (stable): token replacement, template copier, Swagger discovery helpers, prompt helpers, constants. Avoid flavor logic here.
- **`src/playbook/`** — _Config & UX_ (change here): prompts, tokens resolution, types/schemas, high-level “what goes into tokens.”
- **`src/presets/`** — optional presets (string-only tokens + default answers).
- **`template/`** — the React app scaffold (with a **few** `{{token}}` placeholders).

**Runtime flow**:

```
(prompts / flags / answers.json)
          │
          ▼
src/playbook/tokens-main.ts  → validate & normalize → build base tokens → merge presets/env
          │
          ▼
bin/manager-generator.js  → resolveTokens() → applyTemplates() → post-processors
          │
          ▼
 template/* (files written with tokens replaced)
```

> Boolean unquoting (e.g. `isPci: 'true'` → `isPci: true`) is handled by **applyTemplates() post-processors** on `App.constants.ts`.

---

## 2) Repository layout

```
bin/
  manager-generator.js                 # CLI entry – calls dist, optional extra fixes
src/
  kernel/                              # engine (try to keep generic)
    api/                               # Swagger fetch/normalize
    commons/
      utils/                           # strings-utils, paths-utils, merge-utils, template-utils, ...
    config/
    prompts/
    template/
    tokens/
    types/
  playbook/                            # config + user-facing UX
    config/
      playbook-constants.ts            # OUTPUT_BASE_DIR default path
    types/
    prompts-main.ts
    tokens-main.ts
    playbook-main.ts
  presets/
template/
  package.json
  public/
    translations/
      dashboard/
        Messages_en_GB.json
        Messages_fr_FR.json
        Messages_de_DE.json
        ...
      onboarding/
        Messages_en_GB.json
        Messages_fr_FR.json
        Messages_de_DE.json
        ...
  src/
    App.constants.ts
    routes/
    data/api/commons/
```

---

## 3) Data flow in more detail

1. **Collect answers** – Interactive (prompts) or non-interactive (flags).
2. **Resolve tokens** – Merge presets/env, normalize answers, coerce booleans to strings (`'true'|'false'`).
3. **Apply templates** – Copy template files, replace tokens, assert none remain unresolved.
4. **Post-process** – `applyTemplates()` built-in post-processors (e.g., unquote booleans in `App.constants.ts`).

---

## 4) Adding a new question

1. Add it to `GeneratorAnswers` and `AnswersSchema` in `src/playbook/types`.
2. Update prompts in `src/playbook/prompts-main.ts`.
3. Map to tokens in `buildBaseTokens()`.
4. Reference it in the template as `{{token}}` **with quotes** if boolean/number.

> **Pro tip**: Add it to `TokenMapSchema` or generation will fail.

---

## 5) Template tokens

Common ones in `template/src/App.constants.ts`:

- **Identity**: `{{appName}}`, `{{description}}`, `{{serviceKey}}`
- **Routing**: `{{isPci}}`, `{{routeFlavor}}`
- **APIs**: `{{listingApi}}`, `{{onboardingApi}}`
- **Tracking**: `{{level2EU}}`, `{{universe}}`

> **Boolean note**: Always quote boolean-like tokens in the template, e.g. `isPci: '{{isPci}}'` — post-processors will unquote them in the output.

### 5.1) Translations (i18n) – dashboard & onboarding

The template ships locale files for both **dashboard** and **onboarding** screens:

```
template/public/translations/
  dashboard/
    Messages_en_GB.json
    Messages_fr_FR.json
    Messages_de_DE.json
    ...
  onboarding/
    Messages_en_GB.json
    Messages_fr_FR.json
    Messages_de_DE.json
    ...
```

- **File naming**: `Messages_<lang>_<REGION>.json` (e.g. `Messages_de_DE.json`).
- **Placeholders**: You may use generator tokens inside JSON values (e.g., `{{productName}}`, `{{productCategory}}`, `{{linkDiscover}}`). These are replaced **at generation time** exactly like in TS/TSX files.
- **Validation**: Generation asserts that no `{{token}}` remains unresolved in translated JSON.

**Example (`template/public/translations/onboarding/Messages_de_DE.json`):**
```json
{
  "title_fallback": "Willkommen bei {{productName}}",
  "description_part1": "Erfahren Sie, wie Sie das Beste aus {{productName}} herausholen, der {{productCategory}}.",
  "guides": {
    "guide1": {
      "category": "Entdecken",
      "title": "Erste Schritte mit {{productName}}",
      "description": "Erfahren Sie die Grundlagen für den Einstieg.",
      "cta": "Entdecken"
    }
  },
  "links": {
    "discover": "{{linkDiscover}}",
    "tutorial": "{{linkTutorial}}",
    "faq": "{{linkFaq}}"
  }
}
```

**Runtime usage:**
```ts
import { useTranslation } from 'react-i18next';

// Dashboard namespace
const { t } = useTranslation('dashboard');
t('title');

// Onboarding namespace
const { t: tOn } = useTranslation('onboarding');
tOn('guides.guide1.title');
```

**Add a new locale:**
1. Copy any existing `Messages_en_GB.json` to your target locale in **both** `dashboard/` and `onboarding/`.
2. Translate values; keep placeholders like `{{productName}}` intact.
3. Run a dry-run to verify there are no unresolved tokens:
   ```bash
   yarn manager-generator --non-interactive --dry-run ... --out ./_out/demo
   ```

---

## 6) Swagger discovery

Helpers in `src/kernel/prompts/prompts-helper.ts` prepare endpoint choices, apply derivations, and guard valid selections.

- Normalize server-returned paths with `normalizePath()` before matching against user input.
- Use `braceAwareBasePath()` for grouping choices under headers.
- When preparing choices, run them through `normalizePath()` to keep formats consistent.

---

## 7) Usage

> **Note:** install dependencies and build the generator before running any of the following commands.

### Non-interactive (Dry-Run) Mode

`--dry-run` simulates generation without writing files to disk.

```bash
yarn manager-generator --non-interactive --dry-run   --appName demo --appType full   --universe Manager --subUniverse Manager   --region EU --flavor generic --language en --framework React   --mainApiPath /me --listingEndpointPath /me --dashboardEndpointPath /me   --out ./_out/demo
```

Dry-run output typically shows:
- `(dry-run) write` and `(dry-run) mkdir`
- Keys like `package.json`, `README.md`, `src/routes/Routes.tsx` (or `src/Routes.tsx`)

### Real creation with custom output path

```bash
yarn manager-generator --non-interactive   --appName pci-demo --appType pci   --universe Manager --subUniverse Manager   --region EU --flavor generic --language en --framework React   --mainApiPath /me --listingEndpointPath /me/list --dashboardEndpointPath /me/details   --out ./_out/pci-demo
```

Creates:
```
./_out/pci-demo
```

### Real creation with default output path

If `--out` is omitted, the generator uses:
```
OUTPUT_BASE_DIR = ./packages/manager/apps
```

Example:
```bash
yarn manager-generator --non-interactive   --appName pci-demo --appType pci   --universe Manager --subUniverse Manager   --region EU --flavor generic --language en --framework React   --mainApiPath /me --listingEndpointPath /me/list --dashboardEndpointPath /me/details
```

Creates:
```
./packages/manager/apps/pci-demo
```

---

## 8) Common validation rules (error cases)

| Validation | Example Failing Input | Example Error |
|---|---|---|
| **Region must be supported** | `--region MARS` | `region must be one of: CA, EU, US` |
| **Required fields missing** | omit `--mainApiPath` | `mainApiPath is required` |
| **API paths must start with '/'** | `--mainApiPath me` | `mainApiPath must start with '/'` |
| **appType must be valid** | `--appType nonsense` | `Invalid value for appType` |
| **Version stripping** | `v6-/resource` | `serviceKey` derived from stripped base (`resource`) |
| **Token resolution** | unresolved `{{ token }}` | generation fails (assert) |

---

## 9) Feature examples

**Deriving `serviceKey` from listing endpoint**
```bash
--listingEndpointPath /v2/users/list
```
Produces:
```ts
serviceKey: 'v2-users-list'
```

**Fallback `serviceKey` when listing is `/`**
```bash
--appName My-App --listingEndpointPath /
```
Produces:
```ts
serviceKey: 'my-app-listing'
```

**PCI flag in constants**
```bash
--appType pci
```
Produces in `App.constants.ts`:
```ts
isPci: true
```
(Unquoted boolean, appears only in `App.constants.ts`.)

---

## 10) Idempotency

Running the same command twice on the same output directory should not change the file count (stable generation, no duplicates).

```bash
yarn manager-generator --non-interactive ... --out ./_out/idem
yarn manager-generator --non-interactive ... --out ./_out/idem
```

---

## 11) Environment knobs

- `MANAGER_SWAGGER_BASE_V2` – Override Swagger v2 base URL.
- `MANAGER_SWAGGER_BASE_V6` – Override Swagger v6 base URL.

---

## 12) Contributing guardrails

- Keep `kernel/` generic and `playbook/` business-specific.
- All tokens are **strings** by contract.
- Boolean tokens are unquoted via **post-processors** (do not hardcode booleans in templates).
- Prefer new helpers from `strings-utils`, `paths-utils`, `merge-utils` over ad-hoc implementations.
- Use `assertStartsWithSlash()` / `ensureLeadingSlash()` rather than inline checks.
- Normalize endpoints with `normalizePath(path, { braceAware: true })`.

---

## 13) Troubleshooting

- **“Unresolved tokens”**: ensure `buildBaseTokens()` / presets supply them; templates must quote boolean-like spots.
- **Quoted booleans still present**: check post-processors wiring in `apply-templates.ts`.
- **No endpoints shown**: verify Swagger base URLs and network; try `MANAGER_SWAGGER_BASE_*` envs.
- **Invalid path errors**: use `ensureLeadingSlash()` or `assertStartsWithSlash()`; avoid manual string ops.
- **Same path, different formatting**: normalize with `normalizePath()` before comparisons.
