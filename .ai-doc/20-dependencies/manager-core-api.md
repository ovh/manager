---
title: Manager Core API
version: 0.18.7
last_update: 2025-11-21
tags: [api, core, ovhcloud, manager, axios, iceberg, v6, v2]
ai: true
---

# Manager Core API

> **📦 Version:** `@ovh-ux/manager-core-api@^0.18.7`

## 🧭 Purpose

The **Manager Core API** package provides standardized HTTP clients and utilities for interacting with OVHcloud APIs. It includes pre-configured Axios instances for different API versions (v6, v2, aapi, ws), Iceberg data fetching functions, and comprehensive error handling.

This package is the foundation for all API interactions in Manager applications, providing consistent patterns for data fetching, pagination, filtering, and error management.

## ⚙️ Context

Manager Core API is designed for:
- **Standardized API clients** for all OVHcloud API versions
- **Iceberg data fetching** with pagination, sorting, and filtering
- **Error handling** with automatic authentication redirects
- **Request tagging** for tracing and monitoring
- **Type safety** with comprehensive TypeScript definitions

This package is essential for:
- **Data fetching** in React applications
- **API integration** with TanStack Query
- **Error management** across all Manager applications
- **Consistent patterns** for API interactions

## 🔗 References

- [Manager API Overview](../10-architecture/api-overview.md)
- [Data Fetching Patterns](../10-architecture/data-fetching.md)
- [TanStack React Query](./tanstack-react-query.md)
- [Manager Core Utils](./manager-core-utils.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-core-api": "^0.18.7"
  }
}
```

### API Clients

The package provides pre-configured Axios instances for different API versions:

```typescript
import { v6, v2, aapi, ws, apiClient } from '@ovh-ux/manager-core-api';

// Individual clients
const response = await v6.get('/me');
const projects = await v2.get('/iam/project');
const features = await aapi.get('/feature/availability');
const websocket = await ws.get('/notification');

// Or use the apiClient object
const response = await apiClient.v6.get('/me');
const projects = await apiClient.v2.get('/iam/project');
```

#### Available Clients

| Client | Base URL | Purpose |
|--------|----------|---------|
| `v6` | `/engine/apiv6` | Legacy REST API |
| `v2` | `/engine/api/v2` | Modern REST API |
| `aapi` | `/engine/2api` | Aggregated API |
| `ws` | `/engine/ws` | WebSocket API |

### Iceberg Data Fetching

#### fetchIcebergV6

For legacy API with pagination:

```typescript
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

// Basic usage
const result = await fetchIcebergV6({
  route: '/product/services',
  page: 1,
  pageSize: 20
});

// With filtering and sorting
const filteredResult = await fetchIcebergV6({
  route: '/product/services',
  page: 1,
  pageSize: 20,
  sortBy: 'serviceName',
  sortReverse: false,
  filters: [
    {
      key: 'serviceName',
      value: 'test',
      comparator: FilterComparator.Includes
    }
  ],
  disableCache: true
});

console.log(result.data); // Array of services
console.log(result.totalCount); // Total number of items
console.log(result.status); // HTTP status code
```

#### fetchIcebergV2

For modern API with cursor-based pagination:

```typescript
import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

// Basic usage
const result = await fetchIcebergV2({
  route: '/iam/policy',
  pageSize: 50
});

// With cursor pagination
const nextPageResult = await fetchIcebergV2({
  route: '/iam/policy',
  pageSize: 50,
  cursor: result.cursorNext
});

// With filtering and sorting
const filteredResult = await fetchIcebergV2({
  route: '/iam/policy',
  pageSize: 50,
  sortBy: 'name',
  sortOrder: 'ASC',
  filters: [
    {
      key: 'name',
      value: 'admin',
      comparator: FilterComparator.StartsWith
    }
  ]
});

console.log(result.data); // Array of policies
console.log(result.cursorNext); // Next page cursor (if available)
console.log(result.status); // HTTP status code
```

### Filtering System

#### Filter Comparators

```typescript
import { FilterComparator } from '@ovh-ux/manager-core-api';

// String filters
FilterComparator.Includes      // like=%25value%25
FilterComparator.StartsWith    // like=value%25
FilterComparator.EndsWith      // like=%25value
FilterComparator.IsEqual       // eq=value
FilterComparator.IsDifferent    // ne=value

