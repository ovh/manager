---
title: Code Templates (Based on bmc-nasha)
last_update: 2025-01-27
tags: [migration, templates, code, react, nasha]
ai: true
---

# Code Templates (Based on bmc-nasha)

## 🧭 Purpose

This document provides **ready-to-use code templates** based on the actual implementation in `bmc-nasha`. All templates are production-ready and can be adapted for any AngularJS → React migration.

## ⚙️ Context

**Core Principle**: **Real code only** - all templates are extracted from working code in `packages/manager/apps/bmc-nasha`.

## 🔗 References

- [AngularJS → React Mapping Guide](./angularjs-react-mapping-guide.md) - **Mapping patterns**
- [Automated Migration Guide](./automated-migration-guide.md) - **Usage in automation**

## 📘 Template: App.constants.ts

```typescript
// @ai-template: app-constants
// @ai-source: Based on bmc-nasha/src/App.constants.ts
// @ai-inputs: {
//   moduleName: string,        // e.g., "nasha"
//   productName: string,       // e.g., "NAS-HA"
//   productCategory: string    // e.g., "Storage"
// }
// @ai-transforms:
//   - moduleName -> kebab-case for appName (bmc-{module-name})
//   - moduleName -> kebab-case for endpoints (/dedicated/{module-name})
//   - productName -> TitleCase for display
// @ai-reference: @.ai-doc/50-migration-angular/code-templates.md#app-constants

import type { OnboardingConfigType } from '@/types/Onboarding.type';

// @ai-replace: Extract from AngularJS module name
export const appName = 'bmc-{module-name}';

export const AppConfig = {
  listing: {
    datagrid: {
      // @ai-replace: Use same module name as serviceKey
      serviceKey: '{module-key}',
    },
  },
  rootLabel: appName,
} as const;

const docUrl = 'https://docs.ovh.com';

// @ai-replace: Copy product info from AngularJS constants or ask user
export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: '{Product Name}',
  productCategory: '{Category}',
  brand: 'OVHcloud',
  tiles: [
    { id: 1, key: 'getting-started', linkKey: 'gettingStarted' },
    { id: 2, key: 'guide-2', linkKey: 'guide2' },
    { id: 3, key: 'guide-3', linkKey: 'guide3' },
  ],
  links: {
    // @ai-replace: Update product URL slug
    gettingStarted: 'https://docs.ovh.com/gb/en/{product}/getting-started/',
    guide2: 'https://docs.ovh.com/gb/en/{product}/guide-2/',
    guide3: 'https://docs.ovh.com/gb/en/{product}/guide-3/',
  },
};

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

export const APP_FEATURES = {
  listingApi: 'v6Iceberg' as ListingApi,
  dashboardApi: 'v6' as DashboardApi,
  listingEndpoint: '/dedicated/{module-name}',
  dashboardEndpoint: '/dedicated/{module-name}/{serviceName}',
  isPci: false,
  routeFlavor: 'generic' as const,
  basePrefix: '',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: '', // Leave empty to avoid double slug - shell already provides appName prefix in hash
  tracking: {
    level2ByRegion: {
      EU: { level2: 'XX' }, // Update with correct level2
      CA: { level2: 'XX' },
      US: { level2: 'XX' },
    } as const,
    universe: 'Dedicated' as const,
    subUniverse: 'Dedicated' as const,
    appNameForTracking: appName,
  },
} as const;
```

## 📘 Template: Routes.tsx

```typescript
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@/components/debug/ErrorBoundary.component';
import { urls } from './Routes.constants';

// Lazy load pages for code splitting
const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const RootPage = React.lazy(() => import('@/pages/root/Root.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));

export default (
  <>
    {/* Rooted application layout - React Router in iframe sees relative paths */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={<ErrorBoundary />}
    >
      {/* Smart redirect root - checks for services */}
      <Route
        index
        Component={RootPage}
        handle={{
          tracking: {
            pageName: 'root',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Onboarding route */}
      <Route
        path="onboarding"
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        }}
      />

      {/* Listing route */}
      <Route
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Dashboard route - must be after listing to avoid conflicts */}
      <Route
        path=":serviceName/*"
        Component={DashboardPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.listing,
          },
        }}
      >
        {/* Add nested routes here */}
      </Route>

      {/* Catch-all redirect to listing */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Route>
  </>
);
```

## 📘 Template: Routes.constants.ts

