# Recipe: Search + Filter + Pagination

> @ai-purpose: Complete implementation recipe for a common complex feature

## Overview

This recipe implements a full-featured data table with:
- Server-side pagination (Iceberg)
- Client-side search
- Multi-column filtering
- URL state persistence
- Loading and error states

## Prerequisites

- [ ] MUK Datagrid component
- [ ] React Query configured
- [ ] React Router for URL state
- [ ] Translation namespace set up

## Step 1: Create the API Hook

```typescript
// src/data/api/hooks/useResourceList.ts

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

interface UseResourceListParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Resource {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ResourceListResponse {
  data: Resource[];
  totalCount: number;
}

export function useResourceList({
  page,
  pageSize,
  sortBy,
  sortOrder,
}: UseResourceListParams) {
  return useQuery<ResourceListResponse>({
    queryKey: ['resources', 'list', { page, pageSize, sortBy, sortOrder }],
    queryFn: async () => {
      const response = await fetchIcebergV6<Resource>({
        route: '/api/resources',
        page,
        pageSize,
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });
      return {
        data: response.data,
        totalCount: response.totalCount,
      };
    },
    // Keep previous data while fetching new page
    placeholderData: keepPreviousData,
  });
}
```

## Step 2: Create URL State Hook

```typescript
// src/hooks/useResourceFilters.ts

import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

interface Filters {
  page: number;
  pageSize: number;
  search: string;
  status: string | null;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: Filters = {
  page: 1,
  pageSize: 25,
  search: '',
  status: null,
  sortBy: null,
  sortOrder: 'asc',
};

export function useResourceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<Filters>(() => ({
    page: parseInt(searchParams.get('page') || String(DEFAULT_FILTERS.page), 10),
    pageSize: parseInt(searchParams.get('pageSize') || String(DEFAULT_FILTERS.pageSize), 10),
    search: searchParams.get('search') || DEFAULT_FILTERS.search,
    status: searchParams.get('status') || DEFAULT_FILTERS.status,
    sortBy: searchParams.get('sortBy') || DEFAULT_FILTERS.sortBy,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || DEFAULT_FILTERS.sortOrder,
  }), [searchParams]);

  const setFilters = useCallback((updates: Partial<Filters>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === DEFAULT_FILTERS[key as keyof Filters]) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset page when filters change (except for page itself)
      if (!('page' in updates) && Object.keys(updates).length > 0) {
        newParams.delete('page');
      }

      return newParams;
    });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}
```

## Step 3: Create Filter Components

```typescript
// src/pages/Resources/components/ResourceFilters.tsx

import { useTranslation } from 'react-i18next';
import { OdsInput, OdsSelect } from '@ovhcloud/ods-components/react';
import { OdsButton } from '@ovhcloud/ods-components/react';

interface ResourceFiltersProps {
  search: string;
  status: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export function ResourceFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: ResourceFiltersProps) {
  const { t } = useTranslation('resources');

  return (
    <div className="flex gap-4 mb-4">
      {/* Search Input */}
      <OdsInput
        type="search"
        placeholder={t('resources_search_placeholder')}
        value={search}
        onOdsChange={(e) => onSearchChange(e.detail.value || '')}
        clearable
      />

      {/* Status Filter */}
      <OdsSelect
        value={status || ''}
        onOdsChange={(e) => onStatusChange(e.detail.value || null)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`resources_status_${option.value || 'all'}`)}
          </option>
        ))}
      </OdsSelect>

      {/* Reset Button */}
      <OdsButton variant="ghost" onClick={onReset}>
        {t('common_reset_filters')}
      </OdsButton>
    </div>
  );
}
```

## Step 4: Create the Main Page Component

```typescript
// src/pages/Resources/ResourcesList.page.tsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Datagrid, DatagridColumn, Loading, ErrorBanner } from '@ovh-ux/muk';
import { useResourceList } from '@/data/api/hooks/useResourceList';
import { useResourceFilters } from '@/hooks/useResourceFilters';
import { ResourceFilters } from './components/ResourceFilters';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/utils/formatDate';

interface Resource {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export function ResourcesListPage() {
  const { t } = useTranslation('resources');
  const { filters, setFilters, resetFilters } = useResourceFilters();

  // Fetch data with server-side pagination
  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useResourceList({
    page: filters.page,
    pageSize: filters.pageSize,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder,
  });

  // Client-side filtering (search + status)
  const filteredData = useMemo(() => {
    if (!response?.data) return [];

    return response.data.filter((item) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [response?.data, filters.search, filters.status]);

  // Column definitions
  const columns = useMemo<DatagridColumn<Resource>[]>(() => [
    {
      id: 'name',
      label: t('resources_column_name'),
      cell: (row) => row.name,
      isSortable: true,
    },
    {
      id: 'status',
      label: t('resources_column_status'),
      cell: (row) => <StatusBadge status={row.status} />,
      isSortable: true,
    },
    {
      id: 'createdAt',
      label: t('resources_column_created'),
      cell: (row) => formatDate(row.createdAt),
      isSortable: true,
    },
  ], [t]);

  // Handle sort
  const handleSort = (columnId: string) => {
    if (filters.sortBy === columnId) {
      setFilters({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setFilters({
        sortBy: columnId,
        sortOrder: 'asc',
      });
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  // Loading state (initial load only)
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return <ErrorBanner error={error} />;
  }

  return (
    <div>
      <h1>{t('resources_title')}</h1>

      {/* Filters */}
      <ResourceFilters
        search={filters.search}
        status={filters.status}
        onSearchChange={(search) => setFilters({ search })}
        onStatusChange={(status) => setFilters({ status })}
        onReset={resetFilters}
      />

      {/* Data Table */}
      <Datagrid
        data={filteredData}
        columns={columns}
        pageSize={filters.pageSize}
        totalItems={response?.totalCount || 0}
        currentPage={filters.page}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortBy={filters.sortBy || undefined}
        sortOrder={filters.sortOrder}
        isLoading={isFetching}
      />
    </div>
  );
}
```

## Step 5: Add Translations

```json
// public/translations/resources/Messages_en_GB.json
{
  "resources_title": "Resources",
  "resources_search_placeholder": "Search by name...",
  "resources_status_all": "All statuses",
  "resources_status_active": "Active",
  "resources_status_inactive": "Inactive",
  "resources_status_pending": "Pending",
  "resources_column_name": "Name",
  "resources_column_status": "Status",
  "resources_column_created": "Created",
  "common_reset_filters": "Reset filters"
}
```

## Verification Checklist

- [ ] **Pagination**: Page changes update URL and fetch new data
- [ ] **Search**: Search term persists in URL, filters data correctly
- [ ] **Filters**: Status filter persists in URL, filters data correctly
- [ ] **Sort**: Sort column and order persist in URL, request sorted data
- [ ] **Reset**: Reset button clears all filters and URL params
- [ ] **Loading**: Shows loading state during initial load and page changes
- [ ] **Error**: Shows error banner on API failure
- [ ] **Empty**: Shows appropriate message when no results
- [ ] **URL Sharing**: Copy URL → Paste → Same view appears

## Common Mistakes to Avoid

1. **Don't reset page on every filter change** - Only reset when search/filters change, not pagination
2. **Don't fetch without pageSize** - Always pass pagination params to API
3. **Don't use useState for URL state** - Use useSearchParams for shareable URLs
4. **Don't inline columns array** - Use useMemo to prevent re-renders
5. **Don't mix server and client pagination** - Pick one approach per use case
