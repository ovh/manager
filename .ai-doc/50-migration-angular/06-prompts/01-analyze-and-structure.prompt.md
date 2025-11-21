---
title: "Prompt 1: Analyze Source & Generate Structure"
prompt_id: "01-analyze-and-structure"
phase: "automated-migration"
sequence: 1
tags: [prompt, analysis, structure, automation]
ai: true
---

# Prompt 1: Analyze Source & Generate Structure

## 🎯 Objective

Analyze the AngularJS module source code, detect all patterns, and generate the complete React project structure with empty files and TODO comments.

**DO NOT implement features yet. Only create structure and analysis.**

## 📋 Context

This is the **first prompt** in the automated 2-prompt migration workflow. After this prompt, you'll have a complete project structure ready for implementation.

## ✅ Prerequisites

- [ ] AngularJS source path provided
- [ ] Target React app path provided
- [ ] Access to `.ai-doc/` documentation

## 📥 Required Inputs

| Input | Description | Example |
|-------|-------------|---------|
| `SOURCE_PATH` | Path to AngularJS module | `packages/manager/modules/nasha` |
| `TARGET_PATH` | Path to React app | `packages/manager/apps/bmc-nasha` |
| `MODULE_NAME` | Module name | `nasha` |

## 🔧 Actions to Execute

### Step 1: Analyze Routing

```bash
# Read all routing files
@{SOURCE_PATH}/src/**/*.routing.js

# Extract:
- All state definitions ($stateProvider.state)
- All URL patterns
- All component names
- All resolve functions
- All redirectTo logic
```

