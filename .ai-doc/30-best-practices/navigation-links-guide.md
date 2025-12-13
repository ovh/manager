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
    // Navigate to a child route (relative path)
    navigate('listing'); // Goes to ./listing
    
    // Navigate to parent route
    navigate('..'); // Goes up one level
    
    // Navigate to sibling route
    navigate('../dashboard/my-service'); // Goes up then to sibling
    
    // Navigate to current route (refresh)
    navigate('.'); // Stays on current route
  };
  
  return <button onClick={handleClick}>Go to Listing</button>;
}
```

#### ✅ Good: Declarative Links with `<Link>`

```typescript
import { Link } from 'react-router-dom';

function MyComponent() {
  return (
    <Link to="listing">Go to Listing</Link>
  );
}
```

**Note:** Prefer relative paths with `<Link>` for internal navigation. Avoid using route constants with `.replace()` for internal links.

#### ✅ Good: Nested Route Navigation

```typescript
// From: /dashboard/:serviceName/partition/:partitionName
// To: /dashboard/:serviceName/partition/:partitionName/edit-description

function PartitionDetailPage() {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    // ✅ BEST: Use relative path (recommended for nested routes)
    navigate('edit-description'); // Child route
    
    // ✅ GOOD: Navigate back to parent
    navigate('..', { replace: true }); // Parent route with replace
    
    // ❌ AVOID: Absolute path with replace() - creates duplication issues
    // navigate(`../${urls.partitionDetail.replace(...)}`); // May cause route duplication
  };
  
  return <button onClick={handleEdit}>Edit</button>;
}
```

**Key Points:**
- Use relative paths (`'edit-description'`, `'..'`, `'.'`) instead of absolute paths
- Use `replace: true` when closing modals to avoid adding history entries
- Relative paths automatically resolve based on current route context
- Avoid using `urls.xxx.replace()` for internal navigation - use relative paths instead

#### ❌ Avoid: Absolute Paths with Route Constants

```typescript
// ❌ Don't use absolute paths with replace() - causes route duplication
// From: /dashboard/zpool-123
// This creates: /dashboard/zpool-123/dashboard/zpool-123 (duplication!)
navigate(`../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`);

// ✅ Correct: Use relative path
navigate('..', { replace: true }); // Goes to parent route

// ❌ Don't use absolute paths - they may not work in nested contexts
navigate('/bmc-nasha/listing'); // May break if app is mounted at different path

// ✅ Correct: Use relative path
navigate('listing'); // Relative to current route
```

### 2. External Links (Other Manager Apps)

**Use when:** Navigating to another Manager application (e.g., billing, dedicated, etc.)

**How to implement:**
- Use `useNavigationGetUrl` hook (recommended) or `useEffect` + `shell.navigation.getURL()` pattern
- Use `<a href={url}>` for links
- Use `shell.navigation.navigateTo()` for programmatic navigation

#### Pattern 1: Using `useNavigationGetUrl` Hook (Recommended)

**When to use:** For links in JSX that need React Query caching and loading states.

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { data: billingUrl, isLoading } = useNavigationGetUrl([
    'billing',                    // Target app name
    '#/billing/invoices',          // Path in target app
    {},                            // Query parameters
  ], {
    staleTime: 5 * 60 * 1000,     // Cache for 5 minutes
  ]);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <a href={billingUrl}>Go to Billing</a>
  );
}
```

**Benefits:**
- Automatic caching with React Query
- Built-in loading/error states
- Automatic refetch management

#### Pattern 2: Using `useEffect` + `shell.navigation.getURL()` (Alternative)

**When to use:** When you need more control or when creating custom hooks (as used in pci-project).

```typescript
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useParams } from 'react-router-dom';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  const { projectId } = useParams();
  const [projectUrl, setProjectUrl] = useState('');
  
  useEffect(() => {
    if (projectId) {
      shell.navigation
        .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
        .then((url) => setProjectUrl(url as string));
    }
  }, [shell, projectId]);
  
  return (
    <a href={projectUrl}>Go to Project</a>
  );
}
```

