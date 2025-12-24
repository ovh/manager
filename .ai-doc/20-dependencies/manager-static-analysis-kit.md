---
title: Manager Static Analysis Kit
last_update: 2025-01-27
tags: [eslint, static-analysis, linting, typescript, react, ovhcloud, manager, quality]
ai: true
---

# Manager Static Analysis Kit

> **📦 Version:** `@ovh-ux/manager-static-analysis-kit@^0.11.1`

## 🧭 Purpose

The **Manager Static Analysis Kit** is a comprehensive toolkit for static code analysis in the OVHcloud Manager ecosystem. It provides ESLint configurations, TypeScript settings, testing utilities, and quality checks for maintaining code quality across all Manager applications.

This package ensures consistent code quality, enforces coding standards, and provides automated quality checks for React applications in the Manager ecosystem.

## ⚙️ Context

Manager Static Analysis Kit is designed for:
- **ESLint configuration** with modern flat config format
- **TypeScript analysis** with strict type checking
- **React-specific rules** for component development
- **Accessibility validation** with axe-core integration
- **Code duplication detection** and prevention
- **Performance budgets** and bundle analysis
- **Test coverage** and quality metrics

This package is essential for:
- **Code quality** maintenance across all Manager applications
- **Consistent coding standards** enforcement
- **Automated quality checks** in CI/CD pipelines
- **Developer experience** with helpful linting rules

## 🔗 References

- [Manager Vite Config](./manager-vite-config.md)
- [React Best Practices](../30-best-practices/react-best-practices.md)
- [TypeScript Cheatsheet](../30-best-practices/typescript-cheatsheet.md)
- [ESLint Documentation](https://eslint.org/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "devDependencies": {
    "@ovh-ux/manager-static-analysis-kit": "^0.11.1"
  }
}
```

### ESLint Configuration

#### Basic ESLint Setup

```javascript
// eslint.config.mjs
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [
  ...eslintSharedConfig,
  // Your custom rules
];
```

#### React-Specific Configuration

```javascript
// eslint.config.mjs
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';

