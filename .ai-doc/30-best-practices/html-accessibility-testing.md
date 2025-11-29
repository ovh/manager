---
title: HTML Accessibility Testing with Vitest and React Testing Library
last_update: 2025-01-27
tags: [accessibility, testing, vitest, react-testing-library, a11y, ovhcloud, manager]
ai: true
---

# HTML Accessibility Testing with Vitest and React Testing Library

## 🧭 Purpose

This document explains how to implement and use HTML accessibility testing in React applications within the OVHcloud Manager ecosystem. It covers the setup, configuration, and usage of the `toBeAccessible()` matcher for validating DOM accessibility in Vitest tests with React Testing Library.

The accessibility testing system ensures that all React components meet WCAG standards and provide an inclusive user experience across all Manager applications.

## ⚙️ Context

The HTML accessibility matcher provides:
- **Drop-in testing**: Simple `expect(container).toBeAccessible()` syntax
- **Built for Vitest + React Testing Library**: Optimized for the Manager testing stack
- **Engine-agnostic API**: No direct dependency on third-party a11y libraries
- **jsdom compatibility**: Designed to run in jsdom environment (not happy-dom)
- **Fine-grained control**: Optional configuration for specific testing needs

This system is designed for:
- **React components** in the Manager ecosystem
- **Vitest test suites** with jsdom environment
- **Accessibility compliance** with WCAG standards
- **Automated testing** in CI/CD pipelines

## 🔗 References

- [Development Standards](./development-standards.md)
- [TypeScript Cheat Sheet](./typescript-cheatsheet.md)
- [React Best Practices](./react-best-practices.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequeuniversity/axe-core)

## 📘 Guidelines / Implementation

### Installation and Setup

#### 1. Install Dependencies

Add the required packages to your `package.json`:

```json
{
  "devDependencies": {
    "@ovh-ux/manager-static-analysis-kit": "*",
    "@ovh-ux/manager-tests-setup": "latest",
    "@ovh-ux/manager-vite-config": "*"
  }
}
```

**Note**: No direct dependency on a11y libraries is required. Everything is wired through the static analysis kit.

#### 2. Register the Matcher

Add the import to your Vitest setup file:

```typescript
// setupTests.ts
import "@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup";
```

#### 3. Configure Vitest

Ensure Vitest loads your setup file and uses jsdom:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",               // Required for a11y matcher
    setupFiles: ["./setupTests.ts"],
  },
});
```

**Important**: The a11y matcher is not compatible with happy-dom due to DOM API differences. Use jsdom for tests that call `toBeAccessible()`.

### Basic Usage

#### Passing Example

```typescript
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

function SaveButton() {
  return <button aria-label="Save changes" type="button">Save</button>;
}

describe("SaveButton — a11y", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<SaveButton />);
    await expect(container).toBeAccessible();
  });
});
```

#### Failing Examples (for validation)

**1. Button without accessible name**

```typescript
function AnonymousButton() {
  return <button type="button" />; // No text, no aria-label
}

