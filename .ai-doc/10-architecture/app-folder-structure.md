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
│   │   └── feature-name/         # Feature-specific assets
│   └── translations/             # i18n translation files
│       └── namespace-name/        # Feature-specific translations
│           ├── Messages_de_DE.json
│           ├── Messages_en_GB.json
│           ├── Messages_es_ES.json
│           ├── Messages_fr_CA.json
│           ├── Messages_fr_FR.json
│           ├── Messages_it_IT.json
│           ├── Messages_pl_PL.json
│           └── Messages_pt_PT.json
├── src/
│   ├── components/               # Reusable UI components
│   │   └── componentName/        # Component-specific folder
│   │       ├── ComponentName.component.tsx
│   │       ├── componentName.constants.ts
│   │       └── ComponentName.spec.tsx
│   ├── constants/                # Application constants
│   │   └── constants.ts          # Global constants
│   ├── data/                     # Data layer
│   │   ├── api/                  # API service functions
│   │   │   └── apiGroup.ts       # API group functions
│   │   ├── hooks/                # Data-related hooks
│   │   │   └── apiGroup/         # API-specific hooks
│   │   │       ├── useApiGroup.tsx
│   │   │       └── useApiGroup.spec.tsx
│   │   └── types/                # Data layer types
│   │       └── api.types.ts      # API-related types
│   ├── hooks/                    # Custom React hooks
│   │   └── hookName/             # Hook-specific folder
│   │       ├── useHookName.tsx
│   │       └── useHookName.spec.tsx
│   ├── pages/                    # Page components (route handlers)
│   │   ├── onboarding/           # Onboarding page
│   │   ├── listing/              # Resource listing page
│   │   │   ├── add/              # Add resource page
│   │   │   ├── delete/           # Delete resource page
│   │   │   └── update/           # Update resource page
│   │   └── dashboard/             # Resource dashboard
│   │       ├── general-information/
│   │       │   ├── delete/       # Delete from dashboard
│   │       │   └── update/       # Update from dashboard
│   │       └── items/            # Sub-resources
│   │           ├── item/         # Individual item
│   │           │   └── dashboard/
│   │           │       └── general-information/
│   │           │           ├── deleteItem/
│   │           │           └── updateItem/
│   │           ├── addItem/      # Add sub-resource
│   │           ├── deleteItem/   # Delete sub-resource
│   │           └── updateItem/   # Update sub-resource
│   ├── routes/                   # Routing configuration
│   │   ├── routes.tsx            # Route definitions
│   │   ├── routes.constants.ts   # Route constants
│   │   └── routes.utils.ts       # Route utilities
│   ├── types/                    # Global TypeScript types
│   │   ├── interface-name.interface.ts
│   │   └── type-name.type.ts
│   ├── utils/                    # Utility functions
│   │   └── utility-name.ts       # Utility functions
│   ├── assets/                   # Source assets (SVG, etc.)
│   │   └── feature-name/         # Feature-specific assets
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # Application entry point
│   ├── index.scss                # Global styles
│   ├── i18n.ts                   # Internationalization setup
│   ├── queryClient.ts            # TanStack Query configuration
│   └── tracking.constant.ts      # Analytics tracking constants
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.mjs               # Vite build configuration
├── tailwind.config.mjs           # Tailwind CSS configuration
├── vitest.config.js              # Testing configuration
├── .eslintrc.cjs                 # ESLint configuration
└── .gitignore                    # Git ignore rules
```

## 📁 Directory Guidelines

### `/public/` Directory

#### `assets/`
- **Purpose**: Static assets served directly by the web server
- **Content**: Images, icons, fonts, and other static files
- **Organization**: Group by feature or type
- **Naming**: Use kebab-case for file names

#### `translations/`
- **Purpose**: Internationalization files for the application
- **Structure**: Organized by namespace (feature)
- **Files**: Language-specific JSON files following OVH locale format
- **Languages**: Support for DE, EN, ES, FR, IT, PL, PT

### `/src/` Directory

#### `components/`
- **Purpose**: Reusable UI components specific to the application
- **Organization**: Each component in its own folder
- **Files**: Component, constants, and test files
- **Naming**: PascalCase for components, camelCase for utilities

#### `data/`
- **Purpose**: Data layer for backend interactions
- **Structure**:
  - `api/`: HTTP client functions using axios
  - `hooks/`: TanStack Query hooks for data fetching
  - `types/`: TypeScript definitions for data models

#### `hooks/`
- **Purpose**: Custom React hooks for business logic
- **Organization**: Each hook in its own folder
- **Files**: Hook implementation and test files
- **Naming**: camelCase starting with "use"

#### `pages/`
- **Purpose**: Route components that render full pages
- **Organization**: Mirror the application's routing structure
- **Structure**:
  - `onboarding/`: Product introduction page
  - `listing/`: Resource listing with CRUD operations
  - `dashboard/`: Resource details with tabs and sub-resources

#### `routes/`
- **Purpose**: Routing configuration and route definitions
- **Files**:
  - `routes.tsx`: Route object definitions
  - `routes.constants.ts`: URL builders and constants
  - `routes.utils.ts`: Route utilities and helpers

#### `types/`
- **Purpose**: Global TypeScript type definitions
- **Organization**: Group by domain or feature
- **Naming**: Descriptive names with appropriate suffixes

#### `utils/`
- **Purpose**: Pure utility functions and helpers
- **Organization**: Group by functionality
- **Naming**: Descriptive names indicating purpose

## 🏗️ Component Organization

### Component Folder Structure

Each component must be defined in its own sub-folder:

```
components/
└── componentName/
    ├── ComponentName.component.tsx    # Main component
    ├── componentName.constants.ts     # Component constants
    └── ComponentName.spec.tsx         # Component tests
