---
title: TanStack React Query
version: 5.51.21
last_update: 2025-11-21
tags: [react-query, tanstack, data-fetching, state-management, ovhcloud, manager]
ai: true
---

# TanStack React Query

> **📦 Version:** `@tanstack/react-query@^5.51.21`
> **📚 Official Documentation:** https://tanstack.com/query/v5/docs/framework/react/overview

## 🧭 Purpose

**TanStack React Query** is a powerful data fetching and state management library for React applications. It provides server state management, caching, background updates, and synchronization capabilities with minimal configuration.

In the OVHcloud Manager ecosystem, React Query is the standard solution for data fetching, providing consistent patterns for API integration, caching strategies, and error handling across all µApps.

## ⚙️ Context

TanStack React Query is designed for:
- **Server state management** with automatic caching
- **Background synchronization** and updates
- **Optimistic updates** for better UX
- **Error handling** and retry logic
- **Loading states** and data synchronization
- **Integration** with Manager Core API

This package is essential for:
- **Data fetching** in React µApps
- **API integration** with OVHcloud services
- **State management** for server data
- **Performance optimization** through caching

## 🔗 References

- [Manager Core API](./manager-core-api.md)
- [Manager React Core Application](./manager-react-core-application.md)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.51.21",
    "@tanstack/react-query-devtools": "5.51.21"
  }
}
```

### QueryClient Configuration

#### Basic Setup

```typescript
// queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});
```

#### Advanced Configuration

```typescript
// queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

#### Provider Setup

```typescript
// App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### Manager Integration

In Manager, backend interaction follows this pattern:
1. Create API functions using `@ovh-ux/manager-core-api`
2. Wrap them in custom React hooks using TanStack Query

#### HTTP Requests with Manager Core API

```typescript
import { apiClient, v6, v2, aapi, fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';

// Direct API calls
v6.get('/me');
v2.get('/iam/policy');
aapi.get('/feature/availability');

// Iceberg endpoints (pagination)
fetchIcebergV6({ route: '/product/services', pageSize: 20 });
fetchIcebergV2({ route: '/iam/policy', pageSize: 50 });
```

#### Polling Example

Use `refetchInterval` to auto-refresh async resource creation (e.g., Public Cloud instances):

```typescript
import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export function useInstances(instanceId?: string) {
  return useQuery({
    queryKey: ['instances', instanceId],
    queryFn: () => v6.get('/cloud/project/instances').then(res => res.data),
    refetchInterval: (data) => {
      const instances = data?.data || [];
      return instanceId &&
        instances.find(({ id }) => id === instanceId)?.status !== 'ACTIVE'
        ? 5000 // Poll every 5s until active
        : false;
    },
  });
}
```

### Basic Data Fetching

#### useQuery Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

// Basic query
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => v6.get('/product/services').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Query with parameters
export function useService(serviceId: string) {
  return useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => v6.get(`/product/services/${serviceId}`).then(res => res.data),
    enabled: !!serviceId, // Only run if serviceId exists
  });
}
```

#### Query with Iceberg

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
    queryKey: ['services', 'list', params],
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

### Mutations

#### useMutation Hook

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceData) => 
      v6.post('/product/services', data),
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Failed to create service:', error);
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceData }) =>
      v6.put(`/product/services/${id}`, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific service and list
      queryClient.invalidateQueries({ queryKey: ['services', id] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => v6.delete(`/product/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
```

### Advanced Patterns

#### Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateServiceOptimistic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => v6.put(`/product/services/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['services', id] });
      
      // Snapshot previous value
      const previousService = queryClient.getQueryData(['services', id]);
      
      // Optimistically update
      queryClient.setQueryData(['services', id], {
        ...previousService,
        ...data
      });
      
      return { previousService };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousService) {
        queryClient.setQueryData(['services', variables.id], context.previousService);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
    },
  });
}
```

#### Infinite Queries

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

export function useInfiniteServices() {
  return useInfiniteQuery({
    queryKey: ['services', 'infinite'],
    queryFn: ({ pageParam }) => fetchIcebergV2({
      route: '/product/services',
      pageSize: 20,
      cursor: pageParam
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      totalItems: data.pages[0]?.totalCount || 0
    })
  });
}
```

#### Parallel Queries

```typescript
import { useQueries } from '@tanstack/react-query';

export function useServicesData(serviceIds: string[]) {
  return useQueries({
    queries: serviceIds.map(id => ({
      queryKey: ['services', id],
      queryFn: () => v6.get(`/product/services/${id}`).then(res => res.data),
      staleTime: 5 * 60 * 1000,
    }))
  });
}
```

### Query Keys Management

#### Centralized Query Keys

```typescript
// queryKeys.ts
export const queryKeys = {
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.services.lists(), { filters }] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
} as const;
```

#### Using Query Keys

```typescript
import { queryKeys } from './queryKeys';

export function useServicesList(filters: string) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => fetchServicesList(filters),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => fetchService(id),
  });
}

// Invalidation
export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
}
```

### Error Handling

#### Global Error Handling

```typescript
// errorHandler.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        // Global error handling for mutations
        console.error('Mutation error:', error);
        // Show error notification
      },
    },
  },
});
```

#### Component Error Handling

```typescript
import { useQuery } from '@tanstack/react-query';
import { isApiCustomError } from '@ovh-ux/manager-core-api';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const response = await v6.get('/product/services');
        return response.data;
      } catch (error) {
        if (isApiCustomError(error)) {
          throw new Error(error.response?.data?.message || 'API Error');
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Services query error:', error);
    },
  });
}
```

### Loading States

#### Basic Loading States

