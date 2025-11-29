---
title: US Migration Guide
last_update: 2025-01-27
tags: [migration, user-stories, angularjs, react, strategy, ovhcloud, manager]
ai: true
---

# US Migration Guide

## 🧭 Purpose

This document provides a **concise, User Story centric strategy** for migrating AngularJS modules to React in the OVHcloud Manager ecosystem. It focuses on **100% functional parity** through user story mapping and incremental migration.

## ⚙️ Context

**Core Principle**: Migrate **one user story at a time** with **100% functional parity** before moving to the next.

## 🔗 References

- [Migration Patterns](./migration-patterns.md) - **AngularJS→React patterns**
- [Parity Validation Guide](./parity-validation-guide.md) - **Validation framework**
- [Migration Templates](./migration-templates.md) - **Templates PLAN.md, DoD**
- [Development Standards](../30-best-practices/development-standards.md) - **Code quality**
- [React Patterns](../30-best-practices/frontend-react-patterns.md) - **React patterns**

## 📘 US-First Migration Strategy

### 🎯 Core Principles

1. **One US = One Complete Route/Page**
2. **100% Parity**: Visual + Functional + Technical
3. **Incremental Migration**: Validate each US before next
4. **Zero Regression**: Each US must be identical to AngularJS
5. **UI Policy**: UI must use MUK components exclusively; fallback (non‑MUK) only if no MUK equivalent exists, with justification and follow‑up ticket.

### 🔒 Strategy Enforcement (Mandatory)
- US-first only: never migrate multiple US at once; one complete route/page per PR.
- MUK-first UI: do not introduce ODS/MRC if a MUK equivalent exists.
- Parity gates per US: visual, functional, and technical parity must be validated before merge.
- Documentation gates: PLAN.md created, MIGRATION_NOTES.md updated for every US.
- Fallback policy: if MUK lacks a feature, implement a minimal wrapper, document the justification, and link a follow-up ticket to replace with MUK.

### 🚀 3-Phase Workflow

#### Phase 1: Discovery

**Step 1: Analyze AngularJS Source Code**

Before identifying User Stories, systematically analyze the source:

```bash
# 1. Locate source module
cd packages/manager/modules/{module-name}/

# 2. Identify key files
ls -la src/*.routing.js    # Routes and states
ls -la src/*.template.html  # UI structure
ls -la src/*.controller.js  # Logic and data
ls -la src/*.constants.js   # Configuration
ls -la src/translations/    # i18n keys
```

**Step 2: Extract UI/UX Patterns from Templates**

Scan template files for OUI components to understand UI requirements:

```typescript
// Common patterns to detect:
const uiPatterns = {
  // Full page layouts
  managerListLayout: false,  // Check in routing resolve
  
  // Components in templates
  ouiDatagrid: false,        // <oui-datagrid>
  ouiHeader: false,          // <header class="oui-header">
  ouiHeaderTabs: false,      // <oui-header-tabs>
  ouiTile: false,            // <oui-tile>
  ouiModal: false,           // <oui-modal>
  ouiButton: false,          // <oui-button>
  
  // Features to detect
  hasSearch: false,          // Search input in template
  hasFilter: false,          // Filter button
  hasColumnCustomization: false,  // Gear icon
  hasPagination: false,      // Pagination controls
  hasTopbarCTA: false,       // CTA in topbar resolve
  hasChangelogButton: false, // <changelog-button>
  hasGuidesMenu: false,      // <oui-guide-menu>
  hasEditButton: false,      // Edit icon in header
};
```

**Step 3: Identify User Stories from Routes**

```typescript
// Extract from routing file
const userStories = [
  {
    id: 'US-001',
    title: 'List user services',
    route: '/users',
    angularJS: {
      controller: 'UserListController',
      template: 'user-list.html',
      service: 'UserService',
      // UI components detected:
      uiComponents: [
        'manager-list-layout',
        'oui-datagrid',
        'topbar CTA button',
        'filter button',
        'search input'
      ]
    },
    react: {
      hook: 'useUserList',
      component: 'UserListPage',
      status: 'pending',
      // MUK components needed:
      mukComponents: [
        'Layout',
        'Table',
        'Button (CTA)',
        'Button (Filter)',
        'Input (Search)'
      ]
    }
  }
];

// 4. Create PLAN.md using migration-templates.md
// 5. Map each US to React components with UI requirements
```

**Step 4: Plan i18n Strategy (Values Preserved, Keys May Change)**

