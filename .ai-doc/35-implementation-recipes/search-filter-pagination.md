# Recipe: Search + Filter + Pagination with Iceberg

> @ai-purpose: Complete implementation recipe for server-side pagination with Iceberg API using MUK's useDataApi hook

## Overview

This recipe implements a full-featured data table with:
- **Server-side pagination** using Iceberg API
- **Server-side search** (via Iceberg filters)
- **Server-side filtering** (via Iceberg filters)
- **Server-side sorting** (via Iceberg sort params)
- **Infinite scrolling** with automatic fetching
- Loading and error states

**Note:** With Iceberg, all operations (search, sort, filter) should be done server-side, not client-side.

## Prerequisites

- [ ] MUK Datagrid component with `useDataApi` hook
- [ ] Iceberg-compatible API endpoint
- [ ] React Router configured
- [ ] Translation namespace set up

## Step 1: Define Data Types

```typescript
// src/data/types/Resource.types.ts

export type Resource = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
};
```

## Step 2: Define Column Configuration

```typescript
// src/pages/resources/columns.ts

import { DatagridColumn, FilterTypeCategories } from '@ovh-ux/manager-react-components';
import { Resource } from '@/data/types/Resource.types';

export const resourceColumns: DatagridColumn<Resource>[] = [
  {
    id: 'name',
    label: 'Name',
    type: FilterTypeCategories.String,
    isSearchable: true, // Enable search on this column
    isSortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    type: FilterTypeCategories.String,
    isSearchable: true,
    isSortable: true,
  },
  {
    id: 'createdAt',
    label: 'Created At',
    type: FilterTypeCategories.Date,
    isSortable: true,
  },
];
```

## Step 3: Create the Page Component with useDataApi

```typescript
// src/pages/resources/Listing.page.tsx

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Datagrid, 
  useDataApi,
  ErrorBanner 
} from '@ovh-ux/manager-react-components';
import { resourceColumns } from './columns';
import { Resource } from '@/data/types/Resource.types';

export default function ResourcesListingPage() {
  const { t } = useTranslation('resources');
  const [searchInput, setSearchInput] = useState('');

  // useDataApi handles pagination, sorting, filtering, and search automatically
  const {
    flattenData,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
    search,
  } = useDataApi<Resource>({
    route: '/api/resources',
    version: 'v6',
    iceberg: true, // Enable Iceberg mode
    cacheKey: ['resources', 'list'],
    pageSize: 25,
    columns: resourceColumns,
    defaultSorting: [{ id: 'name', desc: false }],
  });

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(searchInput.toLowerCase());
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);

  // Trigger search when searchInput changes
  useEffect(() => {
    search.onSearch(search.searchInput);
  }, [search.searchInput]);

  // Error state
  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: t('resources_error_loading') },
        }}
      />
    );
  }

  return (
    <div>
      <h1>{t('resources_title')}</h1>

      {/* Datagrid with infinite scrolling */}
      <Datagrid
        isLoading={isLoading}
        columns={resourceColumns}
        items={flattenData || []}
        totalItems={totalCount || 0}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
        onSortChange={setSorting}
        filters={filters}
        search={{
          searchInput,
          setSearchInput,
          onSearch: () => null, // Handled by useEffect
        }}
      />
    </div>
  );
}
```

## Step 4: Add Translations

```json
// public/translations/resources/Messages_en_GB.json
{
  "resources_title": "Resources",
  "resources_error_loading": "Failed to load resources. Please try again."
}
```

## useDataApi Features

The `useDataApi` hook from MUK provides:

### Pagination
- **Infinite scrolling**: Automatically fetches next page when needed
- `flattenData`: All loaded data flattened from pages
- `hasNextPage`: Boolean indicating if more data is available
- `fetchNextPage`: Function to fetch the next page
- `totalCount`: Total number of items from API

### Sorting
- `sorting`: Current sorting state (SortingState from TanStack Table)
- `setSorting`: Function to update sorting
- Automatically sends `sortBy` and `sortOrder` to Iceberg API

### Filtering
- `filters`: Current column filters
- `addFilter`: Function to add a filter
- `removeFilter`: Function to remove a filter
- Filters are sent to Iceberg API as query parameters

### Search
- `search.searchInput`: Current search input value
- `search.setSearchInput`: Function to update search input
- `search.onSearch`: Function to trigger search (applies to searchable columns)
- Searches across all columns marked with `isSearchable: true`

### Loading States
- `isLoading`: Initial data loading
- `isFetching`: Any data fetching (including refetch)
- `isError`: Error state
- `error`: Error object

## Configuration Options

```typescript
useDataApi<TData>({
  // Required
  route: string,           // API endpoint path
  version: 'v2' | 'v6',    // API version
  cacheKey: string | string[], // React Query cache key
  
  // Iceberg-specific
  iceberg?: boolean,       // Enable Iceberg mode (default: false)
  pageSize?: number,       // Items per page (default: 25)
  fetchAll?: boolean,      // Fetch all pages at once (default: false)
  
  // Data transformation
  columns?: DatagridColumn<TData>[], // Column configuration for filtering/sorting
  defaultSorting?: SortingState, // Initial sort state
  
  // React Query options
  enabled?: boolean,       // Enable/disable query (default: true)
  refetchInterval?: number | false, // Auto-refetch interval
  disableCache?: boolean,  // Disable React Query cache
  
  // Custom fetch (advanced)
  fetchDataFn?: (route: string) => Promise<{ data: TData[] }>,
})
```

## Verification Checklist

- [ ] **Infinite Scrolling**: Scroll to bottom loads more data automatically
- [ ] **Search**: Search input filters data across searchable columns
- [ ] **Filters**: Column filters work correctly with Iceberg API
- [ ] **Sort**: Clicking column headers sorts data server-side
- [ ] **Loading**: Shows loading state during initial load and pagination
- [ ] **Error**: Shows error banner on API failure
- [ ] **Empty**: Shows appropriate message when no results

## Common Mistakes to Avoid

1. **Don't use client-side filtering with Iceberg** - All filtering should be server-side
2. **Don't mix useDataApi with custom fetching** - Use either useDataApi or custom implementation, not both
3. **Don't forget column configuration** - Columns must be defined for search/filter/sort to work
4. **Don't inline columns array** - Define columns outside component or use useMemo
5. **Always set `iceberg: true`** - Required for Iceberg endpoints

## When NOT to Use Iceberg

If your API endpoint does NOT support Iceberg:
- Use `version: 'v6'` and `iceberg: false`
- Implement pagination manually with traditional v6 endpoints
- Consider client-side filtering/sorting for small datasets

## Reference

- [MUK useDataApi Documentation](https://github.com/ovh/manager/tree/develop/packages/manager-ui-kit)
- [Iceberg API Documentation](https://api.ovh.com/console/#/)
- [TanStack Table (used internally)](https://tanstack.com/table)