export default [
  ...eslintSharedConfig,
  reactEslintConfig,
  // Additional React rules
];
```

#### Complete ESLint Configuration

```javascript
// eslint.config.mjs
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { tanstackEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { tailwindEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';

export default [
  ...eslintSharedConfig,
  reactEslintConfig,
  typescriptEslintConfig,
  tanstackEslintConfig,
  tailwindEslintConfig,
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    ...require('@ovh-ux/manager-static-analysis-kit/eslint/tests')
  }
];
```

### TypeScript Configuration

#### React TypeScript Config

```json
// tsconfig.json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Strict TypeScript Config

```json
// tsconfig.json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Test TypeScript Config

```json
// tsconfig.test.json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/test",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint Rules

#### React Rules

```javascript
// React-specific rules
const reactRules = {
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react/jsx-key': 'error',
  'react/jsx-no-duplicate-props': 'error',
  'react/jsx-no-undef': 'error',
  'react/no-children-prop': 'error',
  'react/no-danger-with-children': 'error',
  'react/no-deprecated': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/no-find-dom-node': 'error',
  'react/no-is-mounted': 'error',
  'react/no-render-return-value': 'error',
  'react/no-string-refs': 'error',
  'react/no-unescaped-entities': 'error',
  'react/no-unknown-property': 'error',
  'react/no-unsafe': 'error',
  'react/prop-types': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/require-render-return': 'error'
};
```

#### TypeScript Rules

```javascript
// TypeScript-specific rules
const typescriptRules = {
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/prefer-const': 'error',
  '@typescript-eslint/no-var-requires': 'error',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'warn'
};
```

#### TanStack Query Rules

```javascript
// TanStack Query rules
const tanstackRules = {
  '@tanstack/query/exhaustive-deps': 'error',
  '@tanstack/query/no-rest-destructuring': 'error',
  '@tanstack/query/prefer-query-object-syntax': 'error'
};
```

#### Tailwind Rules

```javascript
// Tailwind CSS rules
const tailwindRules = {
  'tailwindcss/classnames-order': 'warn',
  'tailwindcss/enforces-negative-arbitrary-values': 'warn',
  'tailwindcss/enforces-shorthand': 'warn',
  'tailwindcss/migration-from-tailwind-2': 'warn',
  'tailwindcss/no-arbitrary-value': 'off',
  'tailwindcss/no-custom-classname': 'off',
  'tailwindcss/no-contradicting-classname': 'error'
};
```

### Quality Checks

#### Code Duplication Detection

```javascript
// Code duplication configuration
const duplicationConfig = {
  threshold: 5,
  minLines: 3,
  minTokens: 50,
  exclude: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}'
  ]
};
```

#### Performance Budgets

```javascript
// Performance budget configuration
const perfBudgetConfig = {
  budgets: [
    {
      resourceType: 'script',
      budget: 500, // 500KB
      warning: 400  // 400KB warning
    },
    {
      resourceType: 'stylesheet',
      budget: 100, // 100KB
      warning: 80   // 80KB warning
    }
  ]
};
```

#### Test Coverage

```javascript
// Test coverage configuration
const coverageConfig = {
  threshold: 80,
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80,
  exclude: [
    'node_modules/**',
    'dist/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}'
  ]
};
```

### Accessibility Validation

#### HTML Accessibility Tests

```javascript
// HTML accessibility test setup
import { htmlA11yTestsSetup } from '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';

// In your test files
htmlA11yTestsSetup();
```

#### W3C Validation

```javascript
// W3C validation setup
import { htmlW3cTestsSetup } from '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

// In your test files
htmlW3cTestsSetup();
```

### CLI Tools

#### Linting

```bash
# Run ESLint
yarn manager-lint

# Run ESLint with fix
yarn manager-lint --fix

# Run ESLint on specific files
yarn manager-lint src/**/*.{js,jsx,ts,tsx}
```

#### Code Duplication

```bash
# Check for code duplication
yarn manager-code-duplication

# Run duplication tests
yarn manager-code-duplication-tests
```

#### Performance Budgets

```bash
# Check performance budgets
yarn manager-perf-budgets

# Run performance budget tests
yarn manager-perf-budgets-tests
```

#### Test Coverage

```bash
# Check test coverage
yarn manager-tests-coverage

# Run coverage tests
yarn manager-tests-coverage-tests
```

#### Type Coverage

```bash
# Check TypeScript coverage
yarn manager-types-coverage

# Run type coverage tests
yarn manager-types-coverage-tests
```

### Advanced Configuration

#### Custom ESLint Rules

```javascript
// Custom ESLint configuration
export default [
  ...eslintSharedConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Custom rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    rules: {
      // Test-specific rules
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
```

#### File-Specific Rules

```javascript
// File-specific ESLint rules
export default [
  ...eslintSharedConfig,
  {
    files: ['src/components/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/prop-types': 'error',
      'react/display-name': 'error'
    }
  },
  {
    files: ['src/hooks/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

#### Import Order Configuration

```javascript
// Import order configuration
const importOrderConfig = {
  groups: [
    'builtin',
    'external',
    'internal',
    'parent',
    'sibling',
    'index'
  ],
  'newlines-between': 'always',
  alphabetize: {
    order: 'asc',
    caseInsensitive: true
  }
};
```

### Best Practices

#### 1. ESLint Configuration

```javascript
// ✅ CORRECT: Use shared config as base
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [
  ...eslintSharedConfig,
  // Add project-specific rules
];

// ❌ WRONG: Don't recreate all rules
export default [
  {
    rules: {
      // Don't recreate all the rules
    }
  }
];
```

#### 2. TypeScript Configuration

```json
// ✅ CORRECT: Extend base config
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ❌ WRONG: Don't recreate TypeScript config
{
  "compilerOptions": {
    // Don't recreate all options
  }
}
```

#### 3. Quality Checks

```javascript
// ✅ CORRECT: Configure quality checks
const qualityConfig = {
  duplication: {
    threshold: 5,
    minLines: 3
  },
  coverage: {
    threshold: 80
  },
  performance: {
    budgets: [
      { resourceType: 'script', budget: 500 }
    ]
  }
};

// ❌ WRONG: No quality checks
// Missing quality configuration
```

### Common Pitfalls

#### ❌ Wrong: Missing ESLint Configuration

```javascript
// Don't forget ESLint configuration
// Missing eslint.config.mjs
```

#### ✅ Correct: Complete ESLint Setup

```javascript
// eslint.config.mjs
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default [
  ...eslintSharedConfig,
  // Additional rules
];
```

#### ❌ Wrong: Incorrect TypeScript Config

```json
// Don't recreate TypeScript configuration
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    // ... many more options
  }
}
```

#### ✅ Correct: Extend Base Config

```json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use shared config**: Extend eslintSharedConfig instead of creating from scratch
2. **Configure TypeScript properly**: Use the provided TypeScript configurations
3. **Set up quality checks**: Configure duplication, coverage, and performance budgets
4. **Use appropriate rules**: Choose the right ESLint rules for your project type
5. **Handle file-specific rules**: Configure different rules for different file types
6. **Set up accessibility**: Configure accessibility validation for HTML content
7. **Configure imports**: Set up proper import order and organization
8. **Handle test files**: Configure different rules for test files

### ESLint Setup Checklist

- [ ] eslintSharedConfig imported and used
- [ ] React rules configured for React projects
- [ ] TypeScript rules configured for TypeScript projects
- [ ] TanStack Query rules configured if using React Query
- [ ] Tailwind rules configured if using Tailwind CSS
- [ ] Test-specific rules configured
- [ ] File-specific rules configured
- [ ] Import order configured

### TypeScript Setup Checklist

- [ ] Base TypeScript config extended
- [ ] Path aliases configured
- [ ] Include/exclude patterns set
- [ ] Strict mode enabled if needed
- [ ] Test TypeScript config separate
- [ ] Build configuration optimized

### Quality Checks Checklist

- [ ] Code duplication detection configured
- [ ] Performance budgets set
- [ ] Test coverage thresholds defined
- [ ] Type coverage configured
- [ ] Accessibility validation enabled
- [ ] W3C validation configured
- [ ] CI/CD integration set up

---

## ⚖️ The Analysis Kit's Moral

- **Consistent quality** ensures maintainable code across all applications
- **Automated checks** prevent quality issues from reaching production
- **Developer experience** improves with helpful linting and error messages
- **Standards enforcement** maintains code consistency and best practices

**👉 Good static analysis is invisible to users but essential for code quality and maintainability.**