// Numeric filters
FilterComparator.IsLower       // lt=value
FilterComparator.IsHigher      // gt=value

// Date filters
FilterComparator.IsBefore      // lt=value
FilterComparator.IsAfter       // gt=value

// Array filters
FilterComparator.IsIn          // in=value1,value2

// Tag filters
FilterComparator.TagEquals     // EQ
FilterComparator.TagNotEqual   // NEQ
FilterComparator.TagExists     // EXISTS
FilterComparator.TagNotExists  // NEXISTS
```

#### Filter Types

```typescript
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

FilterTypeCategories.Numeric   // Numeric values
FilterTypeCategories.String    // String values
FilterTypeCategories.Date      // Date values
FilterTypeCategories.Boolean  // Boolean values
FilterTypeCategories.Options  // Option values
FilterTypeCategories.Tags      // Tag values
```

#### Creating Filters

```typescript
import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';

// String filter
const nameFilter = {
  key: 'serviceName',
  value: 'test',
  comparator: FilterComparator.Includes,
  type: FilterTypeCategories.String
};

// Numeric filter
const sizeFilter = {
  key: 'size',
  value: '100',
  comparator: FilterComparator.IsHigher,
  type: FilterTypeCategories.Numeric
};

// Date filter
const dateFilter = {
  key: 'creationDate',
  value: '2024-01-01',
  comparator: FilterComparator.IsAfter,
  type: FilterTypeCategories.Date
};

// Tag filter
const tagFilter = {
  key: 'environment',
  value: 'production',
  comparator: FilterComparator.TagEquals,
  type: FilterTypeCategories.Tags,
  tagKey: 'environment'
};

// Array filter
const statusFilter = {
  key: 'status',
  value: ['active', 'pending'],
  comparator: FilterComparator.IsIn,
  type: FilterTypeCategories.Options
};
```

### Error Handling

#### Error Types

```typescript
import { ApiError, TApiCustomError, ApiErrorClass } from '@ovh-ux/manager-core-api';

// Basic API error
const error: ApiError = {
  message: 'Error message',
  // ... AxiosError properties
};

// Custom API error with class
const customError: TApiCustomError = {
  response: {
    data: {
      class: 'MaxQuotaReached',
      message: 'Maximum quota reached'
    }
  }
  // ... AxiosError properties
};
```

#### Error Guards

```typescript
import { isApiCustomError, isMaxQuotaReachedError } from '@ovh-ux/manager-core-api';

try {
  const result = await v6.get('/some/endpoint');
} catch (error) {
  if (isApiCustomError(error)) {
    console.log('Custom API error:', error.response?.data?.message);
    
    if (isMaxQuotaReachedError(error)) {
      console.log('Max quota reached');
      // Handle quota error
    }
  }
}
```

#### Automatic Error Handling

The package automatically handles authentication errors:

- **401 Unauthorized**: Redirects to logout page
- **403 Forbidden** (with specific messages): Treated as 401
- **471 Authentication Required**: Redirects to login page

### Advanced Usage Patterns

#### Custom Headers

```typescript
import { buildHeaders } from '@ovh-ux/manager-core-api';

const headers = buildHeaders()
  .setPaginationSize(100)
  .setPaginationNumber(1)
  .setPaginationSort('name', 'ASC')
  .setPaginationFilter(filters)
  .setCustomHeader('X-Custom-Header', 'value')
  .setDisabledCache(true)
  .build();

const response = await v6.get('/endpoint', { headers });
```

#### IAM Tags Integration

```typescript
import { appendIamTags } from '@ovh-ux/manager-core-api';

const params = new URLSearchParams();
const filters = [
  {
    key: 'resource',
    value: 'instance',
    comparator: FilterComparator.TagEquals,
    type: FilterTypeCategories.Tags,
    tagKey: 'resource'
  }
];

// Automatically appends IAM tags to URL parameters
const urlWithTags = appendIamTags(params, filters, 'iamTags');
```

### React Query Integration

#### Basic Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => v6.get('/product/services').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### Iceberg Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export function useServicesList(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortReverse?: boolean;
  filters?: Filter[];
}) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => fetchIcebergV6({
      route: '/product/services',
      ...params
    }),
    select: (result) => ({
      items: result.data,
      totalCount: result.totalCount,
      status: result.status
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

#### Mutation Hook

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceData) => 
      v6.post('/product/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
```

