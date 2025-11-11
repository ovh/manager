# OVHcloud µ-App Generator – Developer Guide (Interactive Only)

## 1) Architecture at a glance

**Separation of concerns**:

- **`src/kernel/`** — _Engine_ (stable): token replacement (`tokens-helper.ts`), template copier (`generate-templates.ts`), Swagger discovery helpers (`api-helper.ts`), prompt helpers (`prompts-helper.ts`), path normalization (`paths-utils.ts`), and post-processors. Keep it **flavor-agnostic**.
- **`src/playbook/`** — _Config & UX_ (change here): prompts (`prompts-main.ts`), token building (`tokens-main.ts`), config (`config/*.ts`), schemas & types (`types/`). This is where “what goes into tokens” lives.
- **`src/presets/`** — optional presets (string-only tokens + default answers) via `presets.ts`.
- **`template/`** — the React app scaffold (with a **few** `{{token}}` placeholders). _Note:_ this repo focuses on kernel + playbook; point the generator at your template path when running.

**Runtime flow**:

```
(prompts / answers)
          │
          ▼
src/playbook/tokens-main.ts  → validate & normalize → build base tokens → merge presets/env
          │
          ▼
bin/manager-generator.js     → generateTemplates() → runPostProcessors() → write files
          │
          ▼
 template/* (files written with tokens replaced)
```

> Boolean unquoting (e.g. `isPci: 'true'` → `isPci: true`) is handled by a **post-processor** (`booleanUnquoteForAppConstants`) targeting `src/App.constants.ts`.

---

## 2) Repository layout

```
bin/
  manager-generator.js                 # CLI entry – invokes the built pipeline
src/
  kernel/                              # engine (keep generic)
    api/                               # Swagger fetch/normalize (api-helper.ts, api-main.ts)
    prompts/                           # prompt helpers & derivations (prompts-helper.ts)
    tokens/                            # replacement engine + assertions (tokens-helper.ts)
    utils/                             # path normalization (paths-utils.ts, …)
    generate-template/                 # template copier & processors
      generate-templates.ts            # copy, replace, assert, post-process, log
      generate-template-helper.ts      # ensureDir, isBinaryFile, transformName, processors
    types/                             # engine contracts (api/types/tokens/template/inquiries)
  playbook/                            # config + user-facing UX
    config/
      api-config.ts                    # REGIONS, UNIVERSES, SUB_UNIVERSES, level2Choices
      kernel-config.ts                 # Swagger endpoints, binary extensions, MANUAL_ENTRY
      playbook-config.ts               # e.g. OUTPUT_BASE_DIR default
    types/
      playbook-types.ts, playbook-schema.ts
    prompts-main.ts
    tokens-main.ts
    playbook-main.ts
  presets/
    presets.ts                         # optional default tokens/presets
    presets-types.ts
```

> This repo ships the **kernel + playbook**. Bring your own `template/` (React scaffold) when running the generator.

---

## 3) Data flow in more detail

1. **Collect answers** – Interactive prompts only (no flags).
2. **Resolve tokens** – `buildBaseTokens()` merges presets/env, normalizes answers, and coerces booleans to **strings** (`'true'|'false'`) to keep the template layer simple.
3. **Apply templates** – `generateTemplates()` copies files, replaces tokens, and asserts none remain unresolved (`assertNoUnresolvedTokens()`).
4. **Post-process** – `runPostProcessors()` applies transforms like `booleanUnquoteForAppConstants` on `src/App.constants.ts`.

---

## 4) Adding a new question

1. Add it to `GeneratorAnswers` and to the Zod `AnswersSchema` in `src/playbook/types`.
2. Update prompts in `src/playbook/prompts-main.ts`.
3. Map to tokens in `buildBaseTokens()` (`src/playbook/tokens-main.ts`).
4. Reference it in the template as `{{token}}` **with quotes** if boolean/number.

> **Pro tip**: Add the token to `TokenMapSchema` (kernel types) so missing mappings fail fast during generation.

---

## 5) Template tokens

Common ones in a standard Manager app template’s `template/src/App.constants.ts`:

- **Identity**: `{{appName}}`, `{{description}}`, `{{serviceKey}}`
- **Routing**: `{{isPci}}`, `{{routeFlavor}}`
- **APIs**: `{{listingApi}}`, `{{dashboardApi}}`
- **Tracking**: `{{level2EU}}`, `{{universe}}`, `{{subUniverse}}`

> **Boolean note**: Always quote boolean-like tokens in the template, e.g. `isPci: '{{isPci}}'`. The post-processor will unquote in the generated app’s `src/App.constants.ts`.

### 5.1) Translations (i18n)

If your template ships translations (`template/public/translations/...`), tokens inside JSON are replaced **at generation time** just like in TS/TSX. Generation fails if any `{{token}}` remains unresolved.

Runtime usage (example):
```ts
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('dashboard');
t('title');
```

---

## 6) Swagger discovery

Helpers in `src/kernel/prompts/prompts-helper.ts` and `src/kernel/api/*` prepare endpoint choices:

