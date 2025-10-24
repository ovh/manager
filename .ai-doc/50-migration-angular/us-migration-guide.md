---
title: US Migration Guide
last_update: 2025-01-27
tags: [migration, user-stories, angularjs, react, strategy, ovhcloud, manager]
ai: true
---

# US Migration Guide

## 🧭 Purpose

This document provides a **concise, US-centric strategy** for migrating AngularJS modules to React in the OVHcloud Manager ecosystem. It focuses on **100% functional parity** through user story mapping and incremental migration.

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

### 🚀 3-Phase Workflow

#### Phase 1: Discovery
```typescript
// 1. Identify AngularJS User Stories
const userStories = [
  {
    id: 'US-001',
    title: 'List user services',
    route: '/users',
    angularJS: {
      controller: 'UserListController',
      template: 'user-list.html',
      service: 'UserService'
    },
    react: {
      hook: 'useUserList',
      component: 'UserListPage',
      status: 'pending'
    }
  }
];

// 2. Create PLAN.md using migration-templates.md
// 3. Map each US to React components
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
- [ ] **Translations**: Same keys, values, namespaces
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

- **US-first approach** ensures complete functionality migration
- **100% parity** guarantees identical user experience
- **Incremental validation** prevents regressions
- **Complete documentation** enables team knowledge sharing

**👉 Good US migration is invisible to users but transformative for developers.**
