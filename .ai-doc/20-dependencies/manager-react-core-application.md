---
title: Manager React Core Application
last_update: 2025-01-27
tags: [core, application, react, ovhcloud, manager, hooks, routing, tracking]
ai: true
---

# Manager React Core Application

> **📦 Version:** `@ovh-ux/manager-react-core-application@^0.12.8`

## 🧭 Purpose

The **Manager React Core Application** package provides essential hooks, utilities, and components for building React applications in the OVHcloud Manager ecosystem. It includes authentication, environment management, logging, navigation, routing, and tracking capabilities.

This package is the foundation for React µApps, providing standardized patterns for application setup, context management, and core functionality integration.

## ⚙️ Context

Manager React Core Application is designed for:
- **Application initialization** and context setup
- **Authentication management** with user roles and permissions
- **Environment configuration** and region management
- **Logging and debugging** capabilities
- **Navigation and routing** integration
- **Tracking implementation** with AT Internet
- **Query client configuration** for data fetching

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Application bootstrap** and initialization
- **Core functionality** integration
- **Standardized patterns** across applications

## 🔗 References

- [Manager React Shell Client](./manager-react-shell-client.md)
- [Manager Core API](./manager-core-api.md)
- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-react-core-application": "^0.12.8"
  }
}
```

### Application Initialization

#### Basic Application Setup

```typescript
// main.tsx
import { startApplication } from '@ovh-ux/manager-react-core-application';

// Start the application
startApplication('bmc-nasha');
```

#### OvhApplication Component

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

### Context Management

#### OvhContext Setup

```typescript
import { OvhContext, initOvhContext } from '@ovh-ux/manager-react-core-application';

// Initialize context
const context = await initOvhContext('bmc-nasha');

// Use context in components
function MyComponent() {
  const ovhContext = useContext(OvhContext);
  
  if (!ovhContext) {
    return <div>Loading...</div>;
  }
  
  const { shell, environment } = ovhContext;
  
  return <div>Application content</div>;
}
```

#### Context Type

```typescript
type OvhContextType = {
  shell: OvhContextShellType | null;
  environment: Environment | null;
};
```

### Authentication Management

#### useAuthentication Hook

```typescript
import { useAuthentication } from '@ovh-ux/manager-react-core-application';

