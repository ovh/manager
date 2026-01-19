---
title: "Prompt 2: Implement Features"
prompt_id: "02-implement-features"
phase: "automated-migration"
sequence: 2
tags: [prompt, implementation, features, automation]
ai: true
---

# Prompt 2: Implement Features

## 🎯 Objective

Implement all detected features from the analysis report, converting AngularJS code to React with 100% functional parity using MUK components.

**Now you MUST implement complete, working code.**

## 📋 Context

This is the **second prompt** in the automated 2-prompt migration workflow. The structure is ready from Prompt 1. Now implement all features based on the analysis and checklist.

## ✅ Prerequisites

- [ ] Prompt 1 completed successfully
- [ ] `analysis-report.md` exists and reviewed
- [ ] `DETECTED_FEATURES.md` exists
- [ ] Project structure created with TODO comments
- [ ] Access to AngularJS source code
- [ ] Access to `.ai-doc/` documentation

## 📥 Required Inputs

| Input | Description | Location |
|-------|-------------|----------|
| `analysis-report.md` | Analysis from Prompt 1 | `{TARGET_PATH}/` |
| `DETECTED_FEATURES.md` | Feature checklist | `{TARGET_PATH}/` |
| AngularJS source | Original implementation | `{SOURCE_PATH}/` |
| Project structure | Empty files with TODOs | `{TARGET_PATH}/src/` |

## 🔧 Actions to Execute

### Step 1: Implement App Configuration

**File**: `src/App.constants.ts`

```typescript
// Reference analysis-report.md for module details
// Follow template: @.ai-doc/50-migration-angular/code-templates.md#app-constants

import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'bmc-{module-name}';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: '{module-key}',
    },
  },
  rootLabel: appName,
} as const;

// Add ONBOARDING_CONFIG, APP_FEATURES, etc.
// Copy values from AngularJS constants
```

