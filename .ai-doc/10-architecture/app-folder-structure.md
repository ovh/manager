---
title: Application Folder Structure
last_update: 2025-01-27
tags: [structure, folder, react, ovhcloud, manager]
ai: true
---

# Application Folder Structure

## 🧭 Purpose

This document defines the **standardized folder structure** for OVHcloud Manager µ-applications. It consolidates all folder structure guidelines from development standards, React blueprints, and architectural patterns into a single authoritative reference.

## ⚙️ Context

This structure applies to:
- **React µ-applications** in the Manager ecosystem
- **New project generation** using the manager-generator
- **Existing applications** during migration and refactoring
- **Consistency enforcement** across all development teams

## 📘 Standard Structure

### Complete Application Structure

```
µ-application-name/
├── public/
│   ├── assets/                    # Static assets (images, icons, etc.)
│   └── translations/             # i18n translation files
│       └── namespace-name/        # Feature-specific translations
├── src/
│   ├── components/               # Reusable UI components
│   │   └── componentName/        # Component-specific folder
│   │       ├── ComponentName.component.tsx
│   │       ├── ComponentName.constants.ts
│   │       └── ComponentName.spec.tsx
│   ├── constants/                # Application constants
│   ├── data/                     # Data layer
│   │   ├── api/                  # API service functions
│   │   ├── hooks/                # Data fetching hooks
│   │   └── types/                # Data type definitions
│   ├── hooks/                    # Custom React hooks
│   ├── pages/                    # Page components
│   │   └── pageName/             # Page-specific folder
│   │       ├── PageName.page.tsx
│   │       ├── PageName.constants.ts
│   │       └── PageName.spec.tsx
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── Routes.tsx                # Route configuration
├── tests/                        # Test files
│   ├── __mocks__/               # Mock files
│   ├── __tests__/               # Test files
│   └── setup.ts                 # Test setup
├── .env                         # Environment variables
├── .env.local                   # Local environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

## 📁 Folder Descriptions

This section provides detailed descriptions and guidelines for each folder in the standard structure. Refer to the "Complete Application Structure" section above for the visual folder hierarchy.

### Static Assets (`/public/`)

Contains static assets served directly by the web server without processing. The `assets/` subfolder houses images, icons, and other static resources organized by feature name. The `translations/` subfolder contains i18n JSON files for all supported locales (8 languages: de_DE, en_GB, es_ES, fr_CA, fr_FR, it_IT, pl_PL, pt_PT). Use kebab-case for folder names within assets (e.g., `feature-name/`) and group assets by feature or module to maintain clarity.

### Reusable Components (`/src/components/`)

Houses reusable UI components shared across multiple pages or features. Each component lives in its own folder using camelCase naming. Required files include the component file (`.component.tsx`) and test file (`.spec.tsx`). Optional files include a constants file (`.constants.ts`) for component-specific constants. Component folders use camelCase naming, while files use PascalCase. Components should be generic and reusable across different contexts.

### Page Components (`/src/pages/`)

Contains top-level page components that represent routes in the application. Each page lives in its own folder using camelCase naming. Required files include the page file (`.page.tsx`) and test file (`.spec.tsx`). Optional files include a constants file (`.constants.ts`) for page-specific constants. Page folders use camelCase naming, while files use PascalCase. Pages compose multiple components and represent full application views.

### Data Layer (`/src/data/`)

Central location for all data fetching, API calls, and data-related logic. The `api/` subfolder contains API service functions that make HTTP requests (`.api.ts` suffix). The `hooks/` subfolder contains custom hooks for data fetching using TanStack Query (`use` prefix). The `types/` subfolder contains TypeScript type definitions for API responses and data models (`.types.ts` suffix). The pattern separates concerns - API calls, data hooks, and types are in distinct folders. Hooks use API functions and types to provide data to components.

### Custom Hooks (`/src/hooks/`)

Contains custom React hooks for shared logic and state management. All hooks start with the `use` prefix (e.g., `useHookName.ts`). These hooks encapsulate reusable logic, side effects, and stateful behavior. This folder is for application-wide hooks (not data-fetching hooks, which go in `/src/data/hooks/`). Examples include form handling, UI state, browser APIs, and complex component logic.


### Type Definitions (`/src/types/`)

Contains TypeScript type definitions and interfaces used across the application. Files use PascalCase naming with `.types.ts` suffix (e.g., `UserManagement.types.ts`). This folder contains shared types, interfaces, enums, and type utilities. It's for application-wide types (not data-specific types, which go in `/src/data/types/`). Group related types in the same file.

### Utility Functions (`/src/utils/`)

Contains pure utility functions and helpers used throughout the application. Files use camelCase naming with `.utils.ts` suffix (e.g., `formatting.utils.ts`). Utilities provide pure functions for formatting, validation, transformation, etc. They should be stateless and side-effect free when possible. Each utility should have comprehensive unit tests.

## 📋 Naming Conventions

### Files and Folders

- **Folders**: `camelCase` (e.g., `userManagement`)
- **Components**: `PascalCase` (e.g., `UserManagement.component.tsx`)
- **Pages**: `PascalCase` (e.g., `UserManagement.page.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useUserManagement.ts`)
- **Types**: `PascalCase` with `.types.ts` suffix (e.g., `UserManagement.types.ts`)
- **Utils**: `PascalCase` with `.utils.ts` suffix (e.g., `UserManagement.utils.ts`)
- **Constants**: `PascalCase` with `.constants.ts` suffix (e.g., `UserManagement.constants.ts`)
- **Tests**: `PascalCase` with `.spec.tsx` suffix (e.g., `UserManagement.spec.tsx`)

### Import/Export Patterns

```typescript
// Component exports
export { ComponentName } from './ComponentName.component';