function AuthenticationComponent() {
  const auth = useAuthentication();
  
  // User information
  const nichandle = auth.nichandle;
  const subsidiary = auth.subsidiary;
  const roles = auth.roles();
  const isTrusted = auth.isTrusted();
  
  // Authentication actions
  const handleLogin = () => {
    auth.login();
  };
  
  const handleLogout = () => {
    auth.logout();
  };
  
  return (
    <div>
      <p>User: {nichandle}</p>
      <p>Subsidiary: {subsidiary}</p>
      <p>Roles: {roles.join(', ')}</p>
      <p>Trusted: {isTrusted ? 'Yes' : 'No'}</p>
      
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

#### Authentication API

```typescript
interface AuthenticationAPI {
  login(): void | undefined;
  logout(): void | undefined;
  readonly nichandle: string | undefined;
  readonly subsidiary: string | undefined;
  roles(): string[];
  isTrusted(): boolean | undefined;
}
```

### Environment Management

#### useEnvironment Hook

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-core-application';

function EnvironmentComponent() {
  const env = useEnvironment();
  
  // Environment properties
  const application = env.application;
  const region = env.region;
  const universe = env.universe;
  const locale = env.locale;
  const container = env.container;
  
  return (
    <div>
      <p>Application: {application?.name}</p>
      <p>Region: {region}</p>
      <p>Universe: {universe}</p>
      <p>Locale: {locale}</p>
      <p>Container enabled: {container?.enabled ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### Environment Type

```typescript
interface Environment {
  readonly application: Readonly<Application> | undefined;
  readonly region: string | undefined;
  readonly universe: string | undefined;
  readonly locale: string | undefined;
  readonly container: {
    enabled?: boolean;
    isDefault?: boolean;
    path?: string;
    hash?: string;
    hashes?: string[];
    containerURL?: string;
  };
}
```

### Logging Management

#### useLogger Hook

```typescript
import { useLogger } from '@ovh-ux/manager-react-core-application';

function LoggingComponent() {
  const logger = useLogger();
  
  const handleLogMessage = () => {
    if (logger) {
      logger.log('General log message');
      logger.info('Information message');
      logger.warn('Warning message');
      logger.error('Error message');
      logger.debug('Debug message');
    }
  };
  
  return (
    <button onClick={handleLogMessage}>
      Log Messages
    </button>
  );
}
```

#### Logger API

```typescript
interface LoggerAPI {
  log: (...args: unknown[]) => Promise<unknown>;
  info: (...args: unknown[]) => Promise<unknown>;
  warn: (...args: unknown[]) => Promise<unknown>;
  error: (...args: unknown[]) => Promise<unknown>;
  debug: (...args: unknown[]) => Promise<unknown>;
}
```

### Navigation Management

#### useNavigation Hook

```typescript
import { useNavigation } from '@ovh-ux/manager-react-core-application';

function NavigationComponent() {
  const navigation = useNavigation();
  
  const handleNavigate = () => {
    if (navigation) {
      // Navigate to another application
      navigation.navigateTo('billing', '/billing/history');
      
      // Get URL for navigation
      navigation.getURL('billing', '/billing/history');
      
      // Reload current page
      navigation.reload();
      
      // Go back/forward
      navigation.goBack();
      navigation.goForward();
    }
  };
  
  return (
    <button onClick={handleNavigate}>
      Navigate
    </button>
  );
}
```

### Routing Integration

#### createAppRouter

```typescript
import { createAppRouter } from '@ovh-ux/manager-react-core-application';

// Create router for the application
const router = createAppRouter();
```

#### OvhContainerRoutingSync

```typescript
import { OvhContainerRoutingSync } from '@ovh-ux/manager-react-core-application';

function App() {
  const routes = [
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/dashboard',
      element: <DashboardPage />
    }
  ];
  
  return (
    <OvhContainerRoutingSync routes={routes} />
  );
}
```

### Tracking Integration

#### OvhTracking Component

```typescript
import { OvhTracking } from '@ovh-ux/manager-react-core-application';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function App() {
  const { shell } = useContext(ShellContext);
  
  return (
    <div>
      <OvhTracking shell={shell} />
      <RouterProvider router={router} />
    </div>
  );
}
```

### Query Client Configuration

#### Pre-configured QueryClient

```typescript
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

#### QueryClient Configuration

The package provides a pre-configured QueryClient with:
- Default retry policies
- Stale time configuration
- Error handling
- DevTools integration

### Internationalization

#### initI18n Function

```typescript
import { initI18n } from '@ovh-ux/manager-react-core-application';

// Initialize i18n
const t = await initI18n('fr_FR', ['fr_FR', 'en_GB']);

// Use translation function
const translatedText = t('common.welcome');
```

### Advanced Usage Patterns

#### Complete Application Setup

```typescript
// main.tsx
import { startApplication } from '@ovh-ux/manager-react-core-application';

// Start the application
startApplication('bmc-nasha');

// App.tsx
import { 
  OvhApplication, 
  OvhContext, 
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

#### Authentication Guard

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

#### Environment-based Configuration

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-core-application';

function EnvironmentAwareComponent() {
  const env = useEnvironment();
  
  // Configure based on environment
  const apiUrl = env.region === 'EU' 
    ? 'https://api.ovh.com' 
    : 'https://api.us.ovhcloud.com';
  
  const features = env.universe === 'BareMetalCloud' 
    ? ['instances', 'networks', 'storage']
    : ['billing', 'support'];
  
  return (
    <div>
      <p>API URL: {apiUrl}</p>
      <p>Features: {features.join(', ')}</p>
    </div>
  );
}
```

#### Error Boundary with Logging

```typescript
import { useLogger } from '@ovh-ux/manager-react-core-application';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
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

### Best Practices

#### 1. Application Initialization

```typescript
// ✅ CORRECT: Proper application setup
import { startApplication, OvhApplication } from '@ovh-ux/manager-react-core-application';

// In main.tsx
startApplication('bmc-nasha');

// In App.tsx
<OvhApplication name="bmc-nasha">
  <AppContent />
</OvhApplication>

// ❌ WRONG: Missing application wrapper
function App() {
  return <AppContent />; // Missing OvhApplication wrapper
}
```

#### 2. Context Usage

```typescript
// ✅ CORRECT: Check context availability
function MyComponent() {
  const ovhContext = useContext(OvhContext);
  
  if (!ovhContext) {
    return <div>Loading...</div>;
  }
  
  const { shell, environment } = ovhContext;
  // Use context
}

// ❌ WRONG: No null check
function MyComponent() {
  const { shell } = useContext(OvhContext); // May be null
  // Use shell without checking
}
```

#### 3. Authentication Handling

```typescript
// ✅ CORRECT: Proper authentication check
function ProtectedComponent() {
  const auth = useAuthentication();
  
  if (!auth.nichandle) {
    return <div>Please log in</div>;
  }
  
  return <div>Protected content</div>;
}

// ❌ WRONG: No authentication check
function ProtectedComponent() {
  return <div>Protected content</div>; // No auth check
}
```

### Common Pitfalls

#### ❌ Wrong: Missing Application Initialization

```typescript
// Don't forget to call startApplication
function App() {
  return <div>App content</div>; // Missing startApplication call
}
```

#### ✅ Correct: Complete Initialization

```typescript
// main.tsx
import { startApplication } from '@ovh-ux/manager-react-core-application';

startApplication('bmc-nasha');

// App.tsx
import { OvhApplication } from '@ovh-ux/manager-react-core-application';

function App() {
  return (
    <OvhApplication name="bmc-nasha">
      <div>App content</div>
    </OvhApplication>
  );
}
```

#### ❌ Wrong: Missing Context Check

```typescript
// Don't use context without checking
function MyComponent() {
  const { shell } = useContext(OvhContext); // May be null
  shell.tracking.trackPage(); // Error if shell is null
}
```

#### ✅ Correct: Safe Context Usage

```typescript
// Always check context availability
function MyComponent() {
  const ovhContext = useContext(OvhContext);
  
  if (!ovhContext?.shell) {
    return <div>Loading...</div>;
  }
  
  const { shell } = ovhContext;
  shell.tracking.trackPage(); // Safe to use
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always initialize application**: Call `startApplication` in main.tsx
2. **Wrap with OvhApplication**: Use OvhApplication component for proper context
3. **Check context availability**: Always check if context is available before use
4. **Handle authentication**: Check authentication state before protected operations
5. **Use proper logging**: Use useLogger for all logging operations
6. **Configure environment**: Use useEnvironment for environment-specific logic
7. **Implement error boundaries**: Use error boundaries with logging
8. **Follow routing patterns**: Use createAppRouter and OvhContainerRoutingSync

### Application Setup Checklist

- [ ] `startApplication` called in main.tsx
- [ ] App wrapped with `OvhApplication`
- [ ] `QueryClientProvider` configured with `queryClient`
- [ ] `ShellContext.Provider` configured
- [ ] Error boundaries implemented
- [ ] Authentication guards in place
- [ ] Environment-based configuration
- [ ] Logging configured

### Context Management Checklist

- [ ] Context null checks implemented
- [ ] Loading states handled
- [ ] Error states managed
- [ ] Context providers properly nested
- [ ] Context cleanup on unmount

### Authentication Checklist

- [ ] Authentication state checked
- [ ] Login/logout handlers implemented
- [ ] User roles and permissions checked
- [ ] Protected routes implemented
- [ ] Authentication redirects handled

### Performance Considerations

- [ ] Context values memoized
- [ ] Unnecessary re-renders avoided
- [ ] Error boundaries prevent crashes
- [ ] Logging doesn't impact performance
- [ ] Environment checks optimized

---

## ⚖️ The Core Application's Moral

- **Proper initialization** ensures applications work correctly in the Manager ecosystem
- **Context management** provides clean and maintainable code structure
- **Authentication handling** ensures security and user experience
- **Error management** prevents application crashes and improves reliability

**👉 Good core application setup is the foundation for reliable and maintainable applications.**

## 🔄 Exports en Cascade

### Application Factory

#### startApplication

```typescript
import { startApplication } from '@ovh-ux/manager-react-core-application';

// Démarrage complet de l'application
startApplication('bmc-nasha');

// Équivalent à:
// - Création du container DOM
// - Configuration du router
// - Initialisation du QueryClient
// - Rendu avec React.StrictMode
// - Intégration des DevTools
```

#### createContainerElement

```typescript
import { createContainerElement } from '@ovh-ux/manager-react-core-application';

// Création manuelle du container DOM
const container = createContainerElement();
// Crée un div avec id="ovh-app" et l'ajoute au body
```

### Context et Hooks

#### OvhContext

```typescript
import { OvhContext, initOvhContext } from '@ovh-ux/manager-react-core-application';

// Initialisation manuelle du contexte
const context = await initOvhContext('bmc-nasha');
// Retourne: { shell, environment }

// Utilisation du contexte
const { shell, environment } = useContext(OvhContext);
```

#### useEnvironment (Core Application)

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-core-application';

// Hook pour accéder à l'environnement
function EnvironmentComponent() {
  const environment = useEnvironment();
  
  if (!environment) {
    return <div>Loading environment...</div>;
  }
  
  return (
    <div>
      <p>Application: {environment.getApplicationName()}</p>
      <p>Region: {environment.getRegion()}</p>
      <p>User: {environment.getUser().nichandle}</p>
    </div>
  );
}
```

#### useShell (Core Application)

```typescript
import { useShell } from '@ovh-ux/manager-react-core-application';

// Hook pour accéder au shell
function ShellComponent() {
  const shell = useShell();
  
  if (!shell) {
    return <div>Loading shell...</div>;
  }
  
  return (
    <div>
      <p>Shell available: {shell ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Query Client

#### queryClient

```typescript
import { queryClient } from '@ovh-ux/manager-react-core-application';

// Configuration par défaut du QueryClient
const defaultConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
};

// Utilisation personnalisée
const customQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

### Routing

#### createAppRouter

```typescript
import { createAppRouter } from '@ovh-ux/manager-react-core-application';

// Création du router avec génération automatique des routes
const router = createAppRouter();

// Configuration automatique:
// - Routes basées sur le système de fichiers (/pages)
// - Lazy loading des composants
// - Gestion des erreurs
// - Synchronisation avec le shell
// - Support des breadcrumbs
```

#### OvhContainerRoutingSync

```typescript
import { OvhContainerRoutingSync } from '@ovh-ux/manager-react-core-application';

// Composant pour synchroniser le routing avec le shell
function App() {
  return (
    <div>
      <OvhContainerRoutingSync routes={routes} />
      <Outlet />
    </div>
  );
}
```

### i18n

#### initI18n

```typescript
import { initI18n } from '@ovh-ux/manager-react-core-application';

// Initialisation manuelle d'i18n
const i18n = await initI18n('fr_FR', ['fr_FR', 'en_GB']);

// Configuration automatique:
// - Conversion des locales OVH vers i18next
// - Backend HTTP pour les traductions
// - Support des namespaces
// - Gestion des changements de locale
```

### Tracking

#### OvhTracking

```typescript
import { OvhTracking } from '@ovh-ux/manager-react-core-application';

// Composant de tracking automatique
function App() {
  const { shell } = useShell();
  
  return (
    <div>
      <OvhTracking shell={shell} />
      {/* Contenu de l'application */}
    </div>
  );
}
```

#### Composants OSDS Supportés

```typescript
// Composants MUK automatiquement trackés
const OSDS_COMPONENTS = [
  'OSDS-ACCORDION',
  'OSDS-BUTTON',
  'OSDS-CHECKBOX',
  'OSDS-INPUT',
  'OSDS-LINK',
  'OSDS-MODAL',
  'OSDS-PAGINATION',
  'OSDS-TABS',
  'OSDS-TILE',
  // ... autres composants
];

// Utilisation avec data-tracking
<Button data-tracking="action-name">
  Button
</Button>
```

### HMR Support

#### vite-hmr

```typescript
// Support automatique du Hot Module Replacement
// Rechargement automatique en cas de changement
if (import.meta.hot) {
  import.meta.hot.on('iframe-reload', () => {
    window.location.reload();
  });
}
```

### Application Component

#### OvhApplication

```typescript
import { OvhApplication } from '@ovh-ux/manager-react-core-application';

// Composant d'application avec contexte
function App() {
  return (
    <OvhApplication name="bmc-nasha">
      <RouterProvider router={router} />
    </OvhApplication>
  );
}

// Fonctionnalités automatiques:
// - Initialisation du contexte
// - Configuration i18n
// - Gestion des changements de locale
// - Suspense pour le chargement
```

### Intégration Complète

#### Configuration Complète

```typescript
import { 
  startApplication,
  queryClient,
  OvhContext,
  initOvhContext 
} from '@ovh-ux/manager-react-core-application';

// Configuration personnalisée
const customStartApplication = async (appName) => {
  // Initialisation manuelle du contexte
  const context = await initOvhContext(appName);
  
  // Configuration personnalisée du QueryClient
  queryClient.setDefaultOptions({
    queries: {
      staleTime: 10 * 60 * 1000,
      retry: 3
    }
  });
  
  // Démarrage de l'application
  startApplication(appName);
};
```