**Benefits:**
- More control over state management
- Useful for custom hooks (e.g., `usePciUrl`, `useServerUrl`)
- No React Query dependency

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

#### ✅ Good: Navigation to Legacy AngularJS App

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { serviceName } = useParams();
  
  // Link to old AngularJS app (e.g., dedicated/nasha)
  const { data: oldAppUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/edit-name`,
    {},
  ]);
  
  return (
    <a href={oldAppUrl}>Edit Name (Legacy)</a>
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

## 🔍 Real-World Examples

### Example: Navigation in Nested Routes

```typescript
// Route structure:
// /dashboard/:serviceName
//   ├─ /partitions
//   └─ /partition/:partitionName
//       └─ /edit-description

function PartitionDetailPage() {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate('edit-description'); // Child route
  };
  
  const handleCloseModal = () => {
    navigate('..', { replace: true }); // Parent route, removes from history
  };
  
  return <button onClick={handleEdit}>Edit</button>;
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

### ❌ Mistake 3: Using Absolute Paths with Route Constants

```typescript
// ❌ Wrong: Absolute path with replace() causes route duplication
// Current: /dashboard/zpool-123
// Result: /dashboard/zpool-123/dashboard/zpool-123 (duplication!)
navigate(`../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`);

// ❌ Wrong: Absolute path may break in nested routes
navigate('/bmc-nasha/dashboard/my-service');

// ✅ Correct: Use relative paths
navigate('..', { replace: true }); // Parent route
navigate('partitions'); // Child route
navigate('.'); // Current route
navigate('../sibling'); // Sibling route
```

### ❌ Mistake 4: Not Using `replace: true` for Modal Closures

```typescript
// ❌ Wrong: Adds modal route to history
const handleCloseModal = () => {
  navigate('..'); // User can go back to modal
};

// ✅ Correct: Replace history entry when closing modal
const handleCloseModal = () => {
  navigate('..', { replace: true }); // Removes modal from history
};
```

### ❌ Mistake 5: Missing External Link Attributes

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
3. ✅ **Always use relative paths** (`'child'`, `'..'`, `'.'`)
4. ✅ Use `replace: true` when closing modals to avoid history pollution
5. ✅ Avoid `window.location.href` (causes full page reload)
6. ✅ Avoid using `urls.xxx.replace()` for internal navigation - use relative paths
7. ✅ Relative paths automatically resolve based on current route context

### External Links (Other Manager Apps)
1. ✅ Use `useNavigationGetUrl` hook (recommended) or `useEffect` + `shell.navigation.getURL()` pattern
2. ✅ Use `<a href={url}>` for links
3. ✅ Use `shell.navigation.navigateTo()` for programmatic navigation
4. ✅ Handle loading states
5. ✅ Cache URLs with `staleTime` option when using `useNavigationGetUrl`

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
  // Access location.pathname and location.search for debugging
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

## 📝 Quick Reference: Relative Path Patterns

```typescript
// Current route: /dashboard/zpool-123/partition/my-partition

navigate('edit-description');     // → /dashboard/zpool-123/partition/my-partition/edit-description
navigate('..');                   // → /dashboard/zpool-123/partition/my-partition (parent)
navigate('../accesses');          // → /dashboard/zpool-123/partition/my-partition/accesses
navigate('../../partitions');     // → /dashboard/zpool-123/partitions
navigate('.');                    // → /dashboard/zpool-123/partition/my-partition (current)
```

**Common Patterns:**
- `navigate('child')` - Navigate to child route
- `navigate('..')` - Navigate to parent route
- `navigate('..', { replace: true })` - Navigate to parent and replace history (for modal closures)
- `navigate('.')` - Stay on current route (refresh)
- `navigate('../sibling')` - Navigate to sibling route