**Reference**: [Migration Patterns - Route Detection](../migration-patterns.md#route-detection-patterns)

### Step 2: Analyze Templates

```bash
# Read all template files
@{SOURCE_PATH}/src/**/*.template.html

# Detect:
- OUI components used (<oui-datagrid>, <oui-tile>, etc.)
- UI features (search, filter, pagination, etc.)
- Layout patterns (managerListLayout, header, tabs)
- Forms and inputs
- Modals and drawers
```

**Reference**: [Migration Patterns - OUI Component Detection](../migration-patterns.md#oui-component-detection-patterns)

### Step 3: Analyze API Calls

```bash
# Read routing resolves and controllers
@{SOURCE_PATH}/src/**/*.{routing,controller}.js

# Detect:
- AAPI endpoints (OvhApi*.Aapi())
- Iceberg queries (iceberg().query())
- v6 API calls ($http.get/post/put/delete)
- v2 API calls (if any)
```

**Reference**: [Migration Patterns - API Endpoint Detection](../migration-patterns.md#api-endpoint-detection)

### Step 4: Analyze Translations

```bash
# Read translation files
@{SOURCE_PATH}/src/translations/Messages_*.json

# Extract:
- All translation keys
- Key naming patterns
- Namespaces used
```

**Reference**: [Migration Guide - i18n Policy](../README.md#i18n-translations-policy)

### Step 5: Analyze Assets

```bash
# Find images and assets
@{SOURCE_PATH}/src/assets/**/*

# List:
- All image files used
- Icon files
- Other static assets
```

**Reference**: [Migration Guide - Assets Policy](../README.md#assets-images-policy)

### Step 6: Generate Analysis Report

Create `{TARGET_PATH}/analysis-report.md` with:

```markdown
# Migration Analysis Report

**Module**: {MODULE_NAME}
**Source**: {SOURCE_PATH}
**Target**: {TARGET_PATH}
**Date**: {DATE}

## Routes Detected

| State Name | URL | Component | Has Resolve | Has Redirect |
|------------|-----|-----------|-------------|--------------|
| state1 | /url1 | Component1 | Yes | No |
| ... | ... | ... | ... | ... |

## API Endpoints Detected

| Type | Endpoint | Location | Maps To |
|------|----------|----------|---------|
| AAPI | /dedicated/nasha | resolve.nasha | useNashaDetail hook |
| ... | ... | ... | ... |

## OUI Components Used

| Component | Count | Maps To MUK |
|-----------|-------|-------------|
| <oui-datagrid> | 1 | <Datagrid> |
| <oui-tile> | 3 | <Tile.Root> |
| ... | ... | ... |

## UI Features Detected

- [ ] Search
- [ ] Filter
- [ ] Column customization
- [ ] Pagination
- [ ] Topbar CTA
- [ ] Changelog button
- [ ] Guides menu
- [ ] Edit buttons

## Translation Keys

**Total keys**: X
**Namespaces**: listing, dashboard, common, ...

## Assets

**Total images**: X
**List**: [...]

## Complexity Assessment

- **Routes**: X (simple/medium/complex)
- **API calls**: X (simple/medium/complex)
- **UI components**: X (simple/medium/complex)
- **Overall**: (simple/medium/complex)
```

### Step 7: Generate Feature Checklist

Create `{TARGET_PATH}/DETECTED_FEATURES.md`:

```markdown
# Detected Features Checklist

## Routes
- [ ] Root redirect route (/)
- [ ] Onboarding page (/onboarding)
- [ ] Listing page (/listing)
- [ ] Dashboard page (/:serviceName)
- [ ] Detail pages
- [ ] Form pages

## API Integration
- [ ] AAPI: /dedicated/{module}/{serviceName}
- [ ] Iceberg: /dedicated/{module}/partition
- [ ] v6: /dedicated/{module}/{serviceName}/serviceInfos
- [ ] ... (list all detected)

## UI Components (MUK-first)
- [ ] BaseLayout with header
- [ ] Datagrid with columns
- [ ] Tiles for information display
- [ ] Buttons and ActionMenus
- [ ] Forms (if any)
- [ ] Modals (if any)

## Features
- [ ] Search functionality
- [ ] Filter functionality
- [ ] Column customization
- [ ] Pagination
- [ ] Tracking integration
- [ ] Error handling
- [ ] Loading states

## Translations
- [ ] Migrate all keys from Messages_*.json
- [ ] Maintain exact text values
- [ ] Rationalize key names (document mapping)

## Assets
- [ ] Copy all used images
- [ ] Update import paths
- [ ] Document path mapping
```

### Step 8: Generate Project Structure

Create the following directory structure with **empty files** and **TODO comments**:

```typescript
// Create this structure at {TARGET_PATH}/src/

// App setup
App.tsx                                 // TODO: Setup providers
App.constants.ts                        // TODO: Add constants from analysis
QueryClient.ts                          // TODO: Configure React Query

// Routes
routes/
├── Routes.tsx                          // TODO: Map X routes from analysis
├── Routes.constants.ts                 // TODO: Add URL constants
└── Routes.utils.ts                     // TODO: Add getRoot() helper

// Pages
pages/
├── Main.layout.tsx                     // TODO: Setup main layout
├── root/
│   └── Root.page.tsx                  // TODO: Implement redirect logic
├── onboarding/
│   └── Onboarding.page.tsx            // TODO: Implement onboarding
├── listing/
│   └── Listing.page.tsx               // TODO: Implement listing with Datagrid
└── dashboard/
    └── Dashboard.page.tsx             // TODO: Implement dashboard

// API Hooks (create based on detected API endpoints)
data/
└── api/
    └── hooks/
        ├── use{Module}Detail.ts       // TODO: AAPI endpoint
        ├── use{Module}List.ts         // TODO: Iceberg endpoint
        └── useUpdate{Module}.ts       // TODO: Mutation endpoint

// Components
components/
├── debug/
│   └── ErrorBoundary.component.tsx    // TODO: Setup error boundary
└── header/
    └── {Module}Header.component.tsx   // TODO: Custom header if needed

// Utils
utils/
├── {module}.utils.ts                  // TODO: Add prepareData functions
└── error.utils.ts                     // TODO: Error mapping

// Hooks
hooks/
├── useHidePreloader.ts                // TODO: Shell integration
└── useShellRoutingSync.ts             // TODO: Routing sync

// Types
types/
├── {Module}.type.ts                   // TODO: Add types from API
└── Dashboard.type.ts                  // TODO: Add page-specific types

// Constants
constants/
├── {Module}.constants.ts              // TODO: Module constants
├── Changelog.constants.ts             // TODO: Changelog config
└── Guides.constants.ts                // TODO: Guides URLs

// Translations
translations/
├── en.json                            // TODO: Copy from Messages_en.json
├── fr.json                            // TODO: Copy from Messages_fr.json
└── ... (other locales)

// Assets
assets/
└── images/
    └── ... (copy used images)
```

**Reference**: [Code Templates](../code-templates.md)

### Step 9: Add TODO Comments to Key Files

Add clear TODO comments in generated files:

```typescript
// Routes.tsx
// TODO: Map these routes from AngularJS:
// - nasha (/) -> Root redirect
// - nasha.onboarding (/onboarding) -> OnboardingPage
// - nasha.directory (/listing) -> ListingPage with managerListLayout pattern
// - nasha.dashboard (/:serviceName) -> DashboardPage
// Reference: @.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md

// Listing.page.tsx
// TODO: Implement listing page
// AngularJS used: managerListLayout component
// React must use: BaseLayout + Datagrid (MUK)
// Features detected: search, filter, columnCustomization, topbarCTA
// Reference: @.ai-doc/50-migration-angular/code-templates.md#listing-page

// use{Module}Detail.ts
// TODO: Implement AAPI hook
// AngularJS resolve: OvhApiDedicatedNasha.Aapi().get({ serviceName })
// React hook: useQuery with aapi.get()
// Reference: @.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md#aapi-mappings
```

## 📤 Expected Outputs

At the end of this prompt, you must have created:

| File | Description |
|------|-------------|
| `{TARGET_PATH}/analysis-report.md` | Complete analysis report |
| `{TARGET_PATH}/DETECTED_FEATURES.md` | Feature checklist |
| `{TARGET_PATH}/src/` | Complete directory structure |
| `{TARGET_PATH}/src/**/*.{ts,tsx}` | All files with TODO comments |
| `{TARGET_PATH}/package.json` | If not exists, create from template |
| `{TARGET_PATH}/vite.config.ts` | If not exists, create from template |
| `{TARGET_PATH}/tsconfig.json` | If not exists, create from template |

## ✅ Validation Checklist

Before proceeding to Prompt 2, verify:

- [ ] `analysis-report.md` exists and is complete
- [ ] `DETECTED_FEATURES.md` exists with all features listed
- [ ] All directories in structure exist
- [ ] All key files exist (even if empty with TODOs)
- [ ] TODO comments are clear and reference docs
- [ ] No implementation code yet (structure only)
- [ ] All detected routes have corresponding pages
- [ ] All detected API calls have corresponding hooks
- [ ] All detected OUI components mapped to MUK

## 📚 References

**Primary Docs:**
- [Decision Tree](../01-workflows/decision-tree.json) - Overall workflow
- [Migration Patterns](../migration-patterns.md) - Detection patterns
- [Code Templates](../code-templates.md) - Structure templates
- [AngularJS React Mapping](../angularjs-react-mapping-guide.md) - Mappings

**Dependencies:**
- [MUK Components](@.ai-doc/20-dependencies/muk.md)
- [React Router](@.ai-doc/20-dependencies/react-router-dom.md)
- [React Query](@.ai-doc/20-dependencies/tanstack-react-query.md)
- [Manager Core API](@.ai-doc/20-dependencies/manager-core-api.md)

## ➡️ Next Steps

After completing this prompt successfully:

1. Review `analysis-report.md` with user (optional)
2. Proceed to **[Prompt 2: Implement Features](./02-implement-features.prompt.md)**

---

## 📋 Copy-Paste Template

```
Analyze AngularJS module and generate React structure:

SOURCE: @packages/manager/modules/{module-name}
TARGET: @packages/manager/apps/{target-app-name}

Follow: @.ai-doc/50-migration-angular/06-prompts/01-analyze-and-structure.prompt.md

OUTPUT:
- analysis-report.md
- DETECTED_FEATURES.md
- Complete src/ directory structure with TODO comments

DO NOT implement features yet. Only structure and analysis.
```

Replace `{module-name}` and `{target-app-name}` with actual values before pasting.
