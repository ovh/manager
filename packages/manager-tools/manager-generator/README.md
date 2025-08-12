# OVHcloud µ‑App Generator – Developer Guide

## 1) Architecture at a glance

**Separation of concerns**:

- **`src/kernel/`** — _Engine_ (stable): token replacement, template copier, Swagger discovery helpers, prompt helpers, constants. Avoid flavor logic here.
- **`src/playbook/`** — _Config & UX_ (change here): prompts, tokens resolution, types/schemas, high‑level “what goes into tokens.”
- **`src/presets/`** — optional presets (string‑only tokens + default answers).
- **`template/`** — the React app scaffold (with a **few** `{{token}}` placeholders).

**Runtime flow**:

```
(prompts / flags / answers.json)
          │
          ▼
src/playbook/tokens-main.ts  → validate & normalize → build base tokens → merge presets/env
          │
          ▼
bin/manager-generator.js  → resolveTokens() → applyTemplates() → post‑process booleans
          │
          ▼
 template/* (files written with tokens replaced)
```

---

## 2) Repository layout

```
bin/
  manager-generator.js                 # CLI entry – calls dist, fixes booleans
src/
  kernel/                              # engine (try to keep generic)
    api/                               # Swagger fetch/normalize
    config/
    prompts/
    template/
    tokens/
    types/
  playbook/                            # config + user‑facing UX
    config/
      playbook-constants.ts            # OUTPUT_BASE_DIR default path
    types/
    prompts-main.ts
    tokens-main.ts
    playbook-main.ts
  presets/
  template/
    package.json
    src/
      App.constants.ts
      routes/
      data/api/commons/
```

---

## 3) Data flow in more detail

1. **Collect answers** – Interactive (prompts) or non-interactive (flags).
2. **Resolve tokens** – Merge presets, normalize answers, coerce booleans to strings (`'true'|'false'`).
3. **Apply templates** – Copy template files, replace tokens, assert none remain unresolved.
4. **CLI post-step** – Convert quoted boolean-like strings to actual booleans.

---

## 4) Adding a new question

1. Add it to `GeneratorAnswers` and `AnswersSchema` in `src/playbook/types`.
2. Update prompts in `src/playbook/prompts-main.ts`.
3. Map to tokens in `buildBaseTokens()`.
4. Reference it in the template as `{{token}}` **with quotes** if boolean/number.

> **Pro tip**: Don’t forget to add it to `TokenMapSchema` or generation will fail.

---

## 5) Template tokens

Common ones in `template/src/App.constants.ts`:

- **Identity**: `{{appName}}`, `{{description}}`, `{{serviceKey}}`
- **Routing**: `{{isPci}}`, `{{routeFlavor}}`
- **APIs**: `{{listingApi}}`, `{{onboardingApi}}`
- **Tracking**: `{{level2EU}}`, `{{universe}}`

> **Boolean note**: Always quote boolean-like tokens in the template, e.g. `isPci: '{{isPci}}'` — the CLI will unquote them.

---

## 6) Swagger discovery

Helpers in `src/kernel/prompts/prompts-helper.ts` prepare endpoint choices, apply derivations, and guard valid selections.

---

## 7) Usage

**Note: Make sure to install all dependencies and build the generator before running any of the following commands.**

### Non-interactive (Dry-Run) Mode

`--dry-run` simulates generation without writing files to disk.  
Useful for verifying arguments, previewing created files, and ensuring no unresolved template tokens.

Example with explicit output path:
```bash
yarn manager-generator --non-interactive --dry-run   --appName demo   --appType full   --universe Manager   --subUniverse Manager   --region EU   --flavor generic   --language en   --framework React   --mainApiPath /me   --listingEndpointPath /me   --dashboardEndpointPath /me   --out ./_out/demo
```

Dry-run output will typically include:
- `(dry-run) write` and `(dry-run) mkdir` messages
- Key generated files such as:
  - `package.json`
  - `README.md`
  - `src/routes/Routes.tsx` or `src/Routes.tsx`

---

### Real Creation with Custom Output Path

If you specify `--out`, files will be generated in that directory (created if missing).

Example:
```bash
yarn manager-generator --non-interactive   --appName pci-demo   --appType pci   --universe Manager   --subUniverse Manager   --region EU   --flavor generic   --language en   --framework React   --mainApiPath /me   --listingEndpointPath /me/list   --dashboardEndpointPath /me/details   --out ./_out/pci-demo
```
Creates:
```
./_out/pci-demo
```

---

### Real Creation with Default Output Path

If `--out` is omitted, the generator uses:
```
OUTPUT_BASE_DIR = ./packages/manager/apps
```

Example:
```bash
yarn manager-generator --non-interactive   --appName pci-demo   --appType pci   --universe Manager   --subUniverse Manager   --region EU   --flavor generic   --language en   --framework React   --mainApiPath /me   --listingEndpointPath /me/list   --dashboardEndpointPath /me/details
```
Creates:
```
./packages/manager/apps/pci-demo
```

---

### Common Validation Rules (Error Cases)

The generator validates inputs before creating files:

| Validation | Example Failing Input | Example Error |
|------------|-----------------------|---------------|
| **Region must be supported** | `--region MARS` | `region must be one of: CA, EU, US` |
| **Required fields missing** | Omit `--mainApiPath` | `mainApiPath is required` |
| **API paths must start with '/'** | `--mainApiPath me` | `mainApiPath must start with '/'` |
| **appType must be valid** | `--appType nonsense` | `Invalid value for appType` |
| **mainApiPath version stripping** | `v6-/resource` | Strips `v6-` for serviceKey generation |
| **Token resolution** | No `{{ token }}` placeholders in output when successful | |

---

### Feature Examples

**Deriving `serviceKey` from listing endpoint:**
```bash
--listingEndpointPath /v2/users/list
```
Produces:
```ts
serviceKey: 'v2-users-list'
```

**Fallback `serviceKey` when listing is `/`:**
```bash
--appName My-App --listingEndpointPath /
```
Produces:
```ts
serviceKey: 'my-app-listing'
```

**PCI flag in constants:**
```bash
--appType pci
```
Produces in `App.constants.ts`:
```ts
isPci: true
```
(Unquoted boolean, appears only in `App.constants.ts`.)

---

### Idempotency

Running the same command twice on the same output directory should not change the file count, ensuring stable generation and no duplicates.

Example:
```bash
yarn manager-generator --non-interactive ... --out ./_out/idem
yarn manager-generator --non-interactive ... --out ./_out/idem
```
Both runs produce the same number of files.

---

## 8) Environment knobs

- `MANAGER_SWAGGER_BASE_V2` – Override Swagger v2 base URL.
- `MANAGER_SWAGGER_BASE_V6` – Override Swagger v6 base URL.

---

## 9) Contributing guardrails

- Keep `kernel/` generic and `playbook/` business-specific.
- All tokens are strings by contract.
- Booleans must be handled by post-step fixes.

---

## 10) Troubleshooting

- **Unresolved tokens**: Ensure `buildBaseTokens()` or presets supply them.
- **Quoted booleans**: Extend `fixGeneratedBooleans()` if adding new boolean tokens.
- **No endpoints**: Check Swagger base URLs.
