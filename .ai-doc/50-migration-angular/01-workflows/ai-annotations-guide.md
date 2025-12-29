---
title: AI Annotations Guide
last_update: 2025-01-27
tags: [ai, annotations, templates, guidelines]
ai: true
---

# AI Annotations Guide

## 🧭 Purpose

This document explains the **@ai-*** annotation system used throughout the migration documentation. These annotations help AI assistants understand how to use templates and perform transformations.

## 📘 Annotation Types

### @ai-template

**Purpose**: Identifies a code template
**Location**: First line of code block
**Syntax**: `// @ai-template: <template-id>`

```typescript
// @ai-template: aapi-hook
// This is a template for creating AAPI hooks
```

**Usage**:
- Helps AI identify which template to use
- Links to template catalog
- Enables template selection logic

---

### @ai-source

**Purpose**: Documents the real source code this template is based on
**Location**: After @ai-template
**Syntax**: `// @ai-source: <description>`

```typescript
// @ai-source: Based on bmc-nasha/src/data/api/hooks/useNashaDetail.ts
```

**Usage**:
- Provides traceability
- Enables AI to reference real examples
- Helps with verification

---

### @ai-inputs

**Purpose**: Defines required input parameters for the template
**Location**: After @ai-source
**Syntax**: `// @ai-inputs: { <param>: <type>, ... }`

```typescript
// @ai-inputs: {
//   moduleName: string,    // e.g., "nasha"
//   endpoint: string       // e.g., "/dedicated/nasha"
// }
```

**Usage**:
- AI knows what data it needs to collect
- Enables validation of inputs
- Documents expected values with examples

---

### @ai-transforms

**Purpose**: Specifies string transformations to apply
**Location**: After @ai-inputs
**Syntax**: `// @ai-transforms: <rules>`

```typescript
// @ai-transforms:
//   - moduleName -> kebab-case for appName (bmc-{module-name})
//   - moduleName -> PascalCase for components
//   - moduleName -> UPPERCASE for constants
```

**Transformation Types**:
- `kebab-case`: `nasha` → `bmc-nasha`
- `PascalCase`: `nasha` → `Nasha`
- `camelCase`: `nasha-module` → `nashaModule`
- `UPPERCASE`: `nasha` → `NASHA`
- `TitleCase`: `nasha` → `Nasha`

**Usage**:
- AI applies correct case transformations
- Prevents naming inconsistencies
- Documents naming conventions

---

### @ai-pattern

**Purpose**: Describes the AngularJS → React pattern being applied
**Location**: After @ai-transforms
**Syntax**: `// @ai-pattern: <description>`

```typescript
// @ai-pattern: AngularJS AAPI call → React useQuery hook
```

**Usage**:
- Links template to migration pattern
- Helps AI understand the mapping
- Documents the conversion logic

---

### @ai-angularjs-equivalent

**Purpose**: Shows the equivalent AngularJS code
**Location**: After @ai-pattern
**Syntax**: `// @ai-angularjs-equivalent: <code>`

```typescript
// @ai-angularjs-equivalent:
//   resolve: {
//     nasha: /* @ngInject */ (OvhApiDedicatedNasha, serviceName) => {
//       const aapi = OvhApiDedicatedNasha.Aapi();
//       return aapi.get({ serviceName }).$promise;
//     }
//   }
```

**Usage**:
- AI can compare AngularJS to React
- Helps verify correct conversion
- Documents original implementation

---

### @ai-reference

**Purpose**: Links to detailed documentation
**Location**: After @ai-angularjs-equivalent
**Syntax**: `// @ai-reference: <path>`

```typescript
// @ai-reference: @.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md#aapi-mappings
```

**Usage**:
- AI can find more details if needed
- Links template to comprehensive guide
- Enables deep-dive learning

---

### @ai-replace

**Purpose**: Marks code that must be replaced with actual values
**Location**: Inline above code to replace
**Syntax**: `// @ai-replace: <instruction>`

```typescript
// @ai-replace: Extract from AngularJS module name
export const appName = 'bmc-{module-name}';

// @ai-replace: Use same module name as serviceKey
serviceKey: '{module-key}',

// @ai-replace: Rename to use{ModuleName}Detail (PascalCase)
export function useServiceDetail(serviceName: string) {
```

