---
title: Manager React Core Application
version: 0.12.8
last_update: 2025-11-21
tags: [core, application, react, ovhcloud, manager, hooks, routing, tracking]
ai: true
---

# Manager React Core Application

> **📦 Version:** `@ovh-ux/manager-react-core-application@^0.12.8`

## 🧭 Purpose

The **Manager React Core Application** package provides essential hooks, utilities, and components for building React applications in the OVHcloud Manager ecosystem. It includes authentication, environment management, logging, navigation, routing, and tracking capabilities.

## ⚙️ Context

Manager React Core Application is designed for:
- **Application initialization** and context setup
- **Authentication management** with user roles and permissions
- **Environment configuration** and region management
- **Logging and debugging** capabilities
- **Navigation and routing** integration
- **Tracking implementation** with AT Internet
- **Query client configuration** for data fetching

## 🔗 References

- [Manager React Shell Client](./manager-react-shell-client.md)
- [Manager Core API](./manager-core-api.md)
- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)

## 📘 Quick Start

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-react-core-application": "^0.12.8"
  }
}
```

### Application Initialization

```typescript
// main.tsx
import { startApplication } from '@ovh-ux/manager-react-core-application';
startApplication('bmc-nasha');
```

```typescript
// App.tsx
import { OvhApplication } from '@ovh-ux/manager-react-core-application';

export default function App() {
  return (
    <OvhApplication name="bmc-nasha">
      <RouterProvider router={router} />
    </OvhApplication>
  );
}
```

### Complete Setup

```typescript
import { 
  OvhApplication, 
  queryClient 
} from '@ovh-ux/manager-react-core-application';
import { QueryClientProvider } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function App() {
  return (
    <OvhApplication name="bmc-nasha">
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider value={shellContext}>
          <RouterProvider router={router} />
        </ShellContext.Provider>
      </QueryClientProvider>
    </OvhApplication>
  );
}
```

## 📦 Hooks & Components Reference

| Hook/Component | Returns/Props | Usage |
|----------------|---------------|-------|
| **useAuthentication** | `{ nichandle, subsidiary, roles(), isTrusted(), login(), logout() }` | Authentication management |
| **useEnvironment** | `Environment` | Environment properties (region, universe, user) |
| **useLogger** | `{ info, warn, error, debug }` | Logging operations |
| **useNavigation** | `Navigation` | Navigation methods |
| **OvhContext** | `{ shell, environment }` | Application context |
| **OvhApplication** | `{ name: string, children }` | Application wrapper |
| **OvhTracking** | `{ shell }` | Automatic tracking component |
| **OvhContainerRoutingSync** | `{ routes }` | Route synchronization with shell |
| **queryClient** | `QueryClient` | Pre-configured React Query client |

## 🔐 Authentication

### useAuthentication Hook

```typescript
import { useAuthentication } from '@ovh-ux/manager-react-core-application';

function AuthenticationComponent() {
  const auth = useAuthentication();
  
  const nichandle = auth.nichandle;
  const subsidiary = auth.subsidiary;
  const roles = auth.roles();
  const isTrusted = auth.isTrusted();
  
  return (
    <div>
      <p>User: {nichandle}</p>
      <p>Subsidiary: {subsidiary}</p>
      <p>Roles: {roles.join(', ')}</p>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}
```

### Protected Route

```typescript
import { useAuthentication } from '@ovh-ux/manager-react-core-application';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthentication();
  
  if (!auth.nichandle) {
    auth.login();
    return <div>Redirecting to login...</div>;
  }
  
  return <>{children}</>;
}
```

**Authentication API:**
- `nichandle: string | null` - User identifier
- `subsidiary: string` - User subsidiary
- `roles(): string[]` - User roles
- `isTrusted(): boolean` - Trust status
- `login(): void` - Login action
- `logout(): void` - Logout action

## 🌍 Environment

### useEnvironment Hook

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-core-application';

function EnvironmentComponent() {
  const env = useEnvironment();
  
  if (!env) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Application: {env.getApplicationName()}</p>
      <p>Region: {env.getRegion()}</p>
      <p>Universe: {env.getUniverse()}</p>
      <p>User: {env.getUser().nichandle}</p>
    </div>
  );
}
```

**Environment API:**
- `getApplicationName(): string`
- `getRegion(): string`
- `getUniverse(): string`
- `getUser(): User`
- `getUserLocale(): string`

## 📝 Logging

### useLogger Hook

```typescript
import { useLogger } from '@ovh-ux/manager-react-core-application';

function LoggingComponent() {
  const logger = useLogger();
  
  const handleAction = () => {
    logger.info('Action performed', { action: 'create' });
    logger.warn('Warning message', { context: 'validation' });
    logger.error('Error occurred', new Error('Something went wrong'));
    logger.debug('Debug information', { state: 'active' });
  };
  
  return <button onClick={handleAction}>Perform Action</button>;
}
```

**Logger API:**
- `logger.info(message: string, ...args): void`
- `logger.warn(message: string, ...args): void`
- `logger.error(message: string, ...args): void`
- `logger.debug(message: string, ...args): void`

## 🧭 Navigation

### useNavigation Hook