// Hook exports
export { useHookName } from './useHookName';

// Type exports
export type { TypeName } from './TypeName.types';

// Utility exports
export { utilName } from './UtilName.utils';

// Constant exports
export { CONSTANT_NAME } from './ConstantName.constants';
```

## 🔧 Configuration Files

### `package.json`

```json
{
  "name": "µ-application-name",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "manager-test",
    "test:ui": "manager-test --ui",
    "test:ci": "manager-test run --coverage",
    "lint": "manager-lint --config eslint.config.mjs ./src",
    "lint:fix": "manager-lint --fix --config eslint.config.mjs ./src ; yarn lint:modern:imports:fix",
    "lint:modern:imports:fix": "node scripts/muk-exports-order.mjs",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ovh-ux/muk": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@ovh-ux/manager-tailwind-config": "^0.6.0",
    "@ovh-ux/manager-tests-setup": "^0.2.0",
    "@ovh-ux/manager-vite-config": "^0.15.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "dist",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"],
      "@/setupTest": ["./setupTest.ts"]
    },
    "resolveJsonModule": true
  },
  "include": [
    "src",
    "**/*.json",
    "setupTests.ts",
    "global.d.ts"
  ],
  "exclude": ["node_modules", "dist", "types"]
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

export default defineConfig({
  ...getBaseConfig(),
  root: resolve(process.cwd()),
});
```

## 🧪 Testing Structure

### Test Organization

```
tests/
├── __mocks__/                  # Mock files
│   └── mockName.ts            # Mock file
├── __tests__/                 # Test files
│   ├── components/            # Component tests
│   ├── pages/                 # Page tests
│   ├── hooks/                 # Hook tests
│   └── utils/                 # Utility tests
└── setup.ts                   # Test setup
```

### Test File Naming

- **Component tests**: `ComponentName.spec.tsx`
- **Page tests**: `PageName.spec.tsx`
- **Hook tests**: `useHookName.spec.ts`
- **Utility tests**: `UtilName.spec.ts`

## 📚 Best Practices

### 1. Folder Organization

- **Group by feature**: Organize folders by feature rather than by file type
- **Consistent naming**: Use consistent naming conventions across all folders
- **Clear separation**: Keep different types of files in their respective folders
- **Avoid deep nesting**: Don't create too many nested folders

### 2. File Organization

- **Single responsibility**: Each file should have a single responsibility
- **Clear exports**: Use clear and consistent export patterns
- **Proper imports**: Use proper import statements and avoid circular dependencies
- **Type safety**: Use TypeScript for all files

### 3. Component Organization

- **Component-specific folders**: Each component should have its own folder
- **Related files together**: Keep related files (component, tests, constants) together
- **Clear naming**: Use clear and descriptive names for components
- **Proper structure**: Follow the established component structure


### 5. Testing Organization

- **Test co-location**: Keep tests close to the code they test
- **Clear test structure**: Use clear and consistent test structure
- **Proper mocking**: Use proper mocking for external dependencies
- **Comprehensive coverage**: Ensure comprehensive test coverage

## 🔄 Migration Guidelines

### From AngularJS to React

1. **Folder structure**: Migrate from AngularJS folder structure to React structure
2. **Component organization**: Convert AngularJS components to React components
3. **Service migration**: Convert AngularJS services to React hooks
4. **Testing migration**: Convert AngularJS tests to React tests

### From Other React Projects

1. **Structure alignment**: Align with OVHcloud Manager structure
2. **Naming conventions**: Follow OVHcloud Manager naming conventions
3. **File organization**: Organize files according to OVHcloud Manager standards
4. **Testing structure**: Align testing structure with OVHcloud Manager standards

## 📖 References

- [Development Standards](../30-best-practices/development-standards.md)
- [React Best Practices](../30-best-practices/react-best-practices.md)
- [Testing Guidelines](../30-best-practices/testing-guidelines.md)
- [TypeScript Guidelines](../30-best-practices/typescript-guidelines.md)

