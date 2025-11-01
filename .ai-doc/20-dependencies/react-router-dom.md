---
title: React Router DOM
last_update: 2025-01-27
tags: [react-router, routing, navigation, ovhcloud, manager, lazy-loading, tracking]
ai: true
---

# React Router DOM

> **📦 Version:** `react-router-dom@^6.3.0`

## 🧭 Purpose

**React Router DOM** is the standard routing library for React applications, providing declarative routing with nested routes, lazy loading, and navigation management. In the OVHcloud Manager ecosystem, it's used with specific patterns for µApp routing, tracking integration, and shell communication.

This package is essential for React µApps to handle navigation, route management, and integration with the Manager shell tracking system.

## ⚙️ Context

React Router DOM is designed for:
- **Declarative routing** with nested routes and outlets
- **Lazy loading** of route components for performance
- **Navigation management** with programmatic navigation
- **Route metadata** for tracking and breadcrumbs
- **Hash routing** for µApp integration
- **Route synchronization** with shell container

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Navigation consistency** across applications
- **Performance optimization** through lazy loading
- **Tracking integration** with route metadata

## 🔗 References

- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [React Router Documentation](https://reactrouter.com/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "react-router-dom": "^6.3.0"
  }
}
```

### Basic Router Setup

#### createBrowserRouter

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
        id: 'onboarding',
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding
          }
        }
      },
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
          tracking: {
            pageName: 'details',
            pageType: PageType.details
          }
        }
      }
    ]
  }
]);
```

#### Router Provider

```typescript
// App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Lazy Loading with lazyRouteConfig

#### Basic Lazy Loading

```typescript
import { lazyRouteConfig } from '@ovh-ux/manager-core';

// Lazy load a page component
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page'))
  }
];
```

#### Lazy Loading with Error Boundary

```typescript
import { lazyRouteConfig } from '@ovh-ux/manager-core';
import { Suspense } from 'react';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
    element: (
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardPage />
      </Suspense>
    )
  }
];
```

### Navigation Hooks

#### useNavigate Hook

```typescript
import { useNavigate } from 'react-router-dom';

function NavigationComponent() {
  const navigate = useNavigate();
  
  const handleNavigateToDashboard = (id: string) => {
    navigate(`/dashboard/${id}`);
  };
  
  const handleNavigateBack = () => {
    navigate(-1); // Go back one step
  };
  
  const handleNavigateWithState = () => {
    navigate('/dashboard/123', {
      state: { from: 'listing' },
      replace: false // Use push instead of replace
    });
  };
  
  return (
    <div>
      <button onClick={() => handleNavigateToDashboard('123')}>
        Go to Dashboard
      </button>
      <button onClick={handleNavigateBack}>
        Go Back
      </button>
    </div>
  );
}
```

#### useLocation Hook

```typescript
import { useLocation } from 'react-router-dom';

function LocationComponent() {
  const location = useLocation();
  
  // Access current pathname
  const currentPath = location.pathname;
  
  // Access search parameters
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  
  // Access state passed during navigation
  const from = location.state?.from;
  
  return (
    <div>
      <p>Current path: {currentPath}</p>
      <p>Page: {page}</p>
      <p>From: {from}</p>
    </div>
  );
}
```

#### useParams Hook

```typescript
import { useParams } from 'react-router-dom';

function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h1>Dashboard for service: {id}</h1>
    </div>
  );
}
```

#### useSearchParams Hook

```typescript
import { useSearchParams } from 'react-router-dom';

function SearchComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = searchParams.get('page') || '1';
  const filter = searchParams.get('filter') || '';
  
  const handlePageChange = (newPage: string) => {
    setSearchParams(prev => {
      prev.set('page', newPage);
      return prev;
    });
  };
  
  const handleFilterChange = (newFilter: string) => {
    setSearchParams(prev => {
      if (newFilter) {
        prev.set('filter', newFilter);
      } else {
        prev.delete('filter');
      }
      return prev;
    });
  };
  
  return (
    <div>
      <p>Current page: {page}</p>
      <p>Current filter: {filter}</p>
      <button onClick={() => handlePageChange('2')}>
        Go to page 2
      </button>
    </div>
  );
}
```

### Nested Routes and Outlets

#### Parent Route with Outlet

```typescript
// Main.layout.tsx
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <header>
        <h1>BMC Nasha</h1>
        <nav>
          {/* Navigation items */}
        </nav>
      </header>
      <main>
        <Outlet /> {/* Child routes will render here */}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

#### Nested Route Structure

```typescript
const routes = [
  {
    id: 'root',
    path: '/',
    element: <MainLayout />,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard',
        element: <DashboardPage />,
        children: [
          {
            id: 'dashboard-overview',
            path: 'overview',
            element: <OverviewTab />
          },
          {
            id: 'dashboard-settings',
            path: 'settings',
            element: <SettingsTab />
          }
        ]
      }
    ]
  }
];
```

### Route Metadata and Handles

#### Tracking Integration

