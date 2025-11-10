---
title: Navigation Links Guide - Internal vs External Links
last_update: 2025-01-27
tags: [navigation, links, routing, react-router, shell, ovhcloud, manager, best-practices]
ai: true
---

# Navigation Links Guide - Internal vs External Links

## 🧭 Purpose

This guide explains when and how to create **internal links** (within the same React app) and **external links** (to other Manager apps or external websites) in OVHcloud Manager React applications.

## ⚙️ Context

In the OVHcloud Manager ecosystem:
- **Internal links** navigate within the same React application using React Router
- **External links** navigate to other Manager applications (AngularJS or React) or external websites
- The Manager uses a micro-frontend architecture where different apps communicate via the Shell

## 📘 Types of Links

### 1. Internal Links (Same App)

**Use when:** Navigating within the same React application

**How to implement:**
- Use React Router's `navigate()` hook for programmatic navigation
- Use React Router's `<Link>` component for declarative links
- Use relative paths (not absolute)

#### ✅ Good: Relative Navigation with `navigate()`

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to a route in the same app
    navigate('listing'); // Relative path
    // OR
    navigate('../dashboard/:serviceName', { 
      state: { serviceName: 'my-service' }
    });
  };
  
  return <button onClick={handleClick}>Go to Listing</button>;
}
```

#### ✅ Good: Declarative Links with `<Link>`

```typescript
import { Link } from 'react-router-dom';
import { urls } from '@/routes/Routes.constants';

function MyComponent() {
  return (
    <Link to="listing">Go to Listing</Link>
    // OR with full path
    <Link to={urls.dashboard.replace(':serviceName', 'my-service')}>
      Go to Dashboard
    </Link>
  );
}
```

#### ✅ Good: Nested Route Navigation

```typescript
// From: /dashboard/:serviceName/partition/:partitionName
// To: /dashboard/:serviceName/partition/:partitionName/edit-description

function PartitionDetailPage() {
  const navigate = useNavigate();
  const { serviceName, partitionName } = useParams();
  
  const handleEdit = () => {
    // Option 1: Relative path (recommended for nested routes)
    navigate('./edit-description');
    
    // Option 2: Full path with parameters
    navigate(
      urls.partitionEditDescription
        .replace(':serviceName', serviceName ?? '')
        .replace(':partitionName', partitionName ?? '')
    );
  };
  
  return <button onClick={handleEdit}>Edit</button>;
}
```

#### ❌ Avoid: Absolute Paths

```typescript
// ❌ Don't use absolute paths - they may not work in nested contexts
navigate('/bmc-nasha/listing'); // May break if app is mounted at different path
```

### 2. External Links (Other Manager Apps)

**Use when:** Navigating to another Manager application (e.g., billing, dedicated, etc.)

**How to implement:**
- Use `useNavigationGetUrl` hook to get the URL
- Use `<a href={url}>` for links
- Use `window.location.href` or `shell.navigation.navigateTo()` for programmatic navigation

#### ✅ Good: Using `useNavigationGetUrl` Hook

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { data: billingUrl, isLoading } = useNavigationGetUrl([
    'billing',                    // Target app name
    '#/billing/invoices',          // Path in target app
    {},                            // Query parameters
  ]);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <a href={billingUrl}>Go to Billing</a>
  );
}
```

#### ✅ Good: Programmatic Navigation to External App

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  
  const handleNavigate = async () => {
    await shell.navigation.navigateTo('billing', '/billing/history');
  };
  
  return <button onClick={handleNavigate}>Go to Billing</button>;
}
```

#### ✅ Good: External Link with URL Builder

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { serviceName } = useParams();
  
  // Navigate to old AngularJS app (e.g., dedicated/nasha)
  const { data: oldAppUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/edit-name`,
    {},
  ]);
  
  return (
    <a href={oldAppUrl}>Go to Old App</a>
  );
}
```

### 3. External Links (External Websites)

**Use when:** Navigating to external websites (docs, guides, etc.)

**How to implement:**
- Use regular `<a href>` with `target="_blank"` and `rel="noopener noreferrer"`
- No need for Shell navigation

#### ✅ Good: External Website Links

```typescript
function MyComponent() {
  const docsUrl = 'https://docs.ovh.com/fr/storage/nas/';
  
  return (
    <a 
      href={docsUrl} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      Documentation
    </a>
  );
}
```

#### ✅ Good: External Link with MUK Link Component

```typescript
import { Link } from '@ovh-ux/muk';

function MyComponent() {
  return (
    <Link 
      href="https://docs.ovh.com" 
      external
    >
      Documentation
    </Link>
  );
}
```

## 📋 Decision Tree

```
Is the link within the same React app?
├─ YES → Use React Router (navigate() or <Link>)
│
└─ NO → Is it another Manager app?
   ├─ YES → Use useNavigationGetUrl or shell.navigation.navigateTo()
   │
   └─ NO → Is it an external website?
      └─ YES → Use <a href> with target="_blank"