```

### Hook Folder Structure

Each hook must be defined in its own sub-folder:

```
hooks/
└── hookName/
    ├── useHookName.tsx                # Hook implementation
    └── useHookName.spec.tsx           # Hook tests
```

### Page Folder Structure

Pages follow the routing structure:

```
pages/
├── pageName/
│   ├── PageName.page.tsx              # Main page component
│   ├── pageName.constants.ts          # Page constants
│   └── children/                      # Child routes
│       ├── Children.page.tsx
│       └── children.constants.ts
```

## 🛣️ Routing Structure

### Route Configuration

Routes are defined in `routes/routes.tsx` with tracking configuration:

```typescript
const routes = [
  {
    id: 'onboarding',
    path: 'onboarding',
    ...lazyRouteConfig(() => import('@/pages/onboarding')),
    handle: {
      tracking: {
        pageName: 'onboarding',
        pageType: PageType.onboarding,
      }
    }
  },
  {
    id: 'listing',
    path: 'listing',
    ...lazyRouteConfig(() => import('@/pages/listing')),
    handle: {
      tracking: {
        pageName: 'listing',
        pageType: PageType.listing,
      }
    }
  }
];
```

### Route Constants

URL builders and route constants in `routes/routes.constants.ts`:

```typescript
export const ROUTE_PATHS = {
  root: '/µ-application-name',
  onboarding: '/onboarding',
  listing: '/µ-application-name',
  listingAdd: '/add',
  listingDelete: '/delete/:resource-id',
  listingUpdate: '/update/:resource-id',
  dashboard: '/:resource-id',
  dashboardDelete: '/delete',
  dashboardUpdate: '/update',
};
```

## 📄 File Naming Conventions

### Component Files
- **Components**: `ComponentName.component.tsx`
- **Constants**: `componentName.constants.ts`
- **Tests**: `ComponentName.spec.tsx`

### Hook Files
- **Hooks**: `useHookName.tsx`
- **Tests**: `useHookName.spec.tsx`

### Page Files
- **Pages**: `PageName.page.tsx`
- **Constants**: `pageName.constants.ts`

### Type Files
- **Interfaces**: `interface-name.interface.ts`
- **Types**: `type-name.type.ts`

### Utility Files
- **Utilities**: `utility-name.ts`

## 🔧 Configuration Files

### Required Configuration Files

```
µ-application-name/
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.mjs               # Vite build configuration
├── tailwind.config.mjs           # Tailwind CSS configuration
├── vitest.config.js              # Testing configuration
├── .eslintrc.cjs                 # ESLint configuration
├── .gitignore                    # Git ignore rules
└── index.html                    # HTML entry point
```

### Optional Configuration Files

```
µ-application-name/
├── postcss.config.js             # PostCSS configuration
├── jest.config.js                # Jest configuration (if used)
├── playwright.config.ts          # Playwright configuration
└── .env                          # Environment variables
```

## 🎯 Best Practices

### 1. Feature-Based Organization
- Group related files by feature/domain
- Keep components, hooks, and types together
- Use consistent naming across features

### 2. File Naming
- **PascalCase**: Components, pages, and major files
- **camelCase**: Hooks, utilities, and helper functions
- **kebab-case**: Translation files and assets
- **snake_case**: Configuration files

### 3. Import Organization
- Group imports by type (external, internal, relative)
- Use absolute imports for internal modules
- Maintain consistent import order

### 4. Testing Structure
- Co-locate test files with source files
- Use descriptive test file names
- Follow the same folder structure for tests

## 🔄 Migration Guidelines

### From AngularJS to React
- Maintain existing URL structure
- Preserve user workflows
- Follow strangler pattern for gradual migration

### From Legacy Structure
- Gradually reorganize existing files
- Maintain backward compatibility during transition
- Update import paths systematically

## 📋 Checklist

### New Project Setup
- [ ] Create folder structure following standard
- [ ] Set up configuration files
- [ ] Configure routing with tracking
- [ ] Set up internationalization
- [ ] Configure build and test tools

### Existing Project Migration
- [ ] Audit current structure
- [ ] Plan migration strategy
- [ ] Update import paths
- [ ] Test functionality after changes
- [ ] Update documentation

## 🔗 References

- [Development Standards](../30-best-practices/development-standards.md)
- [React µApp Blueprint](./react-uapp-blueprint.md)
- [Data Fetching Patterns](./data-fetching.md)
- [React Tracking](./react-tracking.md)
- [Common Translations](./common-translations.md)
