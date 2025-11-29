---
title: Automated Migration Guide
last_update: 2025-01-27
tags: [migration, automation, angularjs, react, guide]
ai: true
---

# Automated Migration Guide

## 🧭 Purpose

This guide enables **automated migration in 2 prompts** by providing step-by-step instructions that an AI can follow to migrate an AngularJS module to React with minimal manual intervention.

## ⚙️ Context

**Core Principle**: **Prompt-ready instructions** - each step is designed to be executed by an AI following the documentation.

## 🔗 References

- [Pre-Migration Analysis](../90-quickstart/pre-migration-analysis.md) - **Source code analysis**
- [AngularJS → React Mapping Guide](./angularjs-react-mapping-guide.md) - **Concrete mappings**
- [Code Templates](./code-templates.md) - **Ready-to-use templates**
- [Migration Patterns](./migration-patterns.md) - **Pattern detection rules**

## 🚀 Migration Workflow (2 Prompts)

### Prompt Template

```
Migre @{source-module} vers @{target-module} en suivant @.ai-doc

Source: packages/manager/modules/{module-name}
Target: packages/manager/apps/{target-app-name}
```

### Phase 1: Analysis & Structure Generation (Prompt 1)

#### Step 1: Analyze AngularJS Source Code

**Action**: Read and analyze all routing files, controllers, templates, and services.

**Detection Patterns**:

```typescript
// 1. Find routing files
const routingFiles = glob('**/*.routing.js', { cwd: sourceModule });

// 2. Extract state definitions
const states = extractStates(routingFiles);
// Pattern: $stateProvider.state('name', { url, component, resolve, ... })

// 3. Extract resolve functions
const resolves = extractResolves(routingFiles);
// Pattern: resolve: { name: /* @ngInject */ (...) => ... }

// 4. Find templates
const templates = glob('**/*.template.html', { cwd: sourceModule });

// 5. Detect OUI components
const ouiComponents = detectOUIComponents(templates);
// Patterns: <oui-datagrid>, <oui-tile>, <oui-button>, etc.

// 6. Find API endpoints
const apiEndpoints = extractAPIEndpoints(routingFiles, controllers);
// Patterns: OvhApi*, iceberg(), $http.get/post/put/delete
```

**Output**: Generate analysis report with:
- List of all routes/states
- List of all resolve functions
- List of all OUI components used
- List of all API endpoints
- List of all translation keys
- Feature checklist (search, filter, pagination, etc.)

#### Step 2: Generate Project Structure

**Action**: Create React project structure based on detected routes.

**Structure Template**:

```
src/
├── App.tsx
├── App.constants.ts
├── QueryClient.ts
├── routes/
│   ├── Routes.tsx
│   ├── Routes.constants.ts
│   └── Routes.utils.ts
├── pages/
│   ├── Main.layout.tsx
│   ├── root/
│   │   └── Root.page.tsx
│   ├── listing/
│   │   └── Listing.page.tsx
│   ├── dashboard/
│   │   └── Dashboard.page.tsx
│   └── onboarding/
│       └── Onboarding.page.tsx
├── data/
│   └── api/
│       ├── hooks/
│       │   ├── use{Noun}Detail.ts
│       │   ├── use{Noun}s.ts
│       │   └── utils/
│       │       └── queryKeys.ts
│       └── commons/
│           └── Client.api.ts
├── components/
│   └── debug/
│       └── ErrorBoundary.component.tsx
├── hooks/
│   ├── useHidePreloader.ts
│   └── useShellRoutingSync.ts
├── utils/
│   ├── error.utils.ts
│   └── {module}.utils.ts
└── types/
    ├── {Module}.type.ts
    └── {Module}.api.type.ts
```

#### Step 3: Generate Routes Configuration

**Action**: Convert AngularJS states to React Router routes.

**Mapping Rules**:

```typescript
// AngularJS state
$stateProvider.state('module.submodule', {
  url: '/:param',
  component: 'componentName',
  resolve: { /* ... */ }
});

// React route
<Route
  path=":param"
  Component={ComponentName}
  handle={{ tracking: { pageName: 'submodule' } }}
>
  {/* Nested routes */}
</Route>
```

**Generate**:
- `Routes.tsx` with all routes
- `Routes.constants.ts` with URL constants
- `Routes.utils.ts` with routing utilities

#### Step 4: Generate API Hooks

**Action**: Convert resolve functions to React Query hooks.

**Mapping Rules**:

```typescript
// AngularJS resolve
resolve: {
  data: /* @ngInject */ (Service, param) => 
    Service.get({ param }).$promise
}

// React hook
export function useData(param: string) {
  return useQuery({
    queryKey: ['data', param],
    queryFn: async () => {
      const { data } = await api.get(`/endpoint/${param}`);
      return data;
    },
  });
}
```