**Reference**: [Code Templates - App.constants.ts](../code-templates.md#template-appconstantsts)

### Step 2: Implement Routes

**File**: `src/routes/Routes.tsx`

For each route in `analysis-report.md`:

1. **Map AngularJS state to React Route**
   - `nasha` (/) → `<Route index Component={RootPage} />`
   - `nasha.onboarding` → `<Route path="onboarding" Component={OnboardingPage} />`
   - `nasha.directory` → `<Route path="listing" Component={ListingPage} />`
   - `nasha.dashboard` → `<Route path=":serviceName/*" Component={DashboardPage} />`

2. **Handle redirectTo logic**
   - If AngularJS has `redirectTo`, create RootPage with useNavigate + useEffect

3. **Map nested routes**
   - `nasha.dashboard.partitions` → Nested `<Route path="partitions">`

```typescript
// Follow template: @.ai-doc/50-migration-angular/code-templates.md#routes-tsx
// Reference mappings: @.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md#routing-mappings

import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/debug/ErrorBoundary.component';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
// ... lazy load all pages

export default (
  <>
    <Route path={urls.root} Component={MainLayoutPage} errorElement={<ErrorBoundary />}>
      {/* Map all routes from analysis-report.md */}
    </Route>
  </>
);
```

**Reference**:
- [AngularJS React Mapping - Routing](../angularjs-react-mapping-guide.md#routing-mappings)
- [Code Templates - Routes](../code-templates.md#template-routestsx)

### Step 3: Implement API Hooks

For each API endpoint in `analysis-report.md`, create a custom hook:

**Pattern 1: AAPI Endpoint**

```typescript
// src/data/api/hooks/use{Module}Detail.ts
// AngularJS: OvhApiDedicatedNasha.Aapi().get({ serviceName })
// React: useQuery with aapi.get()

import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePrepare{Module} } from '@/utils/{module}.utils';

export function use{Module}Detail(serviceName: string) {
  const prepare{Module} = usePrepare{Module}();

  return useQuery({
    queryKey: ['{module}-detail', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`${BASE_API_URL}/${serviceName}`);
      return prepare{Module}(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

**Pattern 2: Iceberg Endpoint**

```typescript
// AngularJS: iceberg().query().expand('CachedObjectList-Pages')
// React: fetchIcebergV6

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export function use{Module}List(params) {
  return useQuery({
    queryKey: ['{module}-list', params],
    queryFn: async () => {
      const result = await fetchIcebergV6({
        route: BASE_API_URL,
        page: params.page || 1,
        pageSize: params.pageSize || 50,
      });
      return result.data;
    },
  });
}
```

**Pattern 3: Mutations**

```typescript
// For PUT/POST/DELETE operations
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export function useUpdate{Module}(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const result = await v6.put(`${BASE_API_URL}/${serviceName}`, data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{module}-detail', serviceName] });
    },
  });
}
```

**Reference**:
- [AngularJS React Mapping - API](../angularjs-react-mapping-guide.md#api-mappings)
- [Code Templates - Hooks](../code-templates.md#template-useservicedetailts-aapi-hook)
- [Manager Core API](@.ai-doc/20-dependencies/manager-core-api.md)
- [React Query](@.ai-doc/20-dependencies/tanstack-react-query.md)

### Step 4: Implement Pages

For each page in `DETECTED_FEATURES.md`:

**Pattern 1: Listing Page (if managerListLayout detected)**

```typescript
// src/pages/listing/Listing.page.tsx
// AngularJS: component: 'managerListLayout'
// React: <BaseLayout> + <Datagrid> (MUK)

import { BaseLayout, Datagrid, Button } from '@ovh-ux/muk';
import { use{Module}Services } from '@/data/api/hooks/use{Module}Services';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { data, isLoading } = use{Module}Services({ limit: 10 });

  const columns = [
    {
      id: 'serviceName',
      header: t('{module}_directory_columns_header_serviceName'),
      cell: ({ row }) => (
        <Link to={`../${row.original.serviceName}`}>
          {row.original.serviceName}
        </Link>
      ),
    },
    // Add all columns from AngularJS columnConfig
  ];

  return (
    <BaseLayout
      header={{
        title: t('{module}_listing_title'),
        // Add changelog, guides if detected
      }}
    >
      {/* Add topbar CTA if detected */}
      <Datagrid
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        // Add search, filter, pagination if detected
      />
    </BaseLayout>
  );
}
```

**Pattern 2: Dashboard Page**

```typescript
// src/pages/dashboard/Dashboard.page.tsx
import { useParams, Outlet } from 'react-router-dom';
import { Tile, Button } from '@ovh-ux/muk';
import { use{Module}Detail } from '@/data/api/hooks/use{Module}Detail';

export default function DashboardPage() {
  const { serviceName } = useParams();
  const { data, isLoading } = use{Module}Detail(serviceName);

  if (isLoading) return <Loader />;
  if (!data) return <Message>Not found</Message>;

  return (
    <{Module}Header title={data.name} subtitle={serviceName}>
      {/* Implement tiles, tabs based on AngularJS template */}
      <Tile.Root title="Information">
        {/* Copy structure from AngularJS template */}
      </Tile.Root>
      <Outlet />
    </{Module}Header>
  );
}
```

**Pattern 3: Onboarding Page**

```typescript
// src/pages/onboarding/Onboarding.page.tsx
import { OnboardingLayout, LinkCard } from '@ovh-ux/muk';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');

  return (
    <OnboardingLayout
      title={ONBOARDING_CONFIG.productName}
      description={t('{module}_onboarding_content')}
      onOrderButtonClick={handleOrderClick}
    >
      {/* Add tiles from ONBOARDING_CONFIG */}
    </OnboardingLayout>
  );
}
```

**Reference**:
- [Code Templates - Pages](../code-templates.md#template-listingpagetsx)
- [AngularJS React Mapping - Templates](../angularjs-react-mapping-guide.md#template-mappings)
- [MUK Components](@.ai-doc/20-dependencies/muk.md)

### Step 5: Implement UI Components (MUK-first)

For each OUI component detected, use MUK equivalent:

```typescript
// Mappings from analysis-report.md:
// <oui-datagrid> → <Datagrid> from @ovh-ux/muk
// <oui-tile> → <Tile.Root> from @ovh-ux/muk
// <oui-button> → <Button> from @ovh-ux/muk
// <oui-modal> → <Modal> from @ovh-ux/muk
// managerListLayout → <BaseLayout> + <Datagrid>