```typescript
import { useNavigation } from '@ovh-ux/manager-react-core-application';

function NavigationComponent() {
  const navigation = useNavigation();
  
  const handleNavigate = () => {
    navigation.navigateTo('billing', '/billing/history');
  };
  
  return <button onClick={handleNavigate}>Go to Billing</button>;
}
```

## 🛣️ Routing

### createAppRouter

```typescript
import { createAppRouter } from '@ovh-ux/manager-react-core-application';

// Creates router with automatic route generation
const router = createAppRouter();

// Automatic configuration:
// - File-based routes (/pages)
// - Lazy loading
// - Error handling
// - Shell synchronization
// - Breadcrumb support
```

### OvhContainerRoutingSync

```typescript
import { OvhContainerRoutingSync } from '@ovh-ux/manager-react-core-application';

function App() {
  return (
    <div>
      <OvhContainerRoutingSync routes={routes} />
      <Outlet />
    </div>
  );
}
```

## 🎯 Tracking

### OvhTracking Component

```typescript
import { OvhTracking } from '@ovh-ux/manager-react-core-application';

function App() {
  const { shell } = useShell();
  
  return (
    <div>
      <OvhTracking shell={shell} />
      {/* App content */}
    </div>
  );
}
```

**Supported OSDS Components:** OSDS-ACCORDION, OSDS-BUTTON, OSDS-CHECKBOX, OSDS-INPUT, OSDS-LINK, OSDS-MODAL, OSDS-PAGINATION, OSDS-TABS, OSDS-TILE, etc.

**Usage with data-tracking:**
```typescript
<Button data-tracking="action-name">Button</Button>
```

## 🔄 Query Client

### Pre-configured QueryClient

```typescript
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

**Default Configuration:**
- `staleTime: 5 * 60 * 1000` (5 minutes)
- `retry: 1`
- `refetchOnWindowFocus: false`

### Custom Configuration

```typescript
import { QueryClient } from '@tanstack/react-query';

const customQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

## 🌐 Internationalization

### initI18n Function

```typescript
import { initI18n } from '@ovh-ux/manager-react-core-application';

const i18n = await initI18n('fr_FR', ['fr_FR', 'en_GB']);

// Automatic configuration:
// - OVH locale to i18next conversion
// - HTTP backend for translations
// - Namespace support
// - Locale change handling
```

## 📝 Advanced Usage

### Context Management

```typescript
import { OvhContext, initOvhContext } from '@ovh-ux/manager-react-core-application';

// Initialize context
const context = await initOvhContext('bmc-nasha');

// Use in components
function MyComponent() {
  const ovhContext = useContext(OvhContext);
  
  if (!ovhContext?.shell) {
    return <div>Loading...</div>;
  }
  
  const { shell, environment } = ovhContext;
  return <div>Content</div>;
}
```

### Error Boundary with Logging

```typescript
import { useLogger } from '@ovh-ux/manager-react-core-application';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const logger = useLogger();
    if (logger) {
      logger.error('Error caught by boundary:', error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

## ⚠️ Best Practices & Common Pitfalls

### ✅ Best Practices

```typescript
// ✅ CORRECT: Proper application setup
startApplication('bmc-nasha');
<OvhApplication name="bmc-nasha"><AppContent /></OvhApplication>

// ✅ CORRECT: Check context availability
const ovhContext = useContext(OvhContext);
if (!ovhContext?.shell) return <div>Loading...</div>;

// ✅ CORRECT: Proper authentication check
const auth = useAuthentication();
if (!auth.nichandle) return <div>Please log in</div>;
```

### ❌ Common Mistakes

```typescript
// ❌ WRONG: Missing application wrapper
function App() {
  return <AppContent />; // Missing OvhApplication
}

// ❌ WRONG: No null check
const { shell } = useContext(OvhContext); // May be null

// ❌ WRONG: No authentication check
function ProtectedComponent() {
  return <div>Protected content</div>; // No auth check
}
```

## 🤖 AI Development Guidelines

### Essential Rules

1. **Always initialize application**: Call `startApplication` in main.tsx
2. **Wrap with OvhApplication**: Use OvhApplication component for proper context
3. **Check context availability**: Always check if context is available before use
4. **Handle authentication**: Check authentication state before protected operations
5. **Use proper logging**: Use useLogger for all logging operations
6. **Configure environment**: Use useEnvironment for environment-specific logic
7. **Implement error boundaries**: Use error boundaries with logging
8. **Follow routing patterns**: Use createAppRouter and OvhContainerRoutingSync

### Integration Checklist

- [ ] `startApplication` called in main.tsx
- [ ] App wrapped with `OvhApplication`
- [ ] `QueryClientProvider` configured with `queryClient`
- [ ] `ShellContext.Provider` configured
- [ ] Error boundaries implemented
- [ ] Authentication guards in place
- [ ] Environment-based configuration
- [ ] Logging configured

---

## ⚖️ The Core Application's Moral

- **Proper initialization** ensures applications work correctly in the Manager ecosystem
- **Context management** provides clean and maintainable code structure
- **Authentication handling** ensures security and user experience
- **Error management** prevents application crashes and improves reliability

**👉 Good core application setup is the foundation for reliable and maintainable applications.**