```

## 🔍 Examples by Use Case

### Example 1: Navigation within Same App

```typescript
// ✅ Internal navigation - same app
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/Routes.constants';

function DashboardPage() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  
  const handleViewPartitions = () => {
    // Navigate to partitions list in same app
    navigate(`../${urls.partitions.replace(':serviceName', serviceName ?? '')}`);
  };
  
  return <button onClick={handleViewPartitions}>View Partitions</button>;
}
```

### Example 2: Navigation to Another Manager App

```typescript
// ✅ External navigation - different Manager app
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { data: billingUrl } = useNavigationGetUrl([
    'billing',
    '#/billing/invoices',
    {},
  ]);
  
  return (
    <a href={billingUrl}>
      View Invoices
    </a>
  );
}
```

### Example 3: Navigation to Legacy AngularJS App

```typescript
// ✅ External navigation - legacy AngularJS app
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { serviceName } = useParams();
  
  // Link to old nasha module (AngularJS)
  const { data: oldNashaUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/edit-name`,
    {},
  ]);
  
  return (
    <a href={oldNashaUrl}>
      Edit Name (Legacy)
    </a>
  );
}
```

### Example 4: Navigation to External Documentation

```typescript
// ✅ External navigation - external website
function MyComponent() {
  const docsUrl = 'https://docs.ovh.com/fr/storage/nas/';
  
  return (
    <a 
      href={docsUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      Documentation
    </a>
  );
}
```

## 🚨 Common Mistakes

### ❌ Mistake 1: Using `window.location.href` for Internal Navigation

```typescript
// ❌ Wrong: Causes full page reload
const handleClick = () => {
  window.location.href = '/bmc-nasha/listing';
};

// ✅ Correct: Use React Router
const handleClick = () => {
  navigate('listing');
};
```

### ❌ Mistake 2: Using React Router for External Apps

```typescript
// ❌ Wrong: React Router can't navigate to other apps
const handleClick = () => {
  navigate('/billing/invoices'); // Won't work - billing is a different app
};

// ✅ Correct: Use useNavigationGetUrl
const { data: billingUrl } = useNavigationGetUrl(['billing', '#/billing/invoices', {}]);
// Then use <a href={billingUrl}>
```

### ❌ Mistake 3: Not Using Relative Paths

```typescript
// ❌ Wrong: Absolute path may break in nested routes
navigate('/bmc-nasha/dashboard/my-service');

// ✅ Correct: Use relative paths
navigate('../dashboard/:serviceName'.replace(':serviceName', 'my-service'));
// OR use route constants
navigate(urls.dashboard.replace(':serviceName', 'my-service'));
```

### ❌ Mistake 4: Missing External Link Attributes

```typescript
// ❌ Wrong: Missing security attributes
<a href="https://external-site.com" target="_blank">
  External Link
</a>

// ✅ Correct: Include security attributes
<a 
  href="https://external-site.com" 
  target="_blank"
  rel="noopener noreferrer"
>
  External Link
</a>
```

## ✅ Best Practices Summary

### Internal Links (Same App)
1. ✅ Use `navigate()` for programmatic navigation
2. ✅ Use `<Link>` for declarative links
3. ✅ Always use relative paths
4. ✅ Use route constants from `Routes.constants.ts`
5. ✅ Avoid `window.location.href` (causes full page reload)

### External Links (Other Manager Apps)
1. ✅ Use `useNavigationGetUrl` hook
2. ✅ Use `<a href={url}>` for links
3. ✅ Use `shell.navigation.navigateTo()` for programmatic navigation
4. ✅ Handle loading states
5. ✅ Cache URLs with `staleTime` option

### External Links (External Websites)
1. ✅ Always use `target="_blank"` for new tabs
2. ✅ Always include `rel="noopener noreferrer"` for security
3. ✅ Use MUK `Link` component with `external` prop when available
4. ✅ Validate URLs before using

## 🔧 Debugging Tips

### Check Current Route
```typescript
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Current pathname:', location.pathname);
    console.log('Current search:', location.search);
  }, [location]);
}
```

### Verify External URL Generation
```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { data: url, isLoading, error } = useNavigationGetUrl([
    'billing',
    '#/billing/invoices',
    {},
  ]);
  
  useEffect(() => {
    if (url) {
      console.log('Generated URL:', url);
    }
    if (error) {
      console.error('URL generation error:', error);
    }
  }, [url, error]);
}
```

## 📚 References

- [Routing Best Practices](./routing-best-practices.md)
- [Manager React Shell Client](../20-dependencies/manager-react-shell-client.md)
- [React Router DOM](../20-dependencies/react-router-dom.md)
- [React Router Documentation](https://reactrouter.com/)

## ⚖️ The Navigation Links Moral

- **Internal links** = React Router (`navigate()` or `<Link>`)
- **External Manager apps** = `useNavigationGetUrl` or `shell.navigation`
- **External websites** = `<a href>` with security attributes
- **Always use relative paths** for internal navigation
- **Always handle loading states** for external URLs

**👉 Good navigation is seamless for users and correctly typed for developers.**

