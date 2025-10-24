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
│   │       ├── componentName.constants.ts
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
│   │       ├── pageName.constants.ts
│   │       └── PageName.spec.tsx
│   ├── services/                 # Business logic services
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

## 📁 Folder Details

### `/public/` - Static Assets

```
public/
├── assets/                      # Static assets
│   └── feature-name/           # Feature-specific assets
└── translations/               # i18n translation files
    └── namespace-name/         # Feature-specific translations
        ├── Messages_de_DE.json
        ├── Messages_en_GB.json
        ├── Messages_es_ES.json
        ├── Messages_fr_CA.json
        ├── Messages_fr_FR.json
        ├── Messages_it_IT.json
        ├── Messages_pl_PL.json
        └── Messages_pt_PT.json
```

### `/src/components/` - Reusable Components

```
components/
└── componentName/              # Component-specific folder
    ├── ComponentName.component.tsx    # Main component file
    ├── componentName.constants.ts     # Component constants
    └── ComponentName.spec.tsx         # Component tests
```

### `/src/pages/` - Page Components

```
pages/
└── pageName/                   # Page-specific folder
    ├── PageName.page.tsx       # Main page component
    ├── pageName.constants.ts   # Page constants
    └── PageName.spec.tsx       # Page tests
```

### `/src/data/` - Data Layer

```
data/
├── api/                        # API service functions
│   └── serviceName.api.ts      # API service file
├── hooks/                      # Data fetching hooks
│   └── useServiceName.ts       # Data hook file
└── types/                      # Data type definitions
    └── serviceName.types.ts    # Data types file
```

### `/src/hooks/` - Custom Hooks

```
hooks/
└── useHookName.ts              # Custom hook file
```

### `/src/services/` - Business Logic

```
services/
└── serviceName.service.ts      # Service file
```

### `/src/types/` - Type Definitions

```
types/
└── typeName.types.ts           # Type definition file
```

### `/src/utils/` - Utility Functions

```
utils/
└── utilName.utils.ts           # Utility function file
```

## 📋 Naming Conventions

### Files and Folders

- **Folders**: `camelCase` (e.g., `userManagement`)
- **Components**: `PascalCase` (e.g., `UserManagement.component.tsx`)
- **Pages**: `PascalCase` (e.g., `UserManagement.page.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useUserManagement.ts`)
- **Services**: `camelCase` with `.service.ts` suffix (e.g., `userManagement.service.ts`)
- **Types**: `camelCase` with `.types.ts` suffix (e.g., `userManagement.types.ts`)
- **Utils**: `camelCase` with `.utils.ts` suffix (e.g., `userManagement.utils.ts`)
- **Constants**: `camelCase` with `.constants.ts` suffix (e.g., `userManagement.constants.ts`)
- **Tests**: `PascalCase` with `.spec.tsx` suffix (e.g., `UserManagement.spec.tsx`)

### Import/Export Patterns

```typescript
// Component exports
export { ComponentName } from './ComponentName.component';

// Hook exports
export { useHookName } from './useHookName';

// Service exports
export { serviceName } from './serviceName.service';

// Type exports
export type { TypeName } from './typeName.types';

// Utility exports
export { utilName } from './utilName.utils';

// Constant exports
export { CONSTANT_NAME } from './constantName.constants';
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
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
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
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
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
│   ├── services/              # Service tests
│   └── utils/                 # Utility tests
└── setup.ts                   # Test setup
```

### Test File Naming

- **Component tests**: `ComponentName.spec.tsx`
- **Page tests**: `PageName.spec.tsx`
- **Hook tests**: `useHookName.spec.ts`
- **Service tests**: `serviceName.spec.ts`
- **Utility tests**: `utilName.spec.ts`

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

### 4. Service Organization

- **Business logic separation**: Keep business logic in services
- **API separation**: Keep API calls in separate files
- **Hook integration**: Use hooks to integrate services with components
- **Type safety**: Use TypeScript for all service files

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
