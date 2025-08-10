# OVHcloud µ‑App Generator – Developer Guide

## 0) Architecture at a glance

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

## 1) Repository layout

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

## 2) Data flow in more detail

1. **Collect answers** – Interactive (prompts) or non-interactive (flags).
2. **Resolve tokens** – Merge presets, normalize answers, coerce booleans to strings (`'true'|'false'`).
3. **Apply templates** – Copy template files, replace tokens, assert none remain unresolved.
4. **CLI post-step** – Convert quoted boolean-like strings to actual booleans.

---

## 3) Adding a new question

1. Add it to `GeneratorAnswers` and `AnswersSchema` in `src/playbook/types`.
2. Update prompts in `src/playbook/prompts-main.ts`.
3. Map to tokens in `buildBaseTokens()`.
4. Reference it in the template as `{{token}}` **with quotes** if boolean/number.

> **Pro tip**: Don’t forget to add it to `TokenMapSchema` or generation will fail.

---

## 4) Template tokens

Common ones in `template/src/App.constants.ts`:

- **Identity**: `{{appName}}`, `{{description}}`, `{{serviceKey}}`
- **Routing**: `{{isPci}}`, `{{routeFlavor}}`
- **APIs**: `{{listingApi}}`, `{{onboardingApi}}`
- **Tracking**: `{{level2EU}}`, `{{universe}}`

> **Boolean note**: Always quote boolean-like tokens in the template, e.g. `isPci: '{{isPci}}'` — the CLI will unquote them.

---

## 5) Swagger discovery

Helpers in `src/kernel/prompts/prompts-helper.ts` prepare endpoint choices, apply derivations, and guard valid selections.

---

## 6) Non-interactive usage

Example with explicit output path:
```bash
yarn manager-generator --non-interactive --preset pciQuickstart   --appName "pci-hello" --appType pci   --universe publicCloud --subUniverse Compute   --region GRA --flavor medium --language en --framework React   --mainApiPath "/cloud/project"   --listingEndpointPath "/cloud/project/{projectId}/instances"   --dashboardEndpointPath "/cloud/project/{projectId}"   --out ./_out/pci-hello
```

### 6.1 Real creation with default output path

If `--out` is omitted, the generator uses:
```
OUTPUT_BASE_DIR = './packages/manager/apps'
```
Example:
```bash
yarn manager-generator --non-interactive   --appName pci-demo --appType pci   --universe Manager --subUniverse Manager   --region EU --flavor generic --language en --framework React   --mainApiPath /me --listingEndpointPath /me/list --dashboardEndpointPath /me/details
```
Will create:
```
./packages/manager/apps/pci-demo
```

---

## 7) Environment knobs

- `MANAGER_SWAGGER_BASE_V2` – Override Swagger v2 base URL.
- `MANAGER_SWAGGER_BASE_V6` – Override Swagger v6 base URL.

---

## 8) Contributing guardrails

- Keep `kernel/` generic and `playbook/` business-specific.
- All tokens are strings by contract.
- Booleans must be handled by post-step fixes.

---

## 9) Troubleshooting

- **Unresolved tokens**: Ensure `buildBaseTokens()` or presets supply them.
- **Quoted booleans**: Extend `fixGeneratedBooleans()` if adding new boolean tokens.
- **No endpoints**: Check Swagger base URLs.
