---
title: React Router DOM
version: 7.9.5
last_update: 2025-11-21
tags: [react-router, routing, navigation, ovhcloud, manager, lazy-loading, tracking]
ai: true
---

# React Router DOM

> **📦 Version:** `react-router-dom@^7.9.5`
> **📚 Official Documentation:** https://reactrouter.com/

## 🧭 Purpose

**React Router DOM** is the standard routing library for React applications, providing declarative routing with nested routes, lazy loading, and navigation management. In the OVHcloud Manager ecosystem, it's used with specific patterns for µApp routing, tracking integration, and shell communication.

## ⚙️ Context

React Router DOM is designed for:
- **Declarative routing** with nested routes and outlets
- **Lazy loading** of route components for performance
- **Navigation management** with programmatic navigation
- **Route metadata** for tracking and breadcrumbs
- **Hash routing** for µApp integration
- **Route synchronization** with shell container

## 🔗 References

- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [React Router v7 Documentation](https://reactrouter.com/)
- [React Router v7 Migration Guide](https://reactrouter.com/upgrading/v6)

## ⚡ Important: React Router v7 Changes

**React Router v7 consolidates packages:** In v7, `react-router-dom` functionality is now part of the main `react-router` package. However, the Manager ecosystem continues to use `react-router-dom@^7.9.5` for compatibility.

**Key v7 Features:**
- Non-breaking upgrade from v6 with future flags
- Requires React 18+ and Node 20+
- Improved TypeScript support
- Better performance with `startTransition` integration

## 📘 Quick Start

### Package Installation

```json
{
  "dependencies": {
    "react-router-dom": "^7.9.5"
  }
}
```

### Basic Router Setup

```typescript
// routes/Routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazyRouteConfig } from '@ovh-ux/manager-core';
import { PageType } from '@ovh-ux/manager-react-shell-client';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Main.layout')),
    children: [
      {
        id: 'listing',
        path: 'listing',
        ...lazyRouteConfig(() => import('@/pages/listing/Listing.page')),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing
          }
        }
      },
      {
        id: 'dashboard',
        path: 'dashboard/:id',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
        handle: {
          tracking: { pageName: 'details', pageType: PageType.details }
        }
      }
    ]
  }
]);
```

```typescript
// App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';

export default function App() {
  return <RouterProvider router={router} />;
}
```

## 📦 Hooks Reference

| Hook | Returns | Usage |
|------|---------|-------|
| **useNavigate** | `(to, options?) => void` | Programmatic navigation |
| **useLocation** | `{ pathname, search, hash, state, key }` | Current location |
| **useParams** | `Record<string, string>` | Route parameters |
| **useSearchParams** | `[URLSearchParams, setSearchParams]` | Query parameters |
| **useLoaderData** | `T` | Route loader data |
| **useMatches** | `Match[]` | All route matches |
| **useOutlet** | `ReactElement | null` | Nested route outlet |
| **useNavigation** | `{ state: 'idle' | 'loading' | 'submitting' }` | Navigation state |

## 🧭 Navigation Hooks

### useNavigate

```typescript
import { useNavigate } from 'react-router-dom';

function NavigationComponent() {
  const navigate = useNavigate();
  
  // Basic navigation
  navigate('/dashboard/123');
  
  // With state
  navigate('/dashboard/123', {
    state: { from: 'listing', service: {...} }
  });
  
  // With search params
  navigate({
    pathname: '/listing',
    search: '?filter=active&page=1'
  });
  
  // Replace history
  navigate('/dashboard/123', { replace: true });
  
  // Relative navigation
  navigate('../sibling', { relative: 'path' });
  
  return <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>;
}
```

### useLocation

```typescript
import { useLocation } from 'react-router-dom';

function LocationComponent() {
  const location = useLocation();
  
  // Access location properties
  const pathname = location.pathname;
  const search = location.search;
  const state = location.state;
  
  return <div>Current path: {pathname}</div>;
}
```

### useParams

```typescript
import { useParams } from 'react-router-dom';

function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  
  return <div>Dashboard ID: {id}</div>;
}
```

### useSearchParams

```typescript
import { useSearchParams } from 'react-router-dom';

function FilterComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filter = searchParams.get('filter');
  const page = searchParams.get('page');
  
  const handleFilterChange = (newFilter: string) => {
    setSearchParams({ filter: newFilter, page: '1' });
  };
  
  return (
    <select onChange={(e) => handleFilterChange(e.target.value)}>
      <option value="">All</option>
      <option value="active">Active</option>
    </select>
  );
}
```

## 🛣️ Lazy Loading

### lazyRouteConfig (Manager Pattern)

```typescript
import { lazyRouteConfig } from '@ovh-ux/manager-core';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page'))
  }
];
```

### Manual Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard.page'));

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardPage />
      </Suspense>
    )
  }
];
```

## 🔄 Nested Routes

### Parent Route with Outlet

```typescript
// MainLayout.tsx
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div>
      <header>Header</header>
      <Outlet /> {/* Nested routes render here */}
      <footer>Footer</footer>
    </div>
  );
}
```

### Nested Route Configuration

```typescript
const routes = [
  {
    id: 'root',
    path: '/',
    element: <MainLayout />,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard/:id',
        element: <DashboardPage />,
        children: [
          {
            id: 'overview',
            path: 'overview',
            element: <OverviewTab />
          }
        ]
      }
    ]
  }
];
```

## 📊 Route Metadata

### Tracking Integration

```typescript
import { PageType } from '@ovh-ux/manager-react-shell-client';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
    handle: {
      tracking: {
        pageName: 'details',
        pageType: PageType.details
      },
      breadcrumb: {
        label: 'Service Details'
      }
    }
  }
];
```

### Using Route Handles

```typescript
import { useMatches } from 'react-router-dom';