### TypeScript Support

#### Complete Type Definitions

```typescript
import type {
  ApiError,
  ApiResponse,
  TApiCustomError,
  ApiErrorClass,
  Filter,
  FilterComparator,
  FilterTypeCategories,
  IcebergFetchParamsV6,
  IcebergFetchParamsV2,
  IcebergFetchResultV6,
  IcebergFetchResultV2,
  IcebergCommonOptions
} from '@ovh-ux/manager-core-api';
```

#### Generic API Response

```typescript
import { ApiResponse } from '@ovh-ux/manager-core-api';

interface Service {
  id: string;
  name: string;
  status: string;
}

const response: ApiResponse<Service[]> = await v6.get('/product/services');
const services: Service[] = response.data;
```

### Best Practices

#### 1. Error Handling Pattern

```typescript
import { isApiCustomError } from '@ovh-ux/manager-core-api';

const fetchData = async () => {
  try {
    const result = await fetchIcebergV6({
      route: '/product/services',
      page: 1,
      pageSize: 20
    });
    return { data: result.data, error: null };
  } catch (error) {
    if (isApiCustomError(error)) {
      return { 
        data: null, 
        error: error.response?.data?.message || 'API Error' 
      };
    }
    return { data: null, error: 'Network Error' };
  }
};
```

#### 2. Filter Composition

```typescript
const buildFilters = (searchTerm: string, status: string[]) => {
  const filters: Filter[] = [];
  
  if (searchTerm) {
    filters.push({
      key: 'name',
      value: searchTerm,
      comparator: FilterComparator.Includes,
      type: FilterTypeCategories.String
    });
  }
  
  if (status.length > 0) {
    filters.push({
      key: 'status',
      value: status,
      comparator: FilterComparator.IsIn,
      type: FilterTypeCategories.Options
    });
  }
  
  return filters;
};
```

#### 3. Pagination State Management

```typescript
const usePagination = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>();
  const [sortReverse, setSortReverse] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['services', { page, pageSize, sortBy, sortReverse }],
    queryFn: () => fetchIcebergV6({
      route: '/product/services',
      page,
      pageSize,
      sortBy,
      sortReverse
    })
  });
  
  return {
    data,
    isLoading,
    error,
    pagination: {
      page,
      pageSize,
      totalCount: data?.totalCount || 0,
      setPage,
      setPageSize
    },
    sorting: {
      sortBy,
      sortReverse,
      setSortBy,
      setSortReverse
    }
  };
};
```

### Common Pitfalls

#### ❌ Wrong: Missing Error Handling

```typescript
// Don't do this
const data = await v6.get('/endpoint');
```

#### ✅ Correct: Proper Error Handling

```typescript
try {
  const response = await v6.get('/endpoint');
  return response.data;
} catch (error) {
  if (isApiCustomError(error)) {
    throw new Error(error.response?.data?.message);
  }
  throw error;
}
```

#### ❌ Wrong: Incorrect Filter Usage

```typescript
// Don't do this - missing type
const filter = {
  key: 'name',
  value: 'test',
  comparator: FilterComparator.Includes
};
```

#### ✅ Correct: Complete Filter Definition

```typescript
const filter: Filter = {
  key: 'name',
  value: 'test',
  comparator: FilterComparator.Includes,
  type: FilterTypeCategories.String
};
```

#### ❌ Wrong: Not Using Iceberg for Lists

```typescript
// Don't do this for paginated data
const services = await v6.get('/product/services');
```

#### ✅ Correct: Use Iceberg for Pagination (when supported)

**Note:** Not all endpoints support Iceberg. Use Iceberg when the endpoint supports it, otherwise use v6 with appropriate pagination handling.

