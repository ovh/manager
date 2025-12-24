---
title: Migration Quickstart Checklist
last_update: 2025-01-27
tags: [migration, checklist, quickstart]
ai: true
---

# Migration Quickstart Checklist

## Before Starting
- [ ] Read source AngularJS routing in `src/xxx.routing.js`
- [ ] Identify API endpoints used
- [ ] List all pages/states to migrate
- [ ] Check which MUK components are available (see muk-components-reference.md)

## Step 1: App.constants.ts
- [ ] Set `listingApi: 'v6Iceberg'` or `'v2'`
- [ ] Set `listingEndpoint: '/api/endpoint'`
- [ ] Configure `ONBOARDING_CONFIG` with real links

## Step 2: Types
- [ ] Create `types/Service.type.ts`
- [ ] Add `extends Record<string, unknown>` for Datagrid compatibility

## Step 3: API Hooks
- [ ] Use `fetchIcebergV6` or `fetchIcebergV2`
- [ ] Return `{ data, totalCount, status }`
- [ ] Create check hook for empty state

## Step 4: Pages
- [ ] Use HTML + Tailwind instead of missing MUK components
- [ ] Use `trackClick({ actions: ['name'] })`
- [ ] Keep navigation relative: `navigate('route')`

## Step 5: Translations
- [ ] Update all 8 locales
- [ ] Load namespaces in index.tsx

## Common Gotchas
1. MUK Button variants: `default`, `ghost`, `outline` (NOT `primary`)
2. Datagrid: Use `totalCount`, NOT `totalItems`
3. Tracking: Use object with `actions` array
4. Navigation: Use relative paths
5. Spinner: Use CSS animation, not MUK component
6. Links/Title/Subtitle: Use HTML elements with Tailwind

## Quick Fixes for Common Errors

### MUK Component Errors
```typescript
// ❌ Error: 'Spinner' is not exported
import { Spinner } from '@ovh-ux/muk';

// ✅ Fix: Use CSS spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
```

### Datagrid Props Errors
```typescript
// ❌ Error: 'totalItems' does not exist
<Datagrid totalItems={data.totalCount} />

// ✅ Fix: Use correct prop name
<Datagrid totalCount={data.totalCount} />
```

### Tracking Errors
```typescript
// ❌ Error: Type '"action"' has no properties in common with type 'TrackingClickParams'
trackClick('action');

// ✅ Fix: Use object with actions array
trackClick({ actions: ['action'] });
```

### Button Variant Errors
```typescript
// ❌ Error: Type '"primary"' is not assignable to type '"default" | "ghost" | "outline"'
<Button variant="primary">Click</Button>

// ✅ Fix: Use available variant
<Button variant="default">Click</Button>
```

### Navigation Errors
```typescript
// ❌ Error: Absolute paths don't work in nested routes
navigate('/bmc-nasha/listing');

// ✅ Fix: Use relative navigation
navigate('listing', { replace: true });
```