```typescript
import { PageType } from '@ovh-ux/manager-react-shell-client';

const routes = [
  {
    id: 'listing',
    path: 'listing',
    ...lazyRouteConfig(() => import('@/pages/listing/Listing.page')),
    handle: {
      tracking: {
        pageName: 'listing',
        pageType: PageType.listing
      },
      breadcrumb: {
        label: 'Services List'
      }
    }
  }
];
```

#### Custom Route Handles

```typescript
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
        label: 'Service Details',
        dynamic: true
      },
      permissions: ['service:read'],
      layout: 'full-width'
    }
  }
];
```

#### Using Route Handles

```typescript
import { useMatches } from 'react-router-dom';

function BreadcrumbComponent() {
  const matches = useMatches();
  
  const breadcrumbs = matches
    .filter(match => match.handle?.breadcrumb)
    .map(match => ({
      label: match.handle.breadcrumb.label,
      path: match.pathname
    }));
  
  return (
    <nav>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          <a href={breadcrumb.path}>{breadcrumb.label}</a>
        </span>
      ))}
    </nav>
  );
}
```

### Programmatic Navigation

#### Navigation with State

```typescript
import { useNavigate } from 'react-router-dom';

function ServiceCard({ service }: { service: Service }) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/dashboard/${service.id}`, {
      state: {
        service,
        from: 'listing'
      }
    });
  };
  
  return (
    <div onClick={handleViewDetails}>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
    </div>
  );
}
```

#### Navigation with Search Params

```typescript
import { useNavigate } from 'react-router-dom';

function FilterComponent() {
  const navigate = useNavigate();
  
  const handleFilterChange = (filter: string) => {
    navigate({
      pathname: '/listing',
      search: `?filter=${filter}&page=1`
    });
  };
  
  return (
    <select onChange={(e) => handleFilterChange(e.target.value)}>
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}
```

### Route Guards and Protection

#### Authentication Guard

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

#### Permission Guard

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

#### Route with Guards

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

### Hash Routing for µApps

#### Hash Router Setup

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

#### Hash Router with Shell Integration

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
  
  return (
    <OvhContainerRoutingSync routes={routes} />
  );
}
```

### Advanced Patterns

#### Route-based Code Splitting

```typescript
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy load components
const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard.page'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    element: (
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardPage />
      </Suspense>
    )
  }
];
```

#### Dynamic Route Loading

```typescript
import { lazyRouteConfig } from '@ovh-ux/manager-core';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
    loader: async ({ params }) => {
      // Pre-load data for the route
      const service = await fetchService(params.id);
      return { service };
    }
  }
];
```

#### Route Loaders

```typescript
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
    loader: async ({ params }) => {
      try {
        const service = await fetchService(params.id);
        return { service };
      } catch (error) {
        throw new Response('Service not found', { status: 404 });
      }
    }
  }
];
```

#### Using Route Loaders

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

### Error Handling

#### Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

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

#### Route Error Elements

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

### Best Practices

#### 1. Route Structure

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
        element: <DashboardPage />,
        children: [
          {
            id: 'dashboard-overview',
            path: 'overview',
            element: <OverviewTab />
          }
        ]
      }
    ]
  }
];

// ❌ WRONG: Flat route structure
const routes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/dashboard/overview', element: <OverviewTab /> }
];
```

#### 2. Lazy Loading

```typescript
// ✅ CORRECT: Use lazyRouteConfig for lazy loading
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page'))
  }
];

// ❌ WRONG: Direct import
import DashboardPage from '@/pages/dashboard/Dashboard.page';

const routes = [
  {
    id: 'dashboard',
    path: 'dashboard',
    element: <DashboardPage />
  }
];
```

#### 3. Route Metadata

```typescript
// ✅ CORRECT: Complete route metadata
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

// ❌ WRONG: Missing route metadata
const routes = [
  {
    id: 'dashboard',
    path: 'dashboard/:id',
    element: <DashboardPage />
  }
];
```

### Common Pitfalls

#### ❌ Wrong: Missing Route IDs

```typescript
// Don't forget route IDs
const routes = [
  {
    path: 'dashboard', // Missing id
    element: <DashboardPage />
  }
];
```

#### ✅ Correct: Include Route IDs

```typescript
const routes = [
  {
    id: 'dashboard', // Required for route identification
    path: 'dashboard',
    element: <DashboardPage />
  }
];
```

#### ❌ Wrong: Not Handling Loading States

```typescript
// Don't ignore loading states
function App() {
  return <RouterProvider router={router} />; // No error boundary
}
```

#### ✅ Correct: Handle All States

```typescript
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

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

### Performance Optimization Checklist

- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Route preloading (if applicable)
- [ ] Error boundaries prevent crashes
- [ ] Loading states provide feedback
- [ ] Memory usage optimized

---

## ⚖️ The Router's Moral

- **Consistent navigation** ensures predictable user experience across applications
- **Proper route structure** makes applications maintainable and scalable
- **Lazy loading** improves performance and reduces initial bundle size
- **Route metadata** enables tracking and breadcrumb functionality

**👉 Good routing is invisible to users but essential for application navigation.**