**Generate**:
- One hook file per resolve function
- Query keys factory in `utils/queryKeys.ts`
- API client utilities in `commons/Client.api.ts`

#### Step 5: Generate Page Components (Skeleton)

**Action**: Create page components with basic structure.

**Template**:

```typescript
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseLayout } from '@ovh-ux/muk';
import { useData } from '@/data/api/hooks/useData';

export default function PageName() {
  const { param } = useParams<{ param: string }>();
  const { t } = useTranslation('namespace');
  const { data, isLoading } = useData(param || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout header={{ title: t('page_title') }}>
      {/* Content will be added in Phase 2 */}
    </BaseLayout>
  );
}
```

**Generate**: Skeleton for all pages identified in analysis.

### Phase 2: Feature Implementation & Validation (Prompt 2)

#### Step 1: Implement Listing Page (if managerListLayout detected)

**Action**: Convert `managerListLayout` to `BaseLayout` + `Datagrid`.

**Mapping Rules**:

```typescript
// AngularJS: columnConfig
columnConfig: {
  data: [
    {
      label: $translate.instant('key'),
      property: 'field',
      serviceLink: true,
      hidden: false,
      format: (row) => formatValue(row.field),
    }
  ]
}

// React: columns
const columns: DatagridColumn<Type>[] = [
  {
    id: 'field',
    accessorKey: 'field',
    header: t('key'),
    cell: ({ row }) => (
      <Link to={`../${row.original.id}`}>
        {formatValue(row.original.field)}
      </Link>
    ),
    enableHiding: false,
    isSortable: true,
  }
];
```

**Implement**:
- Column definitions
- Search functionality
- Filter functionality
- Pagination
- Column visibility
- Topbar actions (CTA, guides, changelog)

#### Step 2: Implement Dashboard Pages

**Action**: Convert dashboard templates to React components.

**Mapping Rules**:

```typescript
// AngularJS template
<oui-tile>
  <oui-tile-definition 
    term="Label" 
    description="{{ $ctrl.value }}"
  />
</oui-tile>

// React JSX
<Tile.Root title="Section">
  <Tile.Item.Root>
    <Tile.Item.Term label="Label" />
    <Tile.Item.Description>{value}</Tile.Item.Description>
  </Tile.Item.Root>
</Tile.Root>
```

**Implement**:
- Information tiles
- Action buttons
- Navigation tabs
- Metrics/components

#### Step 3: Implement Forms & Modals

**Action**: Convert form components to React Hook Form.

**Mapping Rules**:

```typescript
// AngularJS form
<form ng-submit="$ctrl.submit()">
  <oui-field>
    <oui-input 
      ng-model="$ctrl.form.name" 
      required
    />
  </oui-field>
</form>

// React form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <FormField>
    <Input {...register('name', { required: true })} />
  </FormField>
</form>
```

**Implement**:
- Form schemas with Zod
- Form components
- Validation logic
- Submit handlers with mutations

#### Step 4: Implement Mutations

**Action**: Convert update/delete/create operations to React Query mutations.

**Mapping Rules**:

```typescript
// AngularJS update
this.$http.put(url, data)
  .then(() => this.alertSuccess('Success'))
  .catch((error) => this.alertError(error));

// React mutation
export function useUpdateData(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: result } = await v6.put(`/endpoint/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', id] });
      // Show success notification
    },
    onError: (error) => {
      // Show error notification
    },
  });
}
```

**Implement**:
- Create mutations
- Update mutations
- Delete mutations
- Cache invalidation logic

#### Step 5: Implement Error Handling

**Action**: Set up ErrorBoundary and error utilities.

**Generate**:
- `ErrorBoundary.component.tsx`
- `error.utils.ts`
- Error handling in routes

#### Step 6: Implement Configuration

**Action**: Create `App.constants.ts` with `APP_FEATURES`.

**Template**:

```typescript
export const APP_FEATURES = {
  listingApi: 'v6Iceberg' as ListingApi,
  dashboardApi: 'v6' as DashboardApi,
  listingEndpoint: '/dedicated/{module}',
  dashboardEndpoint: '/dedicated/{module}/{serviceName}',
  isPci: false,
  routeFlavor: 'generic' as const,
  basePrefix: '',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: '',
  tracking: {
    level2ByRegion: {
      EU: { level2: 'XX' },
      CA: { level2: 'XX' },
      US: { level2: 'XX' },
    } as const,
    universe: 'Dedicated' as const,
    subUniverse: 'Dedicated' as const,
    appNameForTracking: appName,
  },
} as const;
```

#### Step 7: Validation Checklist

**Action**: Verify all features are implemented.

**Checklist**:

```markdown
## Functional Parity
- [ ] All routes accessible and working
- [ ] All data fetching working (hooks return correct data)
- [ ] All mutations working (create, update, delete)
- [ ] All navigation working (links, buttons, redirects)
- [ ] All forms working (validation, submission)
- [ ] All modals working (open, close, actions)

