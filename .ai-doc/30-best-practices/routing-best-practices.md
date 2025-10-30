---
title: Routing Best Practices
last_update: 2025-01-27
tags: [routing, react, navigation, ovhcloud, manager, best-practices]
ai: true
---

# Routing Best Practices

## 🧭 Purpose

This document provides best practices for routing configuration in OVHcloud Manager React applications, based on lessons learned from real migrations and common pitfalls.

## ⚙️ Context

This document addresses common routing issues encountered during AngularJS to React migrations in the OVHcloud Manager ecosystem, providing solutions and prevention strategies.

## 📘 Common Routing Issues

### 1. Double Slug in URLs

#### ❌ Problem
URL becomes `/app-name/app-name/listing` instead of `/app-name/listing`

#### 🔍 Root Cause
Incorrect `appSlug` configuration in `APP_FEATURES`

#### ✅ Solution
```typescript
// App.constants.ts
export const APP_FEATURES = {
  appSlug: '', // ⚠️ IMPORTANT: Leave empty, not appName
  // ... other configs
} as const;
```

#### 🧪 Verification
```typescript
// Check that getRoot() returns /app-name, not /app-name/app-name
console.log(getRoot()); // Should be "/bmc-nasha", not "/bmc-nasha/bmc-nasha"
```

### 2. Absolute vs Relative Navigation

#### ❌ Problem
`navigate('/listing')` doesn't work in nested context

#### 🔍 Root Cause
Using absolute navigation in relative context

#### ✅ Solution
```typescript
// ✅ Good: Relative navigation
navigate('listing', { replace: true });

// ❌ Avoid: Absolute navigation
navigate('/listing', { replace: true });
```

#### 🧪 Verification
```typescript
// Test navigation from different contexts
const handleNavigation = () => {
  navigate('listing'); // Works from any nested route
  // navigate('/listing'); // May not work from nested routes
};
```

### 3. Complex SmartRedirect

#### ❌ Problem
Complex conditional redirection logic causes issues

#### 🔍 Root Cause
Overly complex redirection logic

#### ✅ Solution
Use listing page as home page with empty state handling

```typescript
// ✅ Good: Listing page as home
<Route index Component={ListingPage} />

// ❌ Avoid: Complex SmartRedirect
<Route index element={<SmartRedirectPage />} />
```

#### 🧪 Verification
```typescript
// Listing page should handle empty state gracefully
export default function ListingPage() {
  const { data, isLoading } = useServices();
  
  if (!isLoading && data?.items.length === 0) {
    return (
      <div>
        <h2>No services found</h2>
        <button onClick={() => navigate('../order')}>
          Order Service
        </button>
      </div>
    );
  }
  
  return <Datagrid items={data?.items || []} />;
}
```

## 📋 Recommended Routing Configuration

### Route Structure
```typescript
// routes/Routes.tsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/muk';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));

export default (
  <>
    {/* Redirect container "/" → flavor-specific root */}
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Default landing → main listing page */}
      <Route
        index
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Alternative listing route */}
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

      {/* Other routes... */}
    </Route>
  </>
);
```

### Constants Configuration
```typescript
// App.constants.ts
export const APP_FEATURES = {
  appSlug: '', // ⚠️ IMPORTANT: Leave empty
  // ... other configs
} as const;

// Routes.constants.ts
export const urls = {
  root: getRoot(), // Returns /app-name
  listing: 'listing', // Relative route
} as const;
```

### Navigation Hooks
```typescript
// hooks/useNavigation.ts
import { useNavigate } from 'react-router-dom';

export function useAppNavigation() {
  const navigate = useNavigate();
  
  const navigateToListing = () => {
    navigate('listing', { replace: true });
  };
  
  const navigateToOrder = () => {
    navigate('../order', { replace: true });
  };
  
  return {
    navigateToListing,
    navigateToOrder,
  };
}
```

## 🧪 Testing Routing

### Unit Tests
```typescript
// Routes.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

describe('Routes', () => {
  it('should redirect / to /app-name', () => {
    render(
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
    
    // Test redirect behavior
  });
  
  it('should render listing page on /app-name', () => {
    render(
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Listing')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// Navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAppNavigation } from './hooks/useNavigation';

describe('Navigation', () => {
  it('should navigate to listing page', () => {
    render(
      <BrowserRouter>
        <ComponentWithNavigation />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Go to Listing'));
    
    expect(window.location.pathname).toBe('/app-name/listing');
  });
});
```

## 📋 Migration Checklist

### Pre-Migration
- [ ] Audit existing AngularJS routing
- [ ] Identify main pages and their URLs
- [ ] Document navigation patterns
- [ ] Plan route structure

### During Migration
- [ ] Configure `appSlug: ''` in `APP_FEATURES`
- [ ] Use relative navigation (`navigate('route')`)
- [ ] Set listing page as home page (index route)
- [ ] Add ErrorBoundary on root route
- [ ] Configure tracking on all routes
- [ ] Use lazy loading for components
- [ ] Test navigation from different contexts

### Post-Migration
- [ ] Verify all URLs work correctly
- [ ] Test navigation between pages
- [ ] Check tracking is working
- [ ] Verify error handling
- [ ] Test in different browsers
- [ ] Performance testing

## 🚨 Common Anti-Patterns

### ❌ Wrong: Double Slug Configuration
```typescript
// Don't do this
export const APP_FEATURES = {
  appSlug: 'bmc-nasha', // Causes double slug
  // ...
};
```

### ❌ Wrong: Absolute Navigation
```typescript
// Don't do this
const handleNavigation = () => {
  navigate('/listing'); // May not work in nested context
};
```

### ❌ Wrong: Complex SmartRedirect
```typescript
// Don't do this
<Route index element={<SmartRedirectPage />} />
```

### ❌ Wrong: Missing Error Handling
```typescript
// Don't do this
<Route
  path={urls.root}
  Component={MainLayoutPage}
  // Missing errorElement
>
```

## ✅ Best Practices

### ✅ Correct: Empty App Slug
```typescript
export const APP_FEATURES = {
  appSlug: '', // Correct
  // ...
};
```

### ✅ Correct: Relative Navigation
```typescript
const handleNavigation = () => {
  navigate('listing', { replace: true }); // Correct
};
```

### ✅ Correct: Listing as Home
```typescript
<Route index Component={ListingPage} />
```

### ✅ Correct: Error Handling
```typescript
<Route
  path={urls.root}
  Component={MainLayoutPage}
  errorElement={<ErrorBoundary />}
>
```

## 🔧 Debugging Tips

### Check URL Structure
```typescript
// Add to your component for debugging
useEffect(() => {
  console.log('Current pathname:', window.location.pathname);
  console.log('Expected root:', urls.root);
}, []);
```

### Verify Navigation
```typescript
// Test navigation in different contexts
const testNavigation = () => {
  console.log('Before navigation:', window.location.pathname);
  navigate('listing');
  console.log('After navigation:', window.location.pathname);
};
```

### Check Route Configuration
```typescript
// Verify route constants
console.log('URLs:', urls);
console.log('Root:', getRoot());
```

## 📚 References

- [React Router Documentation](https://reactrouter.com/)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [US Migration Guide](../50-migration-angular/us-migration-guide.md)
- [React uApp Blueprint](../10-architecture/react-uapp-blueprint.md)

## ⚖️ The Routing's Moral

- **Simple routing** is better than complex routing
- **Relative navigation** works in all contexts
- **Empty state handling** is better than complex redirects
- **Error boundaries** prevent application crashes

**👉 Good routing is invisible to users but essential for application navigation.**