```typescript
const result = await fetchIcebergV6({
  route: '/product/services',
  page: 1,
  pageSize: 20
});
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Use Iceberg for lists when supported**: Use `fetchIcebergV6` or `fetchIcebergV2` for paginated data when the endpoint supports it
2. **Handle errors properly**: Always wrap API calls in try-catch with proper error types
3. **Use correct filter types**: Always specify `type` in Filter objects
4. **Import specific functions**: Import only what you need from the package
5. **Use TypeScript types**: Leverage the comprehensive type definitions
6. **Follow pagination patterns**: Use consistent pagination state management
7. **Cache appropriately**: Set appropriate `staleTime` for different data types
8. **Invalidate on mutations**: Always invalidate related queries after mutations

### API Client Selection Guide

- **v6**: Legacy REST API, use for existing endpoints
- **v2**: Modern REST API, use for new endpoints
- **aapi**: Aggregated API, use for feature availability
- **ws**: WebSocket API, use for real-time data

### Filter Creation Checklist

- [ ] Specify `key` (field name)
- [ ] Specify `value` (filter value)
- [ ] Choose correct `comparator`
- [ ] Set appropriate `type`
- [ ] Add `tagKey` for tag filters

### Error Handling Checklist

- [ ] Wrap API calls in try-catch
- [ ] Check `isApiCustomError` for API errors
- [ ] Handle specific error classes
- [ ] Provide user-friendly error messages
- [ ] Log errors for debugging

### Performance Optimization

- [ ] Use appropriate `staleTime` for data freshness
- [ ] Implement proper pagination
- [ ] Use `select` in React Query for data transformation
- [ ] Cache static data longer than dynamic data
- [ ] Use `disableCache: true` for real-time data

---

## ⚖️ The API's Moral

- **Consistent patterns** ensure maintainable code across all applications
- **Proper error handling** prevents silent failures and improves user experience
- **Type safety** catches errors at compile time and improves developer experience
- **Performance optimization** through caching and pagination ensures scalable applications

**👉 Good API integration is invisible to users but essential for application reliability.**

## 🔄 Cascade Exports

### Filters and Utilities

#### FilterCategories

```typescript
import { FilterCategories } from '@ovh-ux/manager-core-api';

// Available filter categories
const categories = {
  Numeric: ['IsEqual', 'IsDifferent', 'IsLower', 'IsHigher'],
  String: ['Includes', 'StartsWith', 'EndsWith', 'IsEqual', 'IsDifferent'],
  Date: ['IsEqual', 'IsDifferent', 'IsBefore', 'IsAfter'],
  Boolean: ['IsEqual', 'IsDifferent'],
  Options: ['IsEqual', 'IsDifferent'],
  Tags: ['TagEquals', 'TagNotEqual', 'TagExists', 'TagNotExists']
};
```

#### applyFilters

```typescript
import { applyFilters } from '@ovh-ux/manager-core-api';

// Apply filters on local data
const filteredItems = applyFilters(items, [
  {
    key: 'name',
    value: 'test',
    comparator: FilterComparator.Includes,
    type: FilterTypeCategories.String
  }
]);
```

#### transformTagsFiltersToQuery

```typescript
import { transformTagsFiltersToQuery } from '@ovh-ux/manager-core-api';

// Transform tag filters to query string
const tagsQuery = transformTagsFiltersToQuery([
  {
    type: FilterTypeCategories.Tags,
    tagKey: 'environment',
    comparator: FilterComparator.TagEquals,
    value: 'production'
  }
]);
// Result: '{"environment":[{"operator":"EQ","value":"production"}]}'
```

### Advanced Error Handling

#### Type Guards

```typescript
import { isApiCustomError, isMaxQuotaReachedError } from '@ovh-ux/manager-core-api';

// Check if it's a custom API error
if (isApiCustomError(error)) {
  console.log('API Error:', error.response.data.message);
}

// Check if it's a maximum quota error
if (isMaxQuotaReachedError(error)) {
  console.log('Maximum quota reached');
}
```

### Integration with Request Tagger

```typescript
// API clients automatically integrate request-tagger
import { v6 } from '@ovh-ux/manager-core-api';

// Tagging headers are automatically added
const response = await v6.get('/me');
// Automatic headers: X-OVH-MANAGER-NAVIGATION-ID, X-OVH-MANAGER-REQUEST-ID, etc.
```

### Authentication Handling

```typescript
// Clients automatically handle authentication errors
// 401: Redirect to logout
// 471: Redirect to login
// 403: Convert to 401 if session invalid
```