## Visual Parity
- [ ] All pages render correctly
- [ ] All components display correctly
- [ ] All styles match (spacing, colors, typography)
- [ ] All responsive breakpoints work
- [ ] All loading states display
- [ ] All error states display

## Technical Parity
- [ ] All API calls match (endpoints, methods, params)
- [ ] All translations match (keys, values)
- [ ] All tracking calls match (events, parameters)
- [ ] All error handling works
- [ ] All edge cases handled
```

## 📋 Automated Detection Patterns

### Route Detection

```typescript
// Pattern: $stateProvider.state('name', { ... })
const statePattern = /\$stateProvider\.state\(['"]([^'"]+)['"]\s*,\s*\{/g;

// Extract:
// - State name: 'module.submodule'
// - URL pattern: url: '/path/:param'
// - Component: component: 'componentName'
// - Resolves: resolve: { ... }
```

### Resolve Function Detection

```typescript
// Pattern: name: /* @ngInject */ (...) => ...
const resolvePattern = /(\w+):\s*\/\*\s*@ngInject\s*\*\/\s*\(([^)]*)\)\s*=>/g;

// Extract:
// - Resolve name
// - Dependencies (injections)
// - Function body
```

### OUI Component Detection

```typescript
// Patterns in templates
const ouiPatterns = {
  datagrid: /<oui-datagrid[^>]*>/i,
  tile: /<oui-tile[^>]*>/i,
  button: /<oui-button[^>]*>/i,
  modal: /<oui-modal[^>]*>/i,
  header: /<header[^>]*class="oui-header"/i,
  tabs: /<oui-header-tabs[^>]*>/i,
};
```

### API Endpoint Detection

```typescript
// Patterns in controllers/services
const apiPatterns = {
  aapi: /OvhApi\w+\.Aapi\(\)/g,
  iceberg: /iceberg\([^)]+\)/g,
  http: /\$http\.(get|post|put|delete)\(['"]([^'"]+)['"]/g,
};
```

## 🎯 Prompt 1 Output Example

After Prompt 1, the AI should generate:

1. **Analysis Report**: Complete feature list, routes, components, APIs
2. **Project Structure**: All directories and skeleton files
3. **Routes.tsx**: Complete routing structure
4. **API Hooks**: All hooks for data fetching
5. **Page Skeletons**: All pages with basic structure
6. **Configuration**: `App.constants.ts`, `QueryClient.ts`
7. **Error Handling**: `ErrorBoundary`, `error.utils.ts`

## 🎯 Prompt 2 Output Example

After Prompt 2, the AI should complete:

1. **Listing Page**: Full implementation with Datagrid
2. **Dashboard Pages**: All tiles, actions, navigation
3. **Forms**: All create/edit forms with validation
4. **Mutations**: All create/update/delete operations
5. **Components**: All reusable components
6. **Validation**: Complete parity checklist verification

## 🚫 Common Pitfalls to Avoid

### ❌ WRONG: Skipping Analysis

```markdown
# Don't start coding without complete analysis
# Result: Missing features, incomplete implementation
```

### ✅ CORRECT: Complete Analysis First

```markdown
# Always analyze all files before generating code
# Result: Complete feature list, accurate implementation
```

### ❌ WRONG: Manual Route Mapping

```markdown
# Don't manually map each route
# Use detection patterns to automate
```

### ✅ CORRECT: Automated Route Generation

```markdown
# Use patterns to detect and generate routes automatically
# Result: Consistent structure, no missing routes
```

## 🤖 AI Development Guidelines

### Essential Automation Rules

1. **Always analyze first**: Never skip the analysis phase
2. **Use detection patterns**: Automate component/API detection
3. **Generate structure**: Create all files in one pass
4. **Implement systematically**: One feature category at a time
5. **Validate continuously**: Check parity after each major step

### Automation Checklist

- [ ] Analysis complete (routes, components, APIs detected)
- [ ] Project structure generated
- [ ] Routes generated from states
- [ ] Hooks generated from resolves
- [ ] Pages generated from templates
- [ ] Forms generated from templates
- [ ] Mutations generated from controllers
- [ ] Error handling implemented
- [ ] Configuration complete
- [ ] Validation checklist verified

---

## ⚖️ The Automation's Moral

- **Systematic analysis** ensures nothing is missed
- **Pattern-based detection** automates repetitive tasks
- **Structured generation** creates consistent code
- **Validation checklists** ensure completeness

**👉 Good automation is systematic, pattern-based, and validated.**

