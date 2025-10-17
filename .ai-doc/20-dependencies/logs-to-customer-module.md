---
title: Logs to Customer Module Integration
last_update: 2025-01-27
tags: [logs, customer, module, integration, uapp, ovhcloud, manager]
ai: true
---

# Logs to Customer Module Integration

> **📦 Version:** `@ovh-ux/logs-to-customer@^1.7.12`

## 🧭 Purpose

This document explains how to integrate the "Logs to Customer" module into OVHcloud Manager applications. The module provides essential functionality for log management including live tail viewing and CRUD operations for data-stream subscriptions.

The module enables product teams to add comprehensive logging capabilities to their applications with minimal configuration, following OVHcloud's standardized approach to log management and customer data access.

## ⚙️ Context

The Logs to Customer module is designed for:
- **Product pages** that need log viewing capabilities
- **Live log tailing** for real-time monitoring
- **Data-stream subscription management** (create, read, update, delete)
- **IAM integration** for secure access control
- **Standardized tracking** for analytics and monitoring

This module is part of the OVHcloud Manager ecosystem and follows established patterns for:
- **Module integration** in UApps
- **API versioning** and endpoint configuration
- **IAM action mapping** for security
- **Route configuration** with React Router
- **Tailwind CSS** styling integration

## 🔗 References

- [Manager Architecture Overview](../10-architecture/manager-architecture.md)
- [UApp Integration Guide](../10-architecture/uapp-integration.md)
- [IAM Integration Patterns](../10-architecture/iam-integration.md)
- [API Configuration Standards](../10-architecture/api-configuration.md)
- [React Router Configuration](../10-architecture/react-router-setup.md)
- [Tailwind CSS Integration](../10-architecture/tailwind-integration.md)

## 📘 Guidelines / Implementation

### Package Installation

#### 1. Add the Package to Your UApp

```json
{
  "dependencies": {
    "@ovh-ux/logs-to-customer": "^1.7.12"
  }
}
```

#### 2. Update Tailwind Configuration

Add the module to your Tailwind content configuration to generate necessary CSS classes:

```javascript
// tailwind.config.mjs
import path from 'path';

export default {
  // ... existing configuration
  content: [
    // ... existing content paths
    path.join(
      path.dirname(require.resolve('@ovh-ux/logs-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
```

### Module Integration

#### 1. Create Logs Page Component

```typescript
// pages/dashboard/logs/Logs.page.tsx
import React from 'react';
import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';

interface LogsPageProps {
  product: {
    id: string;
    iam: {
      urn: string;
    };
  };
}

export default function LogsPage({ product }: LogsPageProps) {
  return (
    <LogsToCustomerModule
      // Specify the API version for your product's logs endpoints
      logApiVersion="v2"
      
      // Specify the endpoint URLs regardless of the HTTP method
      logApiUrls={{
        logKind: `/path/to/${product.id}/log/kind`,
        logSubscription: `/path/to/${product.id}/log/subscription`,
        logUrl: `/path/to/${product.id}/log/url`,
      }}
      
      // Specify the IAM actions related to logs API endpoints
      logIamActions={{
        postSubscription: ['product:apiovh:log/subscription/create'],
        deleteSubscription: ['product:apiovh:log/subscription/delete'],
      }}
      
      // Specify the URN of your product
      resourceURN={product.iam.urn}
      
      // Optional: specify a string to add to the end of automatically generated tracking tags
      trackingOptions={{ trackingSuffix: 'myProduct' }}
    />
  );
}
```

#### 2. Configure UApp Routes

Set up routing to handle all logs-related navigation:

```typescript
// routes/index.ts
import { logsRoutes } from '@ovh-ux/logs-to-customer';
import { lazyRouteConfig } from '@ovh-ux/manager-core';

export default [
  // ... existing routes
  {
    // Add the `*` to let React Router know that all sub-routes will be handled by the children config
    path: `path/to/product/log/page/*`,
    ...lazyRouteConfig(() => import('@/pages/dashboard/logs/Logs.page')),
    // Use the module routes here
    children: [...logsRoutes],
  },
  // ... other routes
];
```

### Advanced Configuration

#### 1. Custom API Endpoints

```typescript
// Example with custom API endpoints
export default function LogsPage({ product }: LogsPageProps) {
  return (
    <LogsToCustomerModule
      logApiVersion="v2"
      logApiUrls={{
        // Custom endpoints for your product
        logKind: `/engine/v2/project/${product.id}/log/kind`,
        logSubscription: `/engine/v2/project/${product.id}/log/subscription`,
        logUrl: `/engine/v2/project/${product.id}/log/url`,
      }}
      logIamActions={{
        postSubscription: ['engine:apiovh:log/subscription/create'],
        deleteSubscription: ['engine:apiovh:log/subscription/delete'],
        getSubscription: ['engine:apiovh:log/subscription/read'],
        putSubscription: ['engine:apiovh:log/subscription/update'],
      }}
      resourceURN={product.iam.urn}
      trackingOptions={{ trackingSuffix: 'engine' }}
    />
  );
}
```

#### 2. Multiple Product Support

```typescript
// Example with multiple products
export default function LogsPage({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>Logs for {product.name}</h2>
          <LogsToCustomerModule
            logApiVersion="v2"
            logApiUrls={{
              logKind: `/products/${product.id}/log/kind`,
              logSubscription: `/products/${product.id}/log/subscription`,
              logUrl: `/products/${product.id}/log/url`,
            }}
            logIamActions={{
              postSubscription: [`product:apiovh:${product.id}:log/subscription/create`],
              deleteSubscription: [`product:apiovh:${product.id}:log/subscription/delete`],
            }}
            resourceURN={product.iam.urn}
            trackingOptions={{ trackingSuffix: product.id }}
          />
        </div>
      ))}
    </div>
  );
}
```

#### 3. Conditional Rendering

```typescript
// Example with conditional rendering based on permissions
export default function LogsPage({ product, userPermissions }: LogsPageProps) {
  const hasLogAccess = userPermissions.includes('logs:read');
  
  if (!hasLogAccess) {
    return <div>Access denied</div>;
  }

  return (
    <LogsToCustomerModule
      logApiVersion="v2"
      logApiUrls={{
        logKind: `/path/to/${product.id}/log/kind`,
        logSubscription: `/path/to/${product.id}/log/subscription`,
        logUrl: `/path/to/${product.id}/log/url`,
      }}
      logIamActions={{
        postSubscription: ['product:apiovh:log/subscription/create'],
        deleteSubscription: ['product:apiovh:log/subscription/delete'],
      }}
      resourceURN={product.iam.urn}
      trackingOptions={{ trackingSuffix: 'myProduct' }}
    />
  );
}
```

### Error Handling

#### 1. API Error Handling

```typescript
// Example with error handling
export default function LogsPage({ product }: LogsPageProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: Error) => {
    setError(error.message);
    // Log error for monitoring
    console.error('Logs module error:', error);
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger">
          Error loading logs: {error}
        </div>
      )}
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: `/path/to/${product.id}/log/kind`,
          logSubscription: `/path/to/${product.id}/log/subscription`,
          logUrl: `/path/to/${product.id}/log/url`,
        }}
        logIamActions={{
          postSubscription: ['product:apiovh:log/subscription/create'],
          deleteSubscription: ['product:apiovh:log/subscription/delete'],
        }}
        resourceURN={product.iam.urn}
        trackingOptions={{ trackingSuffix: 'myProduct' }}
        onError={handleError}
      />
    </div>
  );
}
```

#### 2. Loading States

```typescript
// Example with loading states
export default function LogsPage({ product }: LogsPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading && (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading logs...</span>
        </div>
      )}
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: `/path/to/${product.id}/log/kind`,
          logSubscription: `/path/to/${product.id}/log/subscription`,
          logUrl: `/path/to/${product.id}/log/url`,
        }}
        logIamActions={{
          postSubscription: ['product:apiovh:log/subscription/create'],
          deleteSubscription: ['product:apiovh:log/subscription/delete'],
        }}
        resourceURN={product.iam.urn}
        trackingOptions={{ trackingSuffix: 'myProduct' }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
```

### Testing

#### 1. Unit Tests

```typescript
// Logs.page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LogsPage from './Logs.page';

// Mock the module
vi.mock('@ovh-ux/logs-to-customer', () => ({
  LogsToCustomerModule: ({ resourceURN, logApiVersion }: any) => (
    <div data-testid="logs-module">
      <div>URN: {resourceURN}</div>
      <div>API Version: {logApiVersion}</div>
    </div>
  ),
}));

describe('LogsPage', () => {
  const mockProduct = {
    id: 'test-product',
    iam: {
      urn: 'urn:v1:eu:product:test-product',
    },
  };

  it('renders logs module with correct props', () => {
    render(<LogsPage product={mockProduct} />);
    
    expect(screen.getByTestId('logs-module')).toBeInTheDocument();
    expect(screen.getByText('URN: urn:v1:eu:product:test-product')).toBeInTheDocument();
    expect(screen.getByText('API Version: v2')).toBeInTheDocument();
  });

  it('handles missing product gracefully', () => {
    render(<LogsPage product={null} />);
    // Test error handling
  });
});
```

#### 2. Integration Tests

```typescript
// Logs.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LogsPage from './Logs.page';

describe('LogsPage Integration', () => {
  it('integrates with routing correctly', async () => {
    render(
      <BrowserRouter>
        <LogsPage product={mockProduct} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('logs-module')).toBeInTheDocument();
    });
  });
});
```

### Performance Optimization

#### 1. Lazy Loading

```typescript
// Lazy load the logs module
import { lazy, Suspense } from 'react';

const LogsToCustomerModule = lazy(() => 
  import('@ovh-ux/logs-to-customer').then(module => ({
    default: module.LogsToCustomerModule
  }))
);

export default function LogsPage({ product }: LogsPageProps) {
  return (
    <Suspense fallback={<div>Loading logs...</div>}>
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: `/path/to/${product.id}/log/kind`,
          logSubscription: `/path/to/${product.id}/log/subscription`,
          logUrl: `/path/to/${product.id}/log/url`,
        }}
        logIamActions={{
          postSubscription: ['product:apiovh:log/subscription/create'],
          deleteSubscription: ['product:apiovh:log/subscription/delete'],
        }}
        resourceURN={product.iam.urn}
        trackingOptions={{ trackingSuffix: 'myProduct' }}
      />
    </Suspense>
  );
}
```

#### 2. Memoization

```typescript
// Memoize expensive operations
import { useMemo } from 'react';

export default function LogsPage({ product }: LogsPageProps) {
  const logApiUrls = useMemo(() => ({
    logKind: `/path/to/${product.id}/log/kind`,
    logSubscription: `/path/to/${product.id}/log/subscription`,
    logUrl: `/path/to/${product.id}/log/url`,
  }), [product.id]);

  const logIamActions = useMemo(() => ({
    postSubscription: ['product:apiovh:log/subscription/create'],
    deleteSubscription: ['product:apiovh:log/subscription/delete'],
  }), []);

  return (
    <LogsToCustomerModule
      logApiVersion="v2"
      logApiUrls={logApiUrls}
      logIamActions={logIamActions}
      resourceURN={product.iam.urn}
      trackingOptions={{ trackingSuffix: 'myProduct' }}
    />
  );
}
```

---

## 🤖 AI Development Guidelines

### Essential Integration Rules for AI Code Generation

1. **Always configure Tailwind**: Include the module in Tailwind content configuration
2. **Use correct API versioning**: Specify the appropriate API version for your product
3. **Map IAM actions correctly**: Ensure all required IAM actions are properly configured
4. **Configure routes with wildcard**: Use `*` in route path to handle sub-routes
5. **Include resource URN**: Always provide the product's IAM URN for security
6. **Add tracking suffix**: Include product-specific tracking for analytics
7. **Handle errors gracefully**: Implement proper error handling and loading states
8. **Test integration**: Include unit and integration tests for the module
9. **Optimize performance**: Use lazy loading and memoization where appropriate
10. **Follow naming conventions**: Use consistent naming for endpoints and actions

### Module Integration Checklist

- [ ] Package added to dependencies
- [ ] Tailwind configuration updated
- [ ] Logs page component created
- [ ] API endpoints configured correctly
- [ ] IAM actions mapped properly
- [ ] Routes configured with wildcard
- [ ] Resource URN provided
- [ ] Tracking options configured
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Tests written and passing
- [ ] Performance optimizations applied

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Missing Tailwind configuration
export default {
  content: [
    // Missing logs-to-customer module
  ],
};

// ❌ WRONG: Incorrect route configuration
{
  path: `path/to/product/log/page`, // Missing wildcard
  children: [...logsRoutes],
}

// ❌ WRONG: Missing IAM actions
<LogsToCustomerModule
  logApiUrls={{...}}
  // Missing logIamActions
  resourceURN={product.iam.urn}
/>

// ❌ WRONG: Hardcoded endpoints
logApiUrls={{
  logKind: '/hardcoded/path', // Should use product.id
}}
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Complete Tailwind configuration
export default {
  content: [
    path.join(
      path.dirname(require.resolve('@ovh-ux/logs-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};

// ✅ CORRECT: Proper route configuration
{
  path: `path/to/product/log/page/*`, // With wildcard
  children: [...logsRoutes],
}

// ✅ CORRECT: Complete IAM configuration
<LogsToCustomerModule
  logApiUrls={{
    logKind: `/path/to/${product.id}/log/kind`,
    logSubscription: `/path/to/${product.id}/log/subscription`,
    logUrl: `/path/to/${product.id}/log/url`,
  }}
  logIamActions={{
    postSubscription: ['product:apiovh:log/subscription/create'],
    deleteSubscription: ['product:apiovh:log/subscription/delete'],
  }}
  resourceURN={product.iam.urn}
  trackingOptions={{ trackingSuffix: 'myProduct' }}
/>

// ✅ CORRECT: Dynamic endpoints
logApiUrls={{
  logKind: `/path/to/${product.id}/log/kind`, // Uses product.id
}}
```

---

## ⚖️ The Logs Module's Moral

- **Standardized integration** ensures consistent log management across all products
- **Proper configuration** is essential for security and functionality
- **IAM integration** provides secure access control for log operations
- **Route configuration** enables seamless navigation within the module

**👉 Good logs integration is invisible to users but essential for monitoring and debugging.**