**Usage**:
- AI knows what to customize
- Provides guidance on replacement
- Ensures no placeholders remain

---

### @ai-preserve

**Purpose**: Marks logic that must be kept from AngularJS
**Location**: Inline above code to preserve
**Syntax**: `// @ai-preserve: <reason>`

```typescript
// @ai-preserve: Keep data preparation pattern from AngularJS
const prepareService = usePrepareService();

// @ai-preserve: Apply same data transformation as AngularJS
return prepareService(data) as ServicePrepared;
```

**Usage**:
- AI knows not to change this logic
- Ensures parity is maintained
- Documents why code structure is preserved

---

### @ai-note

**Purpose**: Adds important notes or warnings
**Location**: Inline before relevant code
**Syntax**: `// @ai-note: <message>`

```typescript
// @ai-note: Use AAPI endpoint (same as AngularJS OvhApi*.Aapi())
const { data } = await aapi.get<ServiceApiData>(`${BASE_API_URL}/${serviceName}`);

// @ai-note: This component must use MUK only (no ODS)
import { Datagrid } from '@ovh-ux/muk';
```

**Usage**:
- AI gets important contextual info
- Highlights critical decisions
- Documents constraints

---

### @ai-no-*

**Purpose**: Marks what NOT to do
**Location**: Inline where temptation might exist
**Syntax**: `// @ai-no-<action>: <reason>`

```typescript
// @ai-no-reset-cache: React Query handles caching automatically
const { data } = await aapi.get(...);

// @ai-no-ods: MUK-first policy, use MUK components only
import { Datagrid } from '@ovh-ux/muk';

// @ai-no-todo: Complete implementation, no TODOs allowed
```

**Common Variants**:
- `@ai-no-reset-cache`
- `@ai-no-ods`
- `@ai-no-todo`
- `@ai-no-placeholder`
- `@ai-no-change`

**Usage**:
- AI avoids common mistakes
- Enforces migration policies
- Documents anti-patterns

---

### @ai-component

**Purpose**: Specifies component requirements
**Location**: Before component usage
**Syntax**: `// @ai-component: <requirement>`

```typescript
// @ai-component: use MUK components only
return (
  <BaseLayout>
    <Datagrid />
  </BaseLayout>
);
```

**Usage**:
- AI selects correct UI library
- Enforces MUK-first policy
- Documents UI requirements

---

### @ai-required

**Purpose**: Marks required files/actions
**Location**: In checklists or file lists
**Syntax**: `// @ai-required: <description>`

```typescript
// @ai-required: This hook must be implemented
export function useNashaDetail(serviceName: string) { ... }

// @ai-required: All translations must have exact values
const translations = { ... };
```

**Usage**:
- AI knows what cannot be skipped
- Helps prioritize work
- Ensures completeness

---

### @ai-optional

**Purpose**: Marks optional enhancements
**Location**: Before optional code
**Syntax**: `// @ai-optional: <description>`

```typescript
// @ai-optional: Add if user wants advanced filtering
const advancedFilters = { ... };

// @ai-optional: Performance optimization (not required for parity)
const memoizedValue = useMemo(() => ..., [deps]);
```

**Usage**:
- AI knows what can be deferred
- Helps with MVP vs full implementation
- Documents nice-to-haves

---

## 🎯 Annotation Patterns

### Pattern 1: Template Header (Complete)

```typescript
// @ai-template: template-id
// @ai-source: Based on actual/file/path.ts
// @ai-inputs: {
//   param1: type,
//   param2: type
// }
// @ai-transforms:
//   - param1 -> transformation
//   - param2 -> transformation
// @ai-pattern: AngularJS X → React Y
// @ai-angularjs-equivalent:
//   /* AngularJS code */
// @ai-reference: @.ai-doc/path/to/guide.md#section

import { ... } from '...';
```

### Pattern 2: Inline Replacement

```typescript
// @ai-replace: Instruction on what to replace
const value = '{placeholder}';
```

### Pattern 3: Preservation with Context

```typescript
// @ai-preserve: Reason why this must stay the same
const originalLogic = complexFunction();
```

### Pattern 4: Policy Enforcement

```typescript
// @ai-no-ods: MUK-first policy
// @ai-component: use MUK components only
import { Component } from '@ovh-ux/muk';
```

### Pattern 5: Conditional Logic