```typescript
import { APP_FEATURES, appName } from '@/App.constants';
import { getRoot } from './Routes.utils';

export const urls = {
  root: getRoot(),
  listing: 'listing',
} as const;

export const redirectionApp = APP_FEATURES.isPci
  ? APP_FEATURES.appSlug
  : '';
```

## 📘 Template: Routes.utils.ts

```typescript
import { APP_FEATURES } from '@/App.constants';

const { basePrefix, appSlug } = APP_FEATURES;

export function getRoot(): string {
  const prefix = basePrefix ? `/${String(basePrefix)}` : '';

  // For generic routes in iframe:
  // - If appSlug is empty, React Router should use "/" as root because the container
  //   already handles the app path prefix (/bmc-{module}) and passes only the relative part
  // - The container loads the iframe with hash="#/{relativePath}" where relativePath
  //   is what comes after /bmc-{module} in the container's URL
  if (!appSlug) {
    // Container handles /bmc-{module}, React Router only sees relative paths
    return '/';
  }

  // If appSlug is provided, use it (for custom routing scenarios)
  return `${prefix}/${appSlug}`;
}
```

## 📘 Template: QueryClient.ts

```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false, // No automatic retry (handled by components)
      refetchOnWindowFocus: false, // Avoid unnecessary refetch
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
```

## 📘 Template: Root.page.tsx (Conditional Redirect)

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServicesCheck } from '@/data/api/hooks/useServices';