- Normalize server-returned paths with `normalizePath()` before matching against user input.
- Use `splitApiPathsByVersion()` to group v2/v6 paths consistently.
- Ensure consistent formats via normalization and version-prefix stripping helpers.

---

## 7) Usage (Interactive Only)

> **Note:** install dependencies and build the generator first if not already done.

```bash
yarn install # from the root
yarn build   # from the root or inside the generator
yarn manager-generator # from the root
```

Follow the prompts. You’ll be asked for:

1. **Identity** – app name, package name, description.
2. **Regions & universes** – one or more regions, universes, sub-universes.
3. **Routing** – flavor (PCI/Generic), optional `appSlug`, and `basePrefix`.
4. **API family** – listing (`v6Iceberg`/`v6`/`v2`) and onboarding (`v6`/`v2`).
5. **API base paths** – choose the base(s) to use.
6. **Endpoints** – pick listing & onboarding endpoints from discovered options or enter them manually.
7. **Service key** – confirm/adjust derived `serviceKey`.
8. **Tracking** – level2, universe, subUniverse.

**Output location**: by default, uses `OUTPUT_BASE_DIR` from `src/playbook/config/playbook-config.ts` (e.g., `./packages/manager/apps`).

---

## 8) Contributing guardrails (repo‑specific)

- **ESM & Node**. The project is ESM (`"type": "module"`). Keep imports ESM‑friendly in `bin/` and `src/`.
- **Prompt order & choice stability.** `api-config.ts` exports arrays `as const` and exposes `level2Choices` to **preserve order** for tests and UX. When adding values, append rather than re‑ordering; update tests under `src/**/**.test.ts` accordingly.
- **Token pipeline invariants.**
  - All tokens are **strings** by contract (see `buildRuntimeTokens()`).
  - `replaceTokens()` supports modifiers: `{{name|json}}` (JSON literal) and `{{name|raw}}` (no quoting). Numbers/booleans are unquoted automatically; quoted placeholders are re‑quoted safely.
  - Missing tokens are left as‑is and then caught by `assertNoUnresolvedTokens()` — do **not** swallow unresolved placeholders.
- **Post‑processors are path‑sensitive.** `booleanUnquoteForAppConstants` only matches `src/App.constants.ts`. If your template moves this file, **update the matcher** or you’ll ship quoted booleans.
- **Binary safety.** Binary files are detected via extension (see `kernel-config.ts` list: `.png`, `.jpg`, `.pdf`, `.zip`, `.woff2`, …). If your template includes new asset types, **extend** the list or pass `binaryExtensions` in engine options; otherwise token replacement can corrupt assets.
- **Dotfile renames.** Template files starting with `_` (e.g. `_gitignore`) are renamed to dotfiles when `enableDotfileRename` is enabled. Prefer `_gitignore` in templates, not `.gitignore`.
- **Name transforms.** Use `transformName()` for tokenized filenames and dotfile rules; avoid ad‑hoc renames.
- **Path normalization.** Always normalize paths with `ensureLeadingSlash()` and `normalizePath({ braceAware: true })` before comparisons. Use `stripApiVersionPrefix('v6-/…')` for parity with legacy inputs.
- **Endpoint encoding.** Endpoint choices are encoded as `"{apiPath}-{functionName}"`. Use `normalizeSelectedApiPath()` to split back to `{ apiPath, version }`; do not substring manually.
- **Derivations & service keys.** `applyDerivations()` sets computed flags and derives `serviceKey` from listing endpoints. If derivation rules change, update tests (`tokens-helper.test.ts`, `prompts-helper.test.ts`) to cover edge cases like `/` and `vN-/` prefixes.
- **Console logs for key files.** During generation, contents of `README.md`, `App.constants.ts`, and `package.json` are printed to stdout. Keep outputs concise; large files will flood logs.
- **Testing.** The repo uses `manager-test` scripts. Update unit tests alongside engine changes:  
  `src/kernel/api/*.test.ts`, `src/kernel/prompts/prompts-helper.test.ts`, `src/kernel/tokens/tokens-helper.test.ts`, `src/kernel/utils/paths-utils.test.ts`, `src/kernel/generate-template/*.test.ts`, `src/playbook/*.test.ts`.

---

## 9) Troubleshooting

- **“Unresolved tokens”** → ensure `buildBaseTokens()` / presets supply them; templates must quote boolean-like spots.
- **Quoted booleans remain** → check `booleanUnquoteForAppConstants` wiring; target path must be `src/App.constants.ts`.
- **No endpoints shown** → verify Swagger base URLs & network; try `MANAGER_SWAGGER_BASE_*` env vars.
- **Invalid path errors** → use `ensureLeadingSlash()` / `assertStartsWithSlash()`.
- **Wrong prompt order or missing choices** → confirm `api-config.ts` constants (`REGIONS`, `UNIVERSES`, `SUB_UNIVERSES`, `LEVEL2_CODES`) and `level2Choices`.