function Breadcrumb() {
  const matches = useMatches();
  
  const breadcrumbs = matches
    .filter(match => match.handle?.breadcrumb)
    .map(match => ({
      path: match.pathname,
      label: match.handle.breadcrumb.label
    }));
  
  return (
    <nav>
      {breadcrumbs.map((bc, i) => (
        <span key={i}>
          {i > 0 && ' > '}
          <a href={bc.path}>{bc.label}</a>
        </span>
      ))}
    </nav>
  );
}
```

## 🛡️ Route Guards

### Authentication Guard

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '@ovh-ux/manager-react-core-application';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthentication();
  
  if (!auth.nichandle) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

### Permission Guard

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '@ovh-ux/manager-react-core-application';

function PermissionGuard({ 
  children, 
  requiredPermission 
}: { 
  children: React.ReactNode;
  requiredPermission: string;
}) {
  const auth = useAuthentication();
  
  if (!auth.roles().includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

### Using Guards in Routes

```typescript
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    element: (
      <ProtectedRoute>
        <PermissionGuard requiredPermission="service:read">
          <DashboardPage />
        </PermissionGuard>
      </ProtectedRoute>
    )
  }
];
```

## 🔗 Hash Routing (µApps)

### Hash Router Setup

```typescript
import { createHashRouter } from 'react-router-dom';

export const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    element: <MainLayout />,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard',
        element: <DashboardPage />
      }
    ]
  }
]);
```

### Shell Integration

```typescript
import { createHashRouter } from 'react-router-dom';
import { OvhContainerRoutingSync } from '@ovh-ux/manager-react-core-application';

function App() {
  const routes = [
    {
      id: 'dashboard',
      path: 'dashboard',
      element: <DashboardPage />
    }
  ];
  
  return <OvhContainerRoutingSync routes={routes} />;
}
```

## 📥 Route Loaders

### Basic Loader

```typescript
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
    loader: async ({ params }) => {
      const service = await fetchService(params.id);
      return { service };
    }
  }
];
```

### Using Loader Data

```typescript
import { useLoaderData } from 'react-router-dom';

function DashboardPage() {
  const { service } = useLoaderData() as { service: Service };
  
  return (
    <div>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
    </div>
  );
}
```

## ⚠️ Error Handling

### Route Error Elements

```typescript
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    element: <DashboardPage />,
    errorElement: <ErrorPage />
  }
];
```

### Error Boundary

```typescript
import { ErrorBoundary } from 'react-error-boundary';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardPage />
      </ErrorBoundary>
    )
  }
];
```

## ⚠️ Best Practices & Common Pitfalls

### ✅ Best Practices

```typescript
// ✅ CORRECT: Hierarchical route structure
const routes = [
  {
    id: 'root',
    path: '/',
    element: <MainLayout />,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
        handle: {
          tracking: { pageName: 'dashboard', pageType: PageType.dashboard }
        }
      }
    ]
  }
];

// ✅ CORRECT: Complete route metadata
{
  id: 'dashboard',
  path: 'dashboard/:id',
  ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
  handle: {
    tracking: { pageName: 'details', pageType: PageType.details },
    breadcrumb: { label: 'Service Details' }
  }
}
```

### ❌ Common Mistakes

```typescript
// ❌ WRONG: Missing route ID
{
  path: 'dashboard', // Missing id
  element: <DashboardPage />
}

// ❌ WRONG: Direct import (no lazy loading)
import DashboardPage from '@/pages/dashboard/Dashboard.page';

// ❌ WRONG: No error handling
<RouterProvider router={router} /> // No error boundary
```

## 🤖 AI Development Guidelines

### Essential Rules

1. **Always use route IDs**: Every route must have a unique id
2. **Use lazyRouteConfig**: Always use lazyRouteConfig for lazy loading
3. **Include route metadata**: Add tracking and breadcrumb handles
4. **Handle loading states**: Implement Suspense and error boundaries
5. **Use proper navigation**: Use useNavigate for programmatic navigation
6. **Implement route guards**: Add authentication and permission checks
7. **Follow nested structure**: Use hierarchical route organization
8. **Handle errors gracefully**: Implement error boundaries and error elements

### Route Configuration Checklist

- [ ] Route ID defined and unique
- [ ] Path configured correctly
- [ ] Lazy loading implemented with lazyRouteConfig
- [ ] Route metadata included (tracking, breadcrumb)
- [ ] Error handling configured
- [ ] Loading states handled
- [ ] Route guards implemented (if needed)

### Navigation Checklist

- [ ] useNavigate for programmatic navigation
- [ ] useLocation for current location access
- [ ] useParams for route parameters
- [ ] useSearchParams for query parameters
- [ ] Navigation state management
- [ ] Back/forward navigation handled

---

## ⚖️ The Router's Moral

- **Consistent navigation** ensures predictable user experience across applications
- **Proper route structure** makes applications maintainable and scalable
- **Lazy loading** improves performance and reduces initial bundle size
- **Route metadata** enables tracking and breadcrumb functionality

**👉 Good routing is invisible to users but essential for application navigation.**