```typescript
export function ServicesList() {
  const { data, isLoading, error, isError } = useServices();
  
  if (isLoading) {
    return <div>Loading services...</div>;
  }
  
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      {data?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
```

#### Advanced Loading States

```typescript
export function ServicesList() {
  const { 
    data, 
    isLoading, 
    isFetching, 
    isError, 
    error,
    isStale,
    isRefetching 
  } = useServices();
  
  return (
    <div>
      {isLoading && <div>Initial loading...</div>}
      {isFetching && !isLoading && <div>Refreshing...</div>}
      {isStale && <div>Data may be outdated</div>}
      
      {isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data?.map(service => (
            <div key={service.id}>{service.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Background Updates

#### Automatic Refetching

```typescript
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => fetchServices(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue in background
  });
}
```

#### Manual Refetching

```typescript
export function ServicesList() {
  const { data, refetch, isFetching } = useServices();
  
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <div>
      <button onClick={handleRefresh} disabled={isFetching}>
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </button>
      {/* Services list */}
    </div>
  );
}
```

### Prefetching

#### Prefetching Data

```typescript
import { useQueryClient } from '@tanstack/react-query';

export function usePrefetchService() {
  const queryClient = useQueryClient();
  
  const prefetchService = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['services', id],
      queryFn: () => fetchService(id),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  return { prefetchService };
}
```

#### Prefetching on Hover

```typescript
export function ServiceCard({ service }: { service: Service }) {
  const { prefetchService } = usePrefetchService();
  
  return (
    <div 
      onMouseEnter={() => prefetchService(service.id)}
      onClick={() => navigate(`/services/${service.id}`)}
    >
      {service.name}
    </div>
  );
}
```

### DevTools Integration

#### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Best Practices

#### 1. Query Key Structure

```typescript
// ✅ CORRECT: Hierarchical query keys
const queryKeys = {
  services: {
    all: ['services'],
    lists: () => [...queryKeys.services.all, 'list'],
    list: (filters) => [...queryKeys.services.lists(), { filters }],
    details: () => [...queryKeys.services.all, 'detail'],
    detail: (id) => [...queryKeys.services.details(), id],
  }
};

// ❌ WRONG: Flat query keys
const queryKeys = {
  servicesList: 'services-list',
  serviceDetail: 'service-detail',
};
```

#### 2. Error Handling

```typescript
// ✅ CORRECT: Proper error handling
const { data, isLoading, error } = useQuery({
  queryKey: ['services'],
  queryFn: async () => {
    try {
      const response = await v6.get('/product/services');
      return response.data;
    } catch (error) {
      if (isApiCustomError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  },
});

// ❌ WRONG: No error handling
const { data } = useQuery({
  queryKey: ['services'],
  queryFn: () => v6.get('/product/services').then(res => res.data),
});
```

#### 3. Stale Time Configuration

```typescript
// ✅ CORRECT: Appropriate stale time
const { data } = useQuery({
  queryKey: ['services'],
  queryFn: fetchServices,
  staleTime: 5 * 60 * 1000, // 5 minutes for services
});

const { data } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
  staleTime: 30 * 60 * 1000, // 30 minutes for user data
});

// ❌ WRONG: No stale time (always refetch)
const { data } = useQuery({
  queryKey: ['services'],
  queryFn: fetchServices,
});
```

### Common Pitfalls

#### ❌ Wrong: Missing Query Key

```typescript
// Don't forget query keys
const { data } = useQuery({
  queryFn: fetchServices, // Missing queryKey
});
```

#### ✅ Correct: Complete Query Configuration

```typescript
const { data } = useQuery({
  queryKey: ['services'],
  queryFn: fetchServices,
  staleTime: 5 * 60 * 1000,
});
```

#### ❌ Wrong: Not Handling Loading States

```typescript
// Don't ignore loading states
function ServicesList() {
  const { data } = useServices();
  return <div>{data.map(service => service.name)}</div>; // May crash if data is undefined
}
```

#### ✅ Correct: Handle All States

```typescript
function ServicesList() {
  const { data, isLoading, error } = useServices();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.map(service => service.name)}</div>;
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use query keys**: Every query must have a unique queryKey
2. **Handle loading states**: Always check isLoading, isError, and error states
3. **Configure stale time**: Set appropriate staleTime for different data types
4. **Use proper error handling**: Wrap API calls in try-catch with proper error types
5. **Invalidate on mutations**: Always invalidate related queries after mutations
6. **Use select for transformations**: Use select to transform data instead of doing it in components
7. **Implement optimistic updates**: Use optimistic updates for better UX
8. **Follow query key conventions**: Use hierarchical query keys for better organization

### Query Configuration Checklist

- [ ] Query key defined and unique
- [ ] Query function properly implemented
- [ ] Error handling configured
- [ ] Stale time set appropriately
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Success states handled

### Mutation Configuration Checklist

- [ ] Mutation function implemented
- [ ] onSuccess callback configured
- [ ] onError callback configured
- [ ] Query invalidation implemented
- [ ] Optimistic updates (if applicable)
- [ ] Loading states handled

### Performance Optimization Checklist

- [ ] Appropriate stale time configured
- [ ] Garbage collection time set
- [ ] Background refetching configured
- [ ] Prefetching implemented where beneficial
- [ ] Query deduplication working
- [ ] Memory usage optimized

---

## ⚖️ The Query's Moral

- **Consistent patterns** ensure maintainable and predictable data fetching
- **Proper error handling** prevents silent failures and improves user experience
- **Performance optimization** through caching and background updates ensures responsive applications
- **State management** provides a single source of truth for server data

**👉 Good data fetching is invisible to users but essential for application performance.**