export default function RootPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useServicesCheck();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.hasServices) {
        navigate('listing', { replace: true });
      } else {
        navigate('onboarding', { replace: true });
      }
    }
  }, [data, isLoading, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading services</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

## 📘 Template: Onboarding.page.tsx

```typescript
import { OnboardingLayout, LinkCard } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ONBOARDING_CONFIG } from '@/App.constants';
import productIcon from '@/assets/images/{module}-icon.png';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const { trackClick } = useOvhTracking();

  const handleOrderClick = () => {
    trackClick({ actions: ['onboarding::add'] });
    // Navigate to order page (to be implemented)
    window.open('https://www.ovhcloud.com/en/{product-url}/', '_blank');
  };

  const handleGuideClick = (guide: string) => {
    trackClick({ actions: [`onboarding::documentation::${guide}`] });
  };

  return (
    <OnboardingLayout
      title={ONBOARDING_CONFIG.productName}
      description={
        <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('{module}_onboarding_content')}
        </p>
      }
      orderButtonLabel={t('{module}_onboarding_order')}
      onOrderButtonClick={handleOrderClick}
      orderIam={{
        urn: 'urn:v1:eu:product:{module}',
        iamActions: ['product:create'],
        displayTooltip: true,
      }}
      img={{
        src: productIcon,
        alt: '{Product Name} Service',
        className: 'w-32 h-32 object-contain mx-auto',
      }}
    >
      {/* Tutorials Section */}
      {ONBOARDING_CONFIG.tiles.map((tile) => (
        <LinkCard
          key={tile.id}
          href={
            ONBOARDING_CONFIG.links[
              tile.linkKey as keyof typeof ONBOARDING_CONFIG.links
            ]
          }
          externalHref={true}
          texts={{
            title: t(`{module}_onboarding_${tile.key}_title`),
            description: t(`{module}_onboarding_${tile.key}_content`),
            category: 'Tutoriel',
          }}
          onClick={() => handleGuideClick(tile.key)}
        />
      ))}
    </OnboardingLayout>
  );
}
```

## 📘 Template: Listing.page.tsx (BaseLayout + Datagrid)

```typescript
import { useState, useMemo, useCallback } from 'react';
import type { SortingState, VisibilityState } from '@tanstack/react-table';
import {
  BaseLayout,
  Button,
  Datagrid,
  ChangelogMenu,
  GuideMenu,
  useColumnFilters,
} from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';
import type { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useServices } from '@/data/api/hooks/useServices';
import { useUser } from '@/hooks/useUser';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/constants/Changelog.constants';
import { GUIDES_URL } from '@/constants/Guides.constants';
import type { Service } from '@/types/{Module}.type';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const user = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const sortBy = useMemo(() => {
    if (sorting.length === 0 || !sorting[0]) return undefined;
    return sorting[0].id as string;
  }, [sorting]);

  const sortDesc = useMemo(() => {
    if (sorting.length === 0 || !sorting[0]) return false;
    return sorting[0].desc ?? false;
  }, [sorting]);

  const pageSize = 10;

  const { filters: columnFilters, addFilter, removeFilter } = useColumnFilters();

  const apiFilters = useMemo<Filter[] | undefined>(() => {
    if (!columnFilters || columnFilters.length === 0) return undefined;
    return columnFilters.map((filter) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { label, ...filterWithoutLabel } = filter;
      return filterWithoutLabel;
    });
  }, [columnFilters]);

  const handleAddFilter = useCallback(
    (filterProps: { comparator: FilterComparator; key: string; label: string; value: string | string[] }) => {
      addFilter({
        key: filterProps.key,
        label: filterProps.label,
        comparator: filterProps.comparator,
        value: filterProps.value,
      });
    },
    [addFilter],
  );

  const handleRemoveFilter = useCallback(
    (filter: { key: string; comparator: FilterComparator; value?: string | string[] }) => {
      removeFilter({
        key: filter.key,
        comparator: filter.comparator,
        value: filter.value,
      });
    },
    [removeFilter],
  );

  const { data, isLoading, totalCount, hasNextPage, fetchNextPage } = useServices({
    limit: pageSize,
    sortBy,
    sortDesc,
    filters: apiFilters,
  });

  const handleOrderClick = () => {
    trackClick({ actions: ['listing::add'] });
    window.open('https://www.ovhcloud.com/en/{product-url}/', '_blank');
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const guideUrl = useMemo(() => {
    if (!user?.ovhSubsidiary) {
      return GUIDES_URL.DEFAULT;
    }
    return GUIDES_URL[user.ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT;
  }, [user?.ovhSubsidiary]);

  const guideItems = useMemo(
    () => [
      {
        id: 1,
        href: guideUrl,
        target: '_blank',
        label: t('{module}_dashboard_guides_title'),
      },
    ],
    [guideUrl, t],
  );

  const filteredData = useMemo(() => {
    if (!searchInput || !data) {
      return data || [];
    }
    const searchLower = searchInput.toLowerCase();
    return data.filter(
      (service) =>
        service.serviceName?.toLowerCase().includes(searchLower) ||
        service.customName?.toLowerCase().includes(searchLower),
    );
  }, [data, searchInput]);

  const columns: DatagridColumn<Service>[] = [
    {
      id: 'serviceName',
      accessorKey: 'serviceName',
      header: t('{module}_directory_columns_header_serviceName'),
      cell: ({ row }) => (
        <Link
          to={`../${row.original.serviceName}`}
          onClick={() => trackClick({ actions: ['listing::service-link'] })}
          className="text-blue-600 hover:underline"
        >
          {row.original.serviceName}
        </Link>
      ),
      enableHiding: false,
      isSearchable: true,
      isSortable: true,
    },
    // Add more columns here
  ];

  return (
    <BaseLayout
      header={{
        title: t('{module}_listing_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />,
        guideMenu: <GuideMenu items={guideItems} />,
      }}
    >
      <div className="mb-4 flex justify-end">
        <Button variant="default" onClick={handleOrderClick}>
          {t('{module}_listing_order')}
        </Button>
      </div>
      <Datagrid
        columns={columns as DatagridColumn<Record<string, unknown>>[]}
        data={filteredData as unknown as Record<string, unknown>[]}
        totalCount={totalCount ?? filteredData.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={{
          sorting,
          setSorting,
          manualSorting: false,
        }}
        search={{
          searchInput,
          setSearchInput,
          onSearch: handleSearch,
          placeholder: t('{module}_directory_search_placeholder'),
        }}
        filters={{
          filters: columnFilters,
          add: handleAddFilter,
          remove: handleRemoveFilter,
        }}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
      />
    </BaseLayout>
  );
}
```

## 📘 Template: Dashboard.page.tsx

```typescript
import { useMemo } from 'react';
import { useParams, useNavigate, Outlet, useLocation, NavLink } from 'react-router-dom';
import { Button, Tile, ActionMenu, ICON_NAME, Icon } from '@ovh-ux/muk';
import { POPOVER_POSITION } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useServiceDetail, useServiceInfo } from '@/data/api/hooks/useServiceDetail';
import { PREFIX_TRACKING_DASHBOARD } from '@/constants/{Module}.constants';
import { ServiceHeader } from '@/components/header/ServiceHeader.component';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: service, isLoading: isServiceLoading } = useServiceDetail(
    serviceName || '',
  );
  const { data: serviceInfo } = useServiceInfo(serviceName || '');

  const name = useMemo<string>(
    () => String(service?.customName || service?.serviceName || ''),
    [service],
  );

  const handleEditName = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'edit-name'] });
    navigate(`/${serviceName}/edit-name`);
  };

  if (isServiceLoading || !service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ServiceHeader
      title={name}
      subtitle={serviceName}
      tabs={
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <NavLink
              to={`/${serviceName}`}
              end
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {t('{module}_dashboard_tab_general_information')}
            </NavLink>
            {/* Add more tabs here */}
          </nav>
        </div>
      }
    >
      <Outlet />
      {/* Default content when no outlet */}
      {location.pathname.endsWith(`/${serviceName}`) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Tile.Root title={t('{module}_dashboard_information_title')}>
            <Tile.Item.Root>
              <Tile.Item.Term
                label={t('{module}_dashboard_information_name')}
                actions={
                  <ActionMenu
                    id="edit-name-menu"
                    isCompact
                    popoverPosition={POPOVER_POSITION.right}
                    items={[
                      {
                        id: 1,
                        label: t('{module}_dashboard_edit'),
                        onClick: handleEditName,
                      },
                    ]}
                  />
                }
              />
              <Tile.Item.Description>{name}</Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>
        </div>
      )}
    </ServiceHeader>
  );
}
```

## 📘 Template: useServiceDetail.ts (AAPI Hook)

```typescript
// @ai-template: aapi-hook
// @ai-source: Based on bmc-nasha/src/data/api/hooks/useNashaDetail.ts
// @ai-inputs: {
//   moduleName: string,    // e.g., "nasha"
//   endpoint: string       // e.g., "/dedicated/nasha"
// }
// @ai-pattern: AngularJS AAPI call → React useQuery hook
// @ai-angularjs-equivalent:
//   resolve: {
//     nasha: /* @ngInject */ (OvhApiDedicatedNasha, serviceName, prepareNasha) => {
//       const aapi = OvhApiDedicatedNasha.Aapi();
//       aapi.resetCache();
//       return aapi.get({ serviceName }).$promise.then(prepareNasha);
//     }
//   }
// @ai-reference: @.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md#aapi-mappings

import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
// @ai-replace: Create corresponding prepare hook
import { usePrepareService } from '@/utils/{module}.utils';
import { BASE_API_URL } from '@/constants/{Module}.constants';
import type { ServicePrepared, ServiceApiData } from '@/types/Dashboard.type';

// @ai-replace: Rename to use{ModuleName}Detail (PascalCase)
export function useServiceDetail(serviceName: string) {
  // @ai-preserve: Keep data preparation pattern from AngularJS
  const prepareService = usePrepareService();

  return useQuery({
    // @ai-replace: Use kebab-case module name in queryKey
    queryKey: ['{module}-detail', serviceName],
    queryFn: async () => {
      // @ai-note: Use AAPI endpoint (same as AngularJS OvhApi*.Aapi())
      // @ai-no-reset-cache: React Query handles caching automatically
      const { data } = await aapi.get<ServiceApiData>(
        `${BASE_API_URL}/${serviceName}`
      );
      // @ai-preserve: Apply same data transformation as AngularJS
      return prepareService(data) as ServicePrepared;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useServiceInfo(serviceName: string) {
  return useQuery({
    queryKey: ['{module}-service-info', serviceName],
    queryFn: async () => {
      const { v6 } = await import('@ovh-ux/manager-core-api');
      const { data } = await v6.get(`${BASE_API_URL}/${serviceName}/serviceInfos`);
      return { ...data, serviceType: 'DEDICATED_{MODULE}' };
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

## 📘 Template: useUpdateService.ts (Mutation Hook)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { BASE_API_URL } from '@/constants/{Module}.constants';

type UpdateServiceParams = {
  monitored?: boolean;
  customName?: string;
};

export function useUpdateServiceMonitored(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ monitored }: { monitored: boolean }) => {
      const { data } = await v6.put(`${BASE_API_URL}/${serviceName}`, { monitored });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{module}-detail', serviceName] });
    },
  });
}

export function useUpdateServiceCustomName(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customName }: { customName: string }) => {
      const { data } = await v6.put(`${BASE_API_URL}/${serviceName}`, { customName });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{module}-detail', serviceName] });
    },
  });
}
```

## 📘 Template: ErrorBoundary.component.tsx

```typescript
import { Suspense, useContext } from 'react';
import { useRouteError } from 'react-router-dom';
import { Error } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useHidePreloader } from '@/hooks/useHidePreloader';
import { useShellRoutingSync } from '@/hooks/useShellRoutingSync';
import { mapUnknownErrorToBannerError } from '@/utils/error.utils';
import { redirectionApp } from '@/routes/Routes.constants';

export const ErrorBoundary = () => {
  useHidePreloader();
  useShellRoutingSync();
  const error = useRouteError();
  const { navigation } = useContext(ShellContext).shell;
  const errorBannerError = mapUnknownErrorToBannerError(error);

  const navigateToHomePage = () => {
    navigation.navigateTo(redirectionApp, '', {});
  };

  const reloadPage = () => {
    navigation.reload();
  };

  return (
    <Suspense>
      <Error
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={errorBannerError}
      />
    </Suspense>
  );
};

export default ErrorBoundary;
```

## 📘 Template: error.utils.ts

```typescript
import type { ApiError } from '@ovh-ux/manager-core-api';

export type ErrorBannerError = {
  data: {
    message?: string;
  };
  headers?: Record<string, unknown>;
};

export function mapUnknownErrorToBannerError(
  error: unknown,
): ErrorBannerError {
  // Handle ApiError from manager-core-api
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    'message' in error
  ) {
    const apiError = error as ApiError;
    return {
      data: {
        message:
          apiError.response?.data?.message || apiError.message || 'Unknown error',
      },
      headers: apiError.response?.headers || {},
    };
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      data: {
        message: error.message,
      },
      headers: {},
    };
  }

  // Handle unknown error types
  return {
    data: {
      message: 'An unexpected error occurred',
    },
    headers: {},
  };
}
```

## 📘 Template: useHidePreloader.ts

```typescript
import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export function useHidePreloader() {
  const { shell } = useContext(ShellContext);
  useEffect(() => {
    shell?.ux.hidePreloader();
  }, [shell]);
}
```

## 📘 Template: useShellRoutingSync.ts

```typescript
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

export function useShellRoutingSync() {
  useRouteSynchro();
  return null;
}
```

## 📘 Template: Main.layout.tsx

```typescript
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { appName } from '@/App.constants';
import { useHidePreloader } from '@/hooks/useHidePreloader';
import { useShellRoutingSync } from '@/hooks/useShellRoutingSync';

export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();

  useHidePreloader();
  useShellRoutingSync();

  useEffect(() => {
    const lastMatch = matches.at(-1);
    if (lastMatch?.id) {
      defineCurrentPage(`app.${appName}-${lastMatch.id}`);
    }
  }, [matches]);

  useEffect(() => {
    trackCurrentPage();
  }, [trackCurrentPage, location.pathname]);

  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
```

## 📋 Template Usage Guidelines

### Replacement Placeholders

- `{module-name}` → Module name (e.g., `nasha`)
- `{module-key}` → Module key for datagrid (e.g., `nasha`)
- `{Product Name}` → Product display name (e.g., `NAS-HA`)
- `{Category}` → Product category (e.g., `Storage`)
- `{MODULE}` → Uppercase module name (e.g., `NASHA`)
- `{module}` → Lowercase module name (e.g., `nasha`)

### Customization Steps

1. **Replace placeholders** with actual module values
2. **Update API endpoints** in `APP_FEATURES`
3. **Update translation keys** to match module namespace
4. **Update tracking level2** values
5. **Add module-specific types** and interfaces
6. **Customize columns** in listing page
7. **Add module-specific components** and utilities

---

## 🤖 AI Development Guidelines

### Essential Template Rules

1. **Always use templates**: Start from templates, don't create from scratch
2. **Replace placeholders systematically**: Use find-replace for consistency
3. **Preserve structure**: Keep the same file organization
4. **Adapt patterns**: Customize templates for module-specific needs
5. **Validate types**: Ensure TypeScript types match module structure

### Template Checklist

- [ ] All placeholders replaced
- [ ] API endpoints updated
- [ ] Translation keys updated
- [ ] Types and interfaces defined
- [ ] Components customized
- [ ] Routes configured
- [ ] Error handling implemented
- [ ] Configuration complete

---

## ⚖️ The Templates' Moral

- **Real code** ensures working implementation
- **Systematic replacement** ensures consistency
- **Structure preservation** maintains patterns
- **Template adaptation** enables customization

**👉 Good templates are real, systematic, and adaptable.**