// Reference: @.ai-doc/50-migration-angular/migration-patterns.md#template-component-mapping
```

**Reference**:
- [Migration Patterns - Component Mapping](../migration-patterns.md#template-component-mapping)
- [MUK Components](@.ai-doc/20-dependencies/muk.md)

### Step 6: Implement Translations

```typescript
// Copy all keys from AngularJS Messages_*.json
// Maintain exact text values (parity policy)
// Rationalize key names if needed (document in MIGRATION_NOTES.md)

// src/translations/en.json
{
  "{module}": {
    "listing": {
      "title": "Service name", // Exact value from AngularJS
      "columns": {
        "serviceName": "Service name" // Rationalized key structure
      }
    }
  }
}
```

**Reference**: [Migration Guide - i18n Policy](../README.md#i18n-translations-policy)

### Step 7: Implement Utility Functions

```typescript
// src/utils/{module}.utils.ts
// Copy prepareNasha, preparePartition functions from AngularJS
// Convert to hooks that use useTranslation

import { useTranslation } from 'react-i18next';

export const prepare{Module} = (data, t) => {
  // Copy logic from AngularJS prepareNasha
  return {
    ...data,
    localeDatacenter: t(`{module}_datacenter_${data.datacenter.toLowerCase()}`),
  };
};

export const usePrepare{Module} = () => {
  const { t } = useTranslation();
  return (data) => prepare{Module}(data, t);
};
```

**Reference**: [AngularJS React Mapping - Utility Functions](../angularjs-react-mapping-guide.md#utility-functions-hooks)

### Step 8: Implement Error Handling

```typescript
// src/components/debug/ErrorBoundary.component.tsx
import { Error } from '@ovh-ux/muk';
import { useRouteError } from 'react-router-dom';
import { mapUnknownErrorToBannerError } from '@/utils/error.utils';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const errorBannerError = mapUnknownErrorToBannerError(error);

  return (
    <Error
      onReloadPage={() => navigation.reload()}
      onRedirectHome={() => navigation.navigateTo('', '', {})}
      error={errorBannerError}
    />
  );
};
```

**Reference**: [Code Templates - ErrorBoundary](../code-templates.md#template-errorboundarycomponenttsx)

### Step 9: Implement Tracking

```typescript
// Add tracking to all user actions
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

const { trackClick } = useOvhTracking();

// On button click
const handleClick = () => {
  trackClick({ actions: ['listing::add'] });
  // ... action
};

