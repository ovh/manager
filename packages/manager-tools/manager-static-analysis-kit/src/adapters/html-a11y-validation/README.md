# HTML Accessibility Matcher — Vitest + React Testing Library

Validate the accessibility of DOM output from your React components **inside RTL/jsdom tests** with a single matcher:

- `await expect(container).toBeAccessible()`

This matcher is **engine-agnostic**: consumers don’t import any third-party a11y libraries directly. It’s designed to run in **jsdom** (not `happy-dom`).

---

## Highlights

- ✅ Drop-in: `expect(container).toBeAccessible()`
- 🧪 Built for **Vitest + React Testing Library**
- 🧩 Works with any DOM root: `Element`, `Document`, or `DocumentFragment`
- 🛡️ Engine-agnostic public API (implementation detail may evolve)
- ⚙️ Optional options object for fine-grained control

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

> No direct dependency on a11y libraries is required in your project. Everything is wired through the kit.

---

## Register the matcher

Add this import to your **Vitest setup file** (executed once per test run):

```ts
// setupTests.ts
import "@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup";
```

And make sure Vitest loads your setup file:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",               // a11y matcher requires jsdom
    setupFiles: ["./setupTests.ts"],
  },
});
```

> **Important:** The a11y matcher is **not** compatible with `happy-dom` due to DOM API differences. Use `jsdom` for tests that call `toBeAccessible()`.

---

## Usage with React Testing Library

### Passing example
```tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@/utils/test.provider"; // or @testing-library/react

function SaveButton() {
  return <button aria-label="Save changes" type="button" />; // accessible name provided
}

describe("SaveButton — a11y", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<SaveButton />);
    await expect(container).toBeAccessible();
  });
});
```

### Failing examples (for validation)

**1) Button without an accessible name (`button-name`)**
```tsx
function AnonymousButton() {
  return <button type="button" />; // no text, no aria-label
}

it("fails when a button has no accessible name", async () => {
  const { container } = render(<AnonymousButton />);
  await expect(container).toBeAccessible(); // ❌ should FAIL (button-name)
});
```

**2) Image without alt text (`image-alt`)**
```tsx
it("fails when <img> has no alt", async () => {
  // eslint-disable-next-line jsx-a11y/alt-text
  const { container } = render(<img src="#" />);
  await expect(container).toBeAccessible(); // ❌ should FAIL (image-alt)
});
```

---

## With optional options

You can pass an options object to tune checks (shape is intentionally generic to keep the engine swappable):

```tsx
await expect(container).toBeAccessible({
  // Example: disable or tweak specific rules
  rules: { "color-contrast": { enabled: false } },

  // Example: limit the scope of checks to a subset of the tree
  // include: ["#main"],  exclude: [".visually-hidden"]
});
```

---

## What failures look like

> Example messages are illustrative; exact wording/URLs may vary by engine version.

**Button without accessible name**
```
FAIL  src/components/AnonymousButton.spec.tsx > fails when a button has no accessible name
Error: Accessibility violations found (1):

[button-name] Buttons must have discernible text
  - button[type="button"]
    Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
More: https://dequeuniversity.com/rules/axe/latest/button-name
```

**Image without alt**
```
FAIL  src/components/Image.spec.tsx > fails when <img> has no alt
Error: Accessibility violations found (1):

[image-alt] Images must have alternative text
  - img
    Fix any of the following:
  Element does not have an alt attribute
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
More: https://dequeuniversity.com/rules/axe/latest/image-alt
```

---

## Tips & Best Practices

- Keep a11y tests **focused** on meaningful states (avoid validating dozens of variants).
- Prefer testing **rendered containers** that resemble real user states (e.g., after opening a dialog).
- Pair with `@testing-library/jest-dom` style assertions (roles, names) to catch semantic issues earlier.
- If you need to scope checks, render a smaller container or pass options that narrow the scope.

---

## Troubleshooting

- **“The test DOM environment is not supported”**  
  Ensure your Vitest environment is **jsdom**, not `happy-dom`.

- **Types for `toBeAccessible` not recognized**  
  Ensure your setup file is TypeScript and included by your tests tsconfig; or add the subpath to `compilerOptions.types` as shown above.

- **Flaky results**  
  Make sure any async UI updates (lazy content, portals, loaders) have settled **before** calling the matcher (use RTL `findBy*` or `await waitFor(...)`).

---

## FAQ

**Q. Can I use it without React Testing Library?**  
A. Yes, as long as you provide a valid DOM container (`Element`, `Document`, or `DocumentFragment`) created under jsdom.

**Q. Can I customize which rules run?**  
A. Yes—pass an options object to `toBeAccessible(...)`. The exact shape is generic to keep the engine swappable; common patterns include enabling/disabling rules or scoping checks.

**Q. Can this run in Node (no jsdom)?**  
A. No—the matcher requires a DOM implementation and is designed for jsdom tests.