it("fails when a button has no accessible name", async () => {
  const { container } = render(<AnonymousButton />);
  await expect(container).toBeAccessible(); // ❌ Should FAIL (button-name)
});
```

**2. Image without alt text**

```typescript
it("fails when <img> has no alt", async () => {
  // eslint-disable-next-line jsx-a11y/alt-text
  const { container } = render(<img src="#" />);
  await expect(container).toBeAccessible(); // ❌ Should FAIL (image-alt)
});
```

### Advanced Usage

#### With Optional Configuration

```typescript
await expect(container).toBeAccessible({
  // Disable or tweak specific rules
  rules: { 
    "color-contrast": { enabled: false },
    "button-name": { enabled: true }
  },
  
  // Limit scope of checks to a subset of the tree
  include: ["#main"],
  exclude: [".visually-hidden"]
});
```

#### Testing Different Component States

```typescript
describe("Modal Component — a11y", () => {
  it("is accessible when closed", async () => {
    const { container } = render(<Modal isOpen={false} />);
    await expect(container).toBeAccessible();
  });

  it("is accessible when open", async () => {
    const { container } = render(<Modal isOpen={true} />);
    await expect(container).toBeAccessible();
  });

  it("is accessible with form content", async () => {
    const { container } = render(
      <Modal isOpen={true}>
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    );
    await expect(container).toBeAccessible();
  });
});
```

#### Testing Complex Components

```typescript
describe("DataGrid Component — a11y", () => {
  it("is accessible with data", async () => {
    const { container } = render(
      <DataGrid
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' }
        ]}
        data={[
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]}
      />
    );
    await expect(container).toBeAccessible();
  });

  it("is accessible when empty", async () => {
    const { container } = render(
      <DataGrid
        columns={[]}
        data={[]}
        emptyMessage="No data available"
      />
    );
    await expect(container).toBeAccessible();
  });

  it("is accessible with loading state", async () => {
    const { container } = render(
      <DataGrid
        columns={[]}
        data={[]}
        isLoading={true}
      />
    );
    await expect(container).toBeAccessible();
  });
});
```

### Common Accessibility Patterns

#### Form Components

```typescript
describe("Form Components — a11y", () => {
  it("input with proper labeling", async () => {
    const { container } = render(
      <div>
        <label htmlFor="username">Username</label>
        <input 
          id="username" 
          type="text" 
          required 
          aria-describedby="username-help"
        />
        <div id="username-help">Enter your username</div>
      </div>
    );
    await expect(container).toBeAccessible();
  });

  it("select with proper labeling", async () => {
    const { container } = render(
      <div>
        <label htmlFor="country">Country</label>
        <select id="country" required>
          <option value="">Select a country</option>
          <option value="fr">France</option>
          <option value="us">United States</option>
        </select>
      </div>
    );
    await expect(container).toBeAccessible();
  });

  it("checkbox group with proper labeling", async () => {
    const { container } = render(
      <fieldset>
        <legend>Select your interests</legend>
        <div>
          <input type="checkbox" id="tech" />
          <label htmlFor="tech">Technology</label>
        </div>
        <div>
          <input type="checkbox" id="sports" />
          <label htmlFor="sports">Sports</label>
        </div>
      </fieldset>
    );
    await expect(container).toBeAccessible();
  });
});
```

#### Navigation Components

```typescript
describe("Navigation Components — a11y", () => {
  it("breadcrumb navigation", async () => {
    const { container } = render(
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li aria-current="page">Current Page</li>
        </ol>
      </nav>
    );
    await expect(container).toBeAccessible();
  });

  it("main navigation menu", async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    );
    await expect(container).toBeAccessible();
  });
});
```

#### Interactive Components

```typescript
describe("Interactive Components — a11y", () => {
  it("button with proper labeling", async () => {
    const { container } = render(
      <button type="button" aria-label="Close dialog">
        <span aria-hidden="true">×</span>
      </button>
    );
    await expect(container).toBeAccessible();
  });

  it("toggle button with proper state", async () => {
    const { container } = render(
      <button 
        type="button" 
        aria-pressed="false"
        aria-label="Toggle notifications"
      >
        Notifications
      </button>
    );
    await expect(container).toBeAccessible();
  });

  it("modal with proper focus management", async () => {
    const { container } = render(
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </div>
    );
    await expect(container).toBeAccessible();
  });
});
```

### Error Handling and Debugging

#### Understanding Failure Messages

**Button without accessible name:**
```
FAIL  src/components/AnonymousButton.spec.tsx > fails when a button has no accessible name
Error: Accessibility violations found (1):

[button-name] Buttons must have discernible text
  - button[type="button"]
    Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
More: https://dequeuniversity.com/rules/axe/3.5/button-name?lang=en
```

**Image without alt text:**
```
FAIL  src/components/Image.spec.tsx > fails when <img> has no alt
Error: Accessibility violations found (1):

[image-alt] Images must have alternative text
  - img
    Fix any of the following:
  Element does not have an alt attribute
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
More: https://dequeuniversity.com/rules/axe/4.1/image-alt
```

#### Troubleshooting Common Issues

**1. "The test DOM environment is not supported"**
```typescript
// ❌ WRONG: Using happy-dom
export default defineConfig({
  test: {
    environment: "happy-dom", // Not supported
  },
});

// ✅ CORRECT: Using jsdom
export default defineConfig({
  test: {
    environment: "jsdom", // Required for a11y matcher
  },
});
```

**2. Types for `toBeAccessible` not recognized**
```typescript
// Ensure your setup file is included in TypeScript config
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup"
    ]
  }
}
```

**3. Flaky results with async content**
```typescript
// ❌ WRONG: Testing before content loads
it("is accessible", async () => {
  const { container } = render(<AsyncComponent />);
  await expect(container).toBeAccessible(); // May fail if content not loaded
});