```typescript
// @ai-conditional: Only if managerListLayout detected in AngularJS
if (hasManagerListLayout) {
  // @ai-required: Must use BaseLayout + Datagrid
  return <BaseLayout><Datagrid /></BaseLayout>;
}
```

---

## 🤖 AI Usage Guidelines

### Reading Annotations

1. **Start with template header** - Understand what template this is
2. **Check inputs** - Ensure you have all required data
3. **Apply transforms** - Follow transformation rules exactly
4. **Read pattern** - Understand the AngularJS → React mapping
5. **Check reference** - Consult detailed docs if unclear

### Applying Annotations

1. **@ai-replace**: Must be replaced with actual values (no placeholders in output)
2. **@ai-preserve**: Must keep logic exactly as specified
3. **@ai-note**: Read carefully, important context
4. **@ai-no-***: Strictly follow the prohibition
5. **@ai-component**: Use specified component library

### Validation

Before completing:
- [ ] All `@ai-replace` placeholders replaced
- [ ] All `@ai-preserve` logic kept intact
- [ ] All `@ai-no-*` rules followed
- [ ] All `@ai-required` items completed
- [ ] All `@ai-component` requirements met

---

## 📋 Annotation Checklist

### For Template Authors (Humans)

When creating a new template:
- [ ] Add `@ai-template` with unique ID
- [ ] Add `@ai-source` pointing to real code
- [ ] Document all `@ai-inputs` with examples
- [ ] Specify `@ai-transforms` for naming
- [ ] Add `@ai-reference` to detailed docs
- [ ] Mark all placeholders with `@ai-replace`
- [ ] Mark preserved logic with `@ai-preserve`
- [ ] Add `@ai-note` for important points
- [ ] Add `@ai-no-*` for anti-patterns

### For AI Assistants (AI)

When using a template:
- [ ] Read all header annotations first
- [ ] Collect all required `@ai-inputs`
- [ ] Apply all `@ai-transforms` correctly
- [ ] Replace all `@ai-replace` placeholders
- [ ] Preserve all `@ai-preserve` logic
- [ ] Follow all `@ai-no-*` rules
- [ ] Respect all `@ai-component` requirements
- [ ] Validate against `@ai-required` checklist

---

## 📚 Examples

### Example 1: Simple Template

```typescript
// @ai-template: simple-hook
// @ai-source: Based on bmc-nasha/src/hooks/useExample.ts
// @ai-inputs: { hookName: string }
// @ai-transforms:
//   - hookName -> camelCase for function name

// @ai-replace: Use camelCase hook name
export function use{HookName}() {
  // @ai-preserve: Keep this pattern
  const [state, setState] = useState();
  return { state, setState };
}
```

### Example 2: Complex Template with Policy

```typescript
// @ai-template: listing-page
// @ai-source: Based on bmc-nasha/src/pages/listing/Listing.page.tsx
// @ai-inputs: {
//   moduleName: string,
//   hasSearch: boolean,
//   hasFilter: boolean
// }
// @ai-transforms:
//   - moduleName -> kebab-case for translations
//   - moduleName -> PascalCase for component name
// @ai-pattern: managerListLayout → BaseLayout + Datagrid
// @ai-reference: @.ai-doc/50-migration-angular/code-templates.md#listing-page

// @ai-no-ods: MUK-first policy, use MUK only
import { BaseLayout, Datagrid, Button } from '@ovh-ux/muk';

// @ai-replace: Use PascalCase module name
export default function {Module}ListingPage() {
  // @ai-conditional: Only if hasSearch is true
  const [searchInput, setSearchInput] = useState('');

  return (
    <BaseLayout
      // @ai-replace: Use kebab-case for translation key
      header={{ title: t('{module}_listing_title') }}
    >
      {/* @ai-component: use MUK Datagrid */}
      <Datagrid
        // @ai-required: Must implement all detected features
        // @ai-conditional: Only add search if hasSearch is true
        search={hasSearch ? { searchInput, setSearchInput } : undefined}
      />
    </BaseLayout>
  );
}
```

---

## ⚖️ The Annotations' Moral

- **Clear annotations** reduce ambiguity for AI
- **Structured format** enables automation
- **Explicit instructions** prevent errors
- **Policy enforcement** ensures compliance

**👉 Good annotations make AI execution predictable and reliable.**