// Map all atInternet.trackClick from AngularJS
```

**Reference**: [Manager React Shell Client](@.ai-doc/20-dependencies/manager-react-shell-client.md)

### Step 10: Copy Assets

```bash
# Copy all images from analysis-report.md
cp {SOURCE_PATH}/src/assets/images/* {TARGET_PATH}/src/assets/images/

# Update import paths in code
# Document path mapping in MIGRATION_NOTES.md
```

**Reference**: [Migration Guide - Assets Policy](../README.md#assets-images-policy)

### Step 11: Create MIGRATION_NOTES.md

```markdown
# Migration Notes

**Module**: {MODULE_NAME}
**Source**: {SOURCE_PATH}
**Target**: {TARGET_PATH}
**Migrated**: {DATE}

## Route Mapping

| AngularJS State | React Route | Status |
|-----------------|-------------|--------|
| nasha | / | ✅ Migrated |
| nasha.directory | /listing | ✅ Migrated |
| ... | ... | ... |

## API Mapping

| AngularJS | React Hook | Status |
|-----------|------------|--------|
| OvhApiDedicatedNasha.Aapi().get() | useNashaDetail | ✅ Migrated |
| ... | ... | ... |

## Translation Key Changes

| Legacy Key | New Key | Reason |
|------------|---------|--------|
| nasha_listing_serviceName | nasha.listing.columns.serviceName | Namespace rationalization |
| ... | ... | ... |

## Asset Path Changes

| Legacy Path | New Path |
|-------------|----------|
| assets/images/nasha-icon.png | src/assets/images/nasha-icon.png |
| ... | ... |

## Known Limitations / TODOs

- [ ] Feature X not yet in MUK (ticket #123)
- [ ] Edge case Y needs testing
```

## 📤 Expected Outputs

At the end of this prompt, you must have:

| Output | Description | Status |
|--------|-------------|--------|
| Complete implementation | All files have working code (no TODOs) | ✅ Required |
| MIGRATION_NOTES.md | Complete mapping documentation | ✅ Required |
| All hooks implemented | One hook per API endpoint | ✅ Required |
| All pages implemented | One page per route | ✅ Required |
| All translations migrated | All keys with exact values | ✅ Required |
| All assets copied | All used images | ✅ Required |
| Error handling | ErrorBoundary + utils | ✅ Required |
| Tracking | All user actions tracked | ✅ Required |

## ✅ Validation Checklist

Before proceeding to Prompt 3 (validation), verify:

- [ ] All files in `DETECTED_FEATURES.md` are checked ✅
- [ ] No TODO comments remain (except documented limitations)
- [ ] All imports are correct and no errors
- [ ] All types are defined properly
- [ ] Code compiles without errors (`npm run build`)
- [ ] All AngularJS routes have React equivalents
- [ ] All AngularJS API calls have React hooks
- [ ] All OUI components replaced with MUK
- [ ] All translations copied with exact values
- [ ] `MIGRATION_NOTES.md` is complete
- [ ] Manual test: app runs and navigates correctly

## 📚 References

**Primary Docs:**
- [AngularJS React Mapping Guide](../angularjs-react-mapping-guide.md) - All mappings
- [Code Templates](../code-templates.md) - All templates
- [Migration Patterns](../migration-patterns.md) - All patterns

**Dependencies:**
- [MUK Components](@.ai-doc/20-dependencies/muk.md)
- [React Router](@.ai-doc/20-dependencies/react-router-dom.md)
- [React Query](@.ai-doc/20-dependencies/tanstack-react-query.md)
- [Manager Core API](@.ai-doc/20-dependencies/manager-core-api.md)
- [React i18next](@.ai-doc/20-dependencies/react-i18next.md)
- [React Hook Form](@.ai-doc/20-dependencies/react-hook-form.md)
- [Manager React Shell Client](@.ai-doc/20-dependencies/manager-react-shell-client.md)

## ➡️ Next Steps

After completing this prompt successfully:

1. Run `npm run build` to verify no errors
2. Test app manually (navigate, check API calls)
3. Proceed to **[Prompt 3: Validate Migration](./03-validate-migration.prompt.md)**

---

## 📋 Copy-Paste Template

```
Implement all features from analysis:

INPUT:
- @{TARGET_PATH}/analysis-report.md
- @{TARGET_PATH}/DETECTED_FEATURES.md
- @{SOURCE_PATH} (AngularJS source)

REFERENCE: @.ai-doc/50-migration-angular/

ACTIONS:
1. Implement all routes from analysis-report.md
2. Implement all API hooks (one per endpoint)
3. Implement all pages (use MUK components only)
4. Migrate all translations (exact values)
5. Copy all assets
6. Add error handling
7. Add tracking
8. Create MIGRATION_NOTES.md

OUTPUT:
- Complete working implementation
- No TODO comments (except documented limitations)
- MIGRATION_NOTES.md with all mappings

VALIDATE:
- npm run build (no errors)
- Manual test (app runs correctly)
```