```markdown
## i18n Migration Plan
- Extract legacy `Messages_*.json` to build key→value map
- Define new key schema/namespaces for the React µapp
- Produce a legacy→new key mapping (values unchanged)
- Import same values under the new keys
- Document mapping in `MIGRATION_NOTES.md`
```

**Step 5: Plan Assets/Images Strategy (Content Preserved, Paths May Change)**

```markdown
## Assets/Images Migration Plan
- Inventory used images from templates and styles (usage-based)
- Copy used images as-is into the React assets folder
- Define the new assets structure and import pattern
- Produce a legacy→new path mapping (content unchanged)
- Document mapping in `MIGRATION_NOTES.md`
```

**Step 4: Document Missing Features**

Create checklist of features found in AngularJS that must be implemented:

```markdown
## Features Detected in AngularJS (must reproduce in React)

### Listing Page (US-001)
- [x] Title in header
- [x] Order button in top-right
- [ ] **Roadmap & Changelog button** (MISSING in initial implementation)
- [ ] **Filter button** next to search (MISSING in initial implementation)
- [ ] **Column customization gear icon** (MISSING in initial implementation)
- [x] Search input
- [x] Data grid with sortable columns
- [x] Pagination controls
- [ ] **Page size selector** (MISSING in initial implementation)
```

#### Phase 2: Migration
```typescript
// For each US:
// 1. Create React hook (use migration-patterns.md)
// 2. Create React component (use 30-best-practices/)
// 3. Create tests
// 4. Validate parity
```

#### Phase 3: Validation
```typescript
// Use parity-validation-guide.md for each US:
// 1. Visual parity (pixel-perfect)
// 2. Functional parity (identical behavior)
// 3. Technical parity (URLs, translations, accessibility)
```

## 📋 US Migration Checklist

### Pre-Migration (Per US)
- [ ] **US identified**: Route, controller, template, service mapped
- [ ] **Dependencies analyzed**: API calls, shared services, translations
- [ ] **PLAN.md created**: Using migration-templates.md
- [ ] **React mapping defined**: Hook + Component + Tests

### During Migration (Per US)
- [ ] **React hook created**: Using migration-patterns.md
- [ ] **React component created**: Using 30-best-practices/
- [ ] **Tests written**: Unit + E2E tests
- [ ] **MUK components used**: UI consistency and business logic

### Post-Migration (Per US)
- [ ] **Visual parity validated**: Side-by-side comparison
- [ ] **Functional parity validated**: Identical user journeys
- [ ] **Technical parity validated**: URLs, translations, accessibility
- [ ] **Performance validated**: No regression
- [ ] **Documentation updated**: MIGRATION_NOTES.md

## 🎯 US Parity Requirements

### Visual Parity (100% Identical)
- [ ] **Columns**: Count, order, labels, visibility identical
- [ ] **Formatting**: Dates, sizes, enumerations identical
- [ ] **States**: Loading, empty, error identical
- [ ] **Interactions**: Clicks, hovers, focus identical

### Functional Parity (100% Identical)
- [ ] **API calls**: Same endpoints, parameters, responses
- [ ] **Business logic**: Identical calculations, validations
- [ ] **Navigation**: Same routes, parameters, deep links
- [ ] **Error handling**: Same error messages, recovery

### Technical Parity (100% Identical)
- [ ] **URLs**: Same paths, query parameters, hash routing
- [ ] **Translations**: Values identical; keys may differ if mapping documented
- [ ] **Accessibility**: Same ARIA, keyboard navigation
- [ ] **Performance**: Same or better LCP, INP, CLS

## 🚫 Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Big Bang migration
// Don't migrate multiple US at once

// ✅ CORRECT: One US at a time
// Migrate and validate each US completely

// ❌ WRONG: Skipping parity validation
// Don't assume parity without validation

// ✅ CORRECT: Always validate parity
// Use parity-validation-guide.md for each US

// ❌ WRONG: Changing business logic
// Don't "improve" during migration

// ✅ CORRECT: Identical logic
// Reproduce AngularJS exactly
```

## ✅ Best Practices

```typescript
// ✅ CORRECT: US-first approach
// 1. Identify all US in AngularJS
// 2. Map each US to React
// 3. Migrate one US at a time
// 4. Validate 100% parity per US

// ✅ CORRECT: Use established patterns
// - migration-patterns.md for AngularJS→React
// - 30-best-practices/ for React patterns
// - parity-validation-guide.md for validation