// ✅ CORRECT: Wait for content to load
it("is accessible", async () => {
  const { container } = render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText("Content loaded")).toBeInTheDocument();
  });
  await expect(container).toBeAccessible();
});
```

### Best Practices

#### 1. Focused Testing

```typescript
// ✅ CORRECT: Test meaningful states
describe("UserProfile — a11y", () => {
  it("is accessible in view mode", async () => {
    const { container } = render(<UserProfile mode="view" />);
    await expect(container).toBeAccessible();
  });

  it("is accessible in edit mode", async () => {
    const { container } = render(<UserProfile mode="edit" />);
    await expect(container).toBeAccessible();
  });
});

// ❌ WRONG: Testing too many variants
it("is accessible with all possible props combinations", async () => {
  // Don't test every possible combination
});
```

#### 2. Real User States

```typescript
// ✅ CORRECT: Test realistic user interactions
it("is accessible after opening dialog", async () => {
  const { container } = render(<App />);
  
  // Simulate user opening dialog
  fireEvent.click(screen.getByText("Open Dialog"));
  
  // Test accessibility of the opened state
  await expect(container).toBeAccessible();
});
```

#### 3. Combine with Semantic Assertions

```typescript
// ✅ CORRECT: Combine a11y testing with semantic assertions
it("has proper accessibility and semantics", async () => {
  const { container } = render(<Button>Save</Button>);
  
  // Test accessibility
  await expect(container).toBeAccessible();
  
  // Test semantic structure
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});
```

#### 4. Scoped Testing

```typescript
// ✅ CORRECT: Test specific parts of complex components
it("form section is accessible", async () => {
  const { container } = render(<ComplexForm />);
  
  // Test only the form section
  const formSection = container.querySelector('[data-testid="form-section"]');
  await expect(formSection).toBeAccessible();
});
```

### Integration with CI/CD

#### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run accessibility tests
        run: yarn test --run --reporter=verbose
```

#### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:a11y": "vitest --run --reporter=verbose --testNamePattern='a11y'",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 🤖 AI Development Guidelines

### Essential Accessibility Testing Rules for AI Code Generation

1. **Always test accessibility**: Include `toBeAccessible()` in component tests
2. **Use jsdom environment**: Ensure Vitest is configured with jsdom, not happy-dom
3. **Test meaningful states**: Focus on realistic user interactions and component states
4. **Combine with semantic testing**: Use both a11y matcher and semantic assertions
5. **Handle async content**: Wait for dynamic content before testing accessibility
6. **Scope tests appropriately**: Test specific parts of complex components
7. **Follow WCAG guidelines**: Ensure components meet accessibility standards
8. **Use proper ARIA attributes**: Include appropriate ARIA labels, roles, and states
9. **Test keyboard navigation**: Ensure components are keyboard accessible
10. **Validate form accessibility**: Test form labels, error messages, and validation

### Accessibility Testing Checklist

- [ ] `toBeAccessible()` matcher imported and configured
- [ ] Vitest configured with jsdom environment
- [ ] Setup file includes a11y matcher registration
- [ ] Components tested in meaningful states
- [ ] Async content properly awaited before testing
- [ ] ARIA attributes properly implemented
- [ ] Form labels and validation accessible
- [ ] Keyboard navigation tested
- [ ] Color contrast validated
- [ ] Screen reader compatibility verified

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Using happy-dom environment
export default defineConfig({
  test: {
    environment: "happy-dom", // Not compatible with a11y matcher
  },
});

// ❌ WRONG: Testing before async content loads
it("is accessible", async () => {
  const { container } = render(<AsyncComponent />);
  await expect(container).toBeAccessible(); // May fail
});

// ❌ WRONG: Missing ARIA attributes
<button type="button">×</button> // No accessible name

// ❌ WRONG: Improper form labeling
<input type="text" /> // No label or aria-label
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Proper environment configuration
export default defineConfig({
  test: {
    environment: "jsdom", // Required for a11y matcher
    setupFiles: ["./setupTests.ts"],
  },
});

// ✅ CORRECT: Testing with proper async handling
it("is accessible after content loads", async () => {
  const { container } = render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText("Content loaded")).toBeInTheDocument();
  });
  await expect(container).toBeAccessible();
});

// ✅ CORRECT: Proper ARIA implementation
<button type="button" aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>

// ✅ CORRECT: Proper form labeling
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />
```

---

## ⚖️ The Accessibility Tester's Moral

- **Inclusive design** ensures all users can access and use your applications
- **Automated testing** catches accessibility issues before they reach production
- **Semantic HTML** provides the foundation for accessible components
- **ARIA attributes** enhance accessibility when semantic HTML isn't sufficient

**👉 Good accessibility testing is invisible to users but essential for inclusion.**
