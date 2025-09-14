# HTML W3C Validation Matcher — Vitest + React Testing Library

Validate the HTML produced by your React components **inside RTL/jsdom tests** using the W3C **[Nu Html Checker](https://github.com/validator/validator)** ([`vnu.jar` on npm](https://www.npmjs.com/package/vnu-jar)).  
Under the hood, this matcher spawns `java -jar vnu.jar` safely via `child_process.spawn` (no `execa`), so it works reliably in jsdom.

---

## Highlights

- ✅ Drop-in matcher: `await expect(html).toBeValidHtml()`
- 🧩 Works with **HTML fragments** (auto-wrapped into a minimal valid document)
- 🧪 Great with **React Testing Library** in **Vitest**
- ⚙️ Advanced control via low-level helpers when you need custom flags (`--format`, `--filterpattern`, etc.)
- 🖥️ Cross-platform (uses `vnu-jar` path; only needs a Java runtime)

---

## Prerequisites

- **Java 8+** available on PATH (CI & local):
  ```bash
  java -version
  ```

---

## Install (dev)

```jsonc
{
  "devDependencies": {
    "@ovh-ux/manager-static-analysis-kit": "*",
    "@ovh-ux/manager-tests-setup": "latest",
    "@ovh-ux/manager-vite-config": "*"
  }
}
```

> `vnu-jar` is bundled as a dependency of the kit; you don’t install it directly.

---

## Register the matcher

Add this import to your **Vitest setup file** (executed once per test run):

```ts
// setupTests.ts
import "@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup";
```

- This registers `expect(...).toBeValidHtml()`.
- Ensure your test runner loads this file (e.g., `vitest.config.ts`):
  ```ts
  // vitest.config.ts
  import { defineConfig } from "vitest/config";

  export default defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./setupTests.ts"],
    },
  });
  ```
- **TypeScript tips**
  - Make sure your setup file is included by your test TS config (either via `include` or by colocating it under your tests root).
  - Or add your tests tsconfig `compilerOptions.types` to include your test env types (e.g., `vitest/globals`, RTL) so matcher augmentations are picked up.

---

## Usage with React Testing Library

```tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@/utils/test.provider"; // or @testing-library/react
import BillingStateBadge from "./BillingStateBadge.component";

describe("BillingStateBadge W3C Validation", () => {
  it("should have a valid html", async () => {
    const { container } = render(<BillingStateBadge isLoading />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml(); // ✅ Validates via vnu.jar
  });
});
```

- You may pass either a **full document** or an **HTML fragment**.  
  Fragments are **auto-wrapped** into:
  ```html
  <!doctype html>
  <html>
    <head><title>Test</title></head>
    <body><!-- your fragment here --></body>
  </html>
  ```

---

## What a failure looks like

```
FAIL  src/components/billingStateBadge/BillingStateBadge.w3c.spec.tsx > BillingStateBadge W3C Validation > should have a valid html
Error: expected HTML to be valid, but got:
:1.98-1.100: error: Element “p” not allowed as child of element “span” in this context. (Suppressing further errors from this subtree.)

 ❯ src/components/billingStateBadge/BillingStateBadge.w3c.spec.tsx:14:5
     12|     const html = `<span><p>Wrong W3C Case</p></span>`;
     13|
     14|     await expect(html).toBeValidHtml();
     15|   });
```

---

## How it works

- The matcher delegates to internal helpers:
  - `validateHtmlString(html, flags?: string[])`
  - `validateHtmlFile(filePath, flags?: string[])`
- Both run `java -jar ${vnu-jar}` with `--stdout` and `--errors-only` by default.
- In jsdom/RTL tests we **always use `child_process.spawn`** (no `execa`) to avoid AbortSignal/EventTarget mismatches.

---

## Advanced (custom flags & direct helpers)

When you need custom **Nu Html Checker** flags (formatting, filtering, CSS/SVG checks, etc.), call the helpers directly:

```ts
import {
  validateHtmlString,
  validateHtmlFile,
} from "@ovh-ux/manager-static-analysis-kit/dist/adapters/html-w3c-validation/helpers/html-w3c-validator.js";

const res = await validateHtmlString(html, ["--format", "gnu"]); // or "json" | "xml" | "text"
expect(res.success, res.stderr || res.stdout).toBe(true);
```

### Commonly useful `vnu.jar` flags

- `--errors-only`  
  (default in the matcher) only error-level messages, no warnings/info.
- `--format gnu|json|xml|text`  
  choose output format (e.g., `json` when post-processing).
- `--filterpattern REGEXP`  
  suppress known noisy messages (one combined regex; use `|` to OR).
- `--filterfile FILENAME`  
  like `--filterpattern` but from a file (one regex/comment per line).
- `--also-check-css` / `--skip-non-css` / `--css`  
  enable CSS validation when validating **files or directories**.
- `--also-check-svg` / `--skip-non-svg` / `--svg`  
  enable SVG validation when validating **files or directories**.
- `--skip-non-html`  
  skip anything that isn’t `.html`, `.htm`, `.xhtml`, `.xht`.
- `--html` / `--xml`  
  force parser selection for `.xhtml` or `.html`.

> Full option list is supported by `vnu.jar`; pass any of them through the `flags` array to the helpers when using files/dirs.

---

## Links

- **Nu Html Checker (source & docs)** — https://github.com/validator/validator
- **vnu.jar (npm package)** — https://www.npmjs.com/package/vnu-jar
- **Web service** — https://validator.w3.org/nu/ (hosted checker)

## Troubleshooting

- **`Java runtime not found`**  
  Install JRE/JDK and ensure `java` is on the PATH.

- **Types not recognized for `toBeValidHtml`**  
  Ensure your `setupTests.ts` is TypeScript and included by your tests tsconfig, and that Vitest’s `setupFiles` points to it.

- **StackOverflowError from the checker** (rare on huge pages)  
  Try adjusting Java thread stack size:
  ```bash
  java -Xss512k -jar ~/vnu.jar ...
  ```

---

## FAQ

**Q. Can I validate arbitrary HTML strings, not files?**  
A. Yes—that’s the default matcher (`toBeValidHtml`) and `validateHtmlString`.

**Q. Can I validate CSS/SVG too?**  
A. Yes, when validating **files/directories** via `validateHtmlFile` and the appropriate flags (e.g., `--also-check-css`, `--also-check-svg`).

**Q. Can I change the output format?**  
A. Use the helpers with `["--format","json" | "xml" | "gnu" | "text"]`.