// ✅ CORRECT: Complete documentation
// - PLAN.md for each US
// - MIGRATION_NOTES.md for decisions
// - DoD for validation criteria
```

## ✅ Migration Gates (Do not merge unless all pass)

### PR Checklist (Per US)
- [ ] US-first respected: one route/page fully migrated
- [ ] UI built with MUK components only (fallback justified + ticket if any)
- [ ] Visual parity validated (columns, formatting, states)
- [ ] Functional parity validated (APIs, interactions, errors)
- [ ] Technical parity validated (URLs, translations values, accessibility)
- [ ] Performance parity validated (no regression)
- [ ] PLAN.md created for the US
- [ ] MIGRATION_NOTES.md updated (i18n keys mapping, assets mapping, decisions)

### Reviewer Gate
- Reject if ODS/MRC is used where a MUK equivalent exists.
- Reject if parity checks are missing or incomplete.
- Require a follow-up ticket link for any temporary fallback.

## 🚀 Quick Start Workflow

### Step 1: Discovery
```bash
# 1. Analyze AngularJS module
@codebase_search "AngularJS controllers in target module"

# 2. Create PLAN.md
@create_file "docs/PLAN.md" using migration-templates.md

# 3. Map US to React
@create_file "docs/US_MAPPING.md"
```

### Step 2: Migration (Per US)
```bash
# 4. Create React hook
@create_file "src/hooks/use<US>.ts" using migration-patterns.md

# 5. Create React component
@create_file "src/components/<US>Page.tsx" using 30-best-practices/

# 6. Create tests
@create_file "src/components/<US>Page.test.tsx"
```

### Step 3: Validation (Per US)
```bash
# 7. Validate parity
@run_parity_test "npm run test:parity" using parity-validation-guide.md

# 8. Update documentation
@update_file "docs/MIGRATION_NOTES.md"
```

## 📚 Reference Guide Usage

### For Each US Migration:
1. **Start**: Read this guide (strategy)
2. **Implement**: Use [migration-patterns.md](./migration-patterns.md) for AngularJS→React patterns
3. **Code**: Use [30-best-practices/](../30-best-practices/) for React patterns
4. **Validate**: Use [parity-validation-guide.md](./parity-validation-guide.md) for validation
5. **Document**: Use [migration-templates.md](./migration-templates.md) for templates

### Quick Reference:
- **Strategy**: This guide (us-migration-guide.md)
- **Patterns**: migration-patterns.md + 30-best-practices/
- **Validation**: parity-validation-guide.md
- **Templates**: migration-templates.md

---

## 🤖 AI Development Guidelines

### Essential US Migration Rules for AI Code Generation

1. **US-first approach**: Always start with US identification and mapping
2. **One US at a time**: Never migrate multiple US simultaneously
3. **100% parity**: Visual, functional, and technical parity required
4. **Incremental validation**: Validate each US before proceeding
5. **Use established patterns**: migration-patterns.md + 30-best-practices/
6. **Complete documentation**: PLAN.md, MIGRATION_NOTES.md, DoD
7. **Zero regression**: Each US must be identical to AngularJS
8. **Continuous validation**: Use parity-validation-guide.md throughout

### US Migration Checklist

- [ ] All US identified and mapped
- [ ] PLAN.md created for each US
- [ ] React hook created using migration-patterns.md
- [ ] React component created using 30-best-practices/
- [ ] Tests written and passing
- [ ] Visual parity validated using parity-validation-guide.md
- [ ] Functional parity validated using parity-validation-guide.md
- [ ] Technical parity validated using parity-validation-guide.md
- [ ] MIGRATION_NOTES.md updated
- [ ] Ready for next US

---

## ⚖️ The US Migration's Moral

- **Source code analysis first** prevents missing UI features
- **US-first approach** ensures complete functionality migration
- **100% parity** guarantees identical user experience (including ALL buttons, filters, customizations)
- **Incremental validation** prevents regressions
- **Complete documentation** enables team knowledge sharing

**👉 Good US migration is invisible to users but transformative for developers.**

---

## 🎯 Quick Win: Perfect Migration from First Prompt

To achieve a perfect migration from the first prompt:

1. **Always start with source code analysis** (5 minutes)
   - Use [90-quickstart/pre-migration-analysis.md](../90-quickstart/pre-migration-analysis.md)
   - Scan routing, templates, controllers
   - Document ALL detected features

2. **Use Phase 1: Discovery systematically**
   - Extract UI components from templates
   - Identify ALL buttons and actions (Order, Roadmap, Filter, etc.)
   - Map OUI→MUK components
   - Create features checklist

3. **Implement with complete context**
   - Use detected features list
   - Map all OUI components to MUK
   - Reproduce ALL UI elements
   - No assumptions, only facts from source

**Result**: Complete, pixel-perfect implementation from day one, no missing features.
