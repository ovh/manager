---
title: Manager React Shell Client
last_update: 2025-01-27
tags: [shell, client, react, tracking, navigation, ovhcloud, manager]
ai: true
---

# Manager React Shell Client

> **📦 Version:** `@ovh-ux/manager-react-shell-client@^0.9.3`

## 🧭 Purpose

The **Manager React Shell Client** provides React hooks and utilities for integrating µApps with the OVHcloud Manager shell. It handles shell communication, tracking, navigation, breadcrumbs, and internationalization in React applications.

This package is essential for React µApps to communicate with the Manager shell, providing seamless integration with the container application and standardized tracking capabilities.

## ⚙️ Context

Manager React Shell Client is designed for:
- **Shell integration** in React µApps
- **Tracking implementation** with AT Internet
- **Navigation management** between applications
- **Breadcrumb generation** for user navigation
- **Internationalization** setup and management
- **UX components** integration (sidebars, modals, etc.)

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Tracking compliance** with OVHcloud standards
- **Navigation consistency** across applications
- **User experience** standardization

## 🔗 References

- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)
- [Manager Core API](./manager-core-api.md)
- [Shell Package](./shell.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-react-shell-client": "^0.9.3"
  }
}
```

### Shell Context Initialization

#### Basic Setup

```typescript
// main.tsx
import { initShellContext } from '@ovh-ux/manager-react-shell-client';

const trackingContext = {
  chapter1: 'BareMetalCloud',
  chapter2: 'NETWORK',
  chapter3: 'nasha',
  appName: 'bmc-nasha',
  level2Config: {
    EU: { config: { level2: '86' } },
    CA: { config: { level2: '86' } },
    US: { config: { level2: '52' } }
  },
  pageTheme: 'BareMetalCloud'
};

const context = await initShellContext('bmc-nasha', trackingContext);
```

#### Shell Provider Setup

```typescript
// App.tsx
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function App() {
  return (
    <ShellContext.Provider value={context}>
      <RouterProvider router={router} />
    </ShellContext.Provider>
  );
}
```

### Shell Hooks

#### useShell (Deprecated)

```typescript
import { useShell } from '@ovh-ux/manager-react-shell-client';

// ⚠️ DEPRECATED: Use ShellContext directly
function MyComponent() {
  const shell = useShell();
  
  // Access shell APIs
  const environment = await shell.environment.getEnvironment();
  const locale = await shell.i18n.getLocale();
  
  return <div>Component content</div>;
}
```

#### Direct ShellContext Usage (Recommended)

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell, environment, tracking } = useContext(ShellContext);
  
  // Access shell APIs
  const handleEnvironmentChange = async () => {
    await shell.environment.setUniverse('BareMetalCloud');
  };
  
  const handleLocaleChange = async () => {
    await shell.i18n.setLocale('en_GB');
  };
  
  return <div>Component content</div>;
}
```

### Tracking Integration

#### useOvhTracking Hook

```typescript
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { trackCurrentPage, trackPage, trackClick } = useOvhTracking();
  
  // Track current page
  useEffect(() => {
    trackCurrentPage();
  }, []);
  
  // Track specific page
  const handlePageView = () => {
    trackPage({
      pageType: PageType.dashboard,
      pageName: 'service-details'
    });
  };
  
  // Track user interactions
  const handleButtonClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actions: ['create-service'],
      actionType: 'navigation'
    });
  };
  
  return (
    <div>
      <button onClick={handleButtonClick}>
        Create Service
      </button>
    </div>
  );
}
```

#### Tracking Enums

```typescript
import { 
  PageType, 
  PageLocation, 
  ButtonType, 
  ActionType 
} from '@ovh-ux/manager-react-shell-client';

// Page types for tracking
PageType.onboarding     // Onboarding pages
PageType.listing        // List pages
PageType.dashboard      // Dashboard pages
PageType.popup          // Modal/popup pages
PageType.bannerSuccess  // Success banners
PageType.bannerError    // Error banners
PageType.bannerInfo     // Info banners
PageType.bannerWarning  // Warning banners
PageType.funnel         // Funnel pages

// Page locations
PageLocation.page        // Main page
PageLocation.funnel     // Funnel area
PageLocation.banner     // Banner area
PageLocation.popup      // Popup/modal
PageLocation.datagrid   // Data grid
PageLocation.tile       // Tile component
PageLocation.mainTabnav // Main tab navigation

// Button types
ButtonType.button       // Regular button
ButtonType.link         // Link
ButtonType.select       // Select dropdown
ButtonType.externalLink // External link
ButtonType.tile         // Tile component
ButtonType.tutorial     // Tutorial tile
ButtonType.tab          // Tab navigation

// Action types
ActionType.action       // User action
ActionType.navigation  // Navigation action
ActionType.download    // Download action
ActionType.exit        // Exit action
```

### Navigation Management

#### useNavigation Hook

```typescript
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const navigation = useNavigation();
  
  // Navigate to another application
  const handleNavigateToBilling = () => {
    navigation.navigateTo('billing', '/billing/history');
  };
  
  // Navigate to external URL
  const handleNavigateToExternal = () => {
    navigation.navigateTo('external', 'https://docs.ovh.com');
  };
  
  return (
    <div>
      <button onClick={handleNavigateToBilling}>
        Go to Billing
      </button>
    </div>
  );
}
```

#### Navigation API

```typescript
// Navigation methods available
navigation.navigateTo(appName: string, path: string): Promise<void>
navigation.getURL(appName: string, path: string): Promise<string>
navigation.reload(): Promise<void>
navigation.goBack(): Promise<void>
navigation.goForward(): Promise<void>
```

### Breadcrumb Management

#### useBreadcrumb Hook

```typescript
import { useBreadcrumb } from '@ovh-ux/manager-react-shell-client';

function BreadcrumbComponent() {
  const breadcrumbItems = useBreadcrumb({
    rootLabel: 'Home',
    appName: 'bmc-nasha',
    projectId: 'project-123'
  });
  
  return (
    <nav>
      {breadcrumbItems.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}
```

#### BreadcrumbItem Type

```typescript
type BreadcrumbItem = {
  label: string;    // Display text
  href?: string;    // Optional link URL
};
```

### Internationalization

#### initI18n Function

```typescript
import { initI18n } from '@ovh-ux/manager-react-shell-client';

// Initialize i18n with shell context
const i18n = await initI18n({
  context: shellContext,
  reloadOnLocaleChange: true,
  defaultNS: 'common',
  ns: ['common', 'dashboard', 'onboarding']
});
```

#### Locale Management

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function LocaleSelector() {
  const { shell } = useContext(ShellContext);
  
  const handleLocaleChange = async (locale: string) => {
    await shell.i18n.setLocale(locale);
  };
  
  const getAvailableLocales = async () => {
    const locales = await shell.i18n.getAvailableLocales();
    return locales;
  };
  
  return (
    <select onChange={(e) => handleLocaleChange(e.target.value)}>
      <option value="fr_FR">Français</option>
      <option value="en_GB">English</option>
    </select>
  );
}
```

### UX Components Integration

#### useUX Hook

```typescript
import { useUX } from '@ovh-ux/manager-react-shell-client';

function UXComponent() {
  const ux = useUX();
  
  // Sidebar management
  const handleShowSidebar = async () => {
    await ux.showAccountSidebar();
  };
  
  const handleShowMenuSidebar = async () => {
    await ux.showMenuSidebar();
  };
  
  // Progress indicators
  const handleStartProgress = async () => {
    await ux.startProgress();
  };
  
  const handleStopProgress = async () => {
    await ux.stopProgress();
  };
  
  // Live chat
  const handleOpenLiveChat = async () => {
    await ux.openLiveChat();
  };
  
  return (
    <div>
      <button onClick={handleShowSidebar}>Show Sidebar</button>
      <button onClick={handleStartProgress}>Start Progress</button>
      <button onClick={handleOpenLiveChat}>Open Chat</button>
    </div>
  );
}
```

#### UX API Methods

```typescript
// Sidebar management
ux.showAccountSidebar(): Promise<void>
ux.isAccountSidebarVisible(): Promise<boolean>
ux.showMenuSidebar(): Promise<void>
ux.isMenuSidebarVisible(): Promise<boolean>
ux.resetAccountSidebar(): Promise<void>

// Progress indicators
ux.startProgress(): Promise<void>
ux.stopProgress(): Promise<void>
ux.hidePreloader(): Promise<void>
ux.showPreloader(): Promise<void>

// Live chat
ux.openLiveChat(): Promise<void>
ux.closeChatbot(): Promise<void>
ux.isChatbotVisible(): Promise<boolean>
ux.isChatbotReduced(): Promise<boolean>

// Modal management
ux.notifyModalActionDone(id: string): Promise<void>
```

### Environment Management

#### useEnvironment Hook

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

function EnvironmentComponent() {
  const environment = useEnvironment();
  
  // Access environment properties
  const region = environment.getRegion();
  const universe = environment.getUniverse();
  const user = environment.getUser();
  
  return (
    <div>
      <p>Region: {region}</p>
      <p>Universe: {universe}</p>
      <p>User: {user?.nichandle}</p>
    </div>
  );
}
```

#### Environment API

```typescript
// Environment methods
environment.getEnvironment(): Promise<Environment>
environment.setUniverse(universe: string): Promise<void>
environment.setApplication(appId: ApplicationId): Promise<void>
environment.setUser(user: User): Promise<void>
```

### Routing Management

#### useRouting Hook

```typescript
import { useRouting } from '@ovh-ux/manager-react-shell-client';

function RoutingComponent() {
  const routing = useRouting();
  
  useEffect(() => {
    // Listen for hash changes
    routing.listenForHashChange();
    
    return () => {
      // Clean up listener
      routing.stopListenForHashChange();
    };
  }, []);
  
  const handleHashChange = () => {
    routing.onHashChange();
  };
  
  return <div>Routing component</div>;
}
```

### Advanced Usage Patterns

#### Complete Shell Integration

```typescript
import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function AppShellIntegration() {
  const { shell, environment, tracking } = useContext(ShellContext);
  
  useEffect(() => {
    // Initialize shell features
    const initializeShell = async () => {
      // Set up environment
      await shell.environment.setUniverse('BareMetalCloud');
      
      // Configure tracking
      if (tracking) {
        shell.tracking.trackPage({
          name: 'app-initialization',
          level2: tracking.level2Config
        });
      }
      
      // Set up navigation listeners
      shell.routing.listenForHashChange();
    };
    
    initializeShell();
    
    return () => {
      shell.routing.stopListenForHashChange();
    };
  }, [shell, tracking]);
  
  return <div>App with shell integration</div>;
}
```

#### Tracking with Context

```typescript
import { useContext } from 'react';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

function TrackingComponent() {
  const { tracking } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  
  const handleAction = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actions: ['create-resource'],
      actionType: 'action'
    });
  };
  
  return (
    <button onClick={handleAction}>
      Create Resource
    </button>
  );
}
```

#### Error Handling

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function ErrorHandlingComponent() {
  const { shell } = useContext(ShellContext);
  
  const handleApiCall = async () => {
    try {
      // Make API call
      const result = await fetch('/api/data');
      
      // Log success
      await shell.logger.info('API call successful', result);
    } catch (error) {
      // Log error
      await shell.logger.error('API call failed', error);
      
      // Show error to user
      await shell.ux.notifyModalActionDone('error-modal');
    }
  };
  
  return <div>Error handling component</div>;
}
```

### Best Practices

#### 1. Shell Context Usage

```typescript
// ✅ CORRECT: Use ShellContext directly
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  // Use shell APIs
}

// ❌ WRONG: Use deprecated useShell hook
import { useShell } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const shell = useShell(); // Deprecated
}
```

#### 2. Tracking Implementation

```typescript
// ✅ CORRECT: Complete tracking setup
const { trackClick } = useOvhTracking();

const handleClick = () => {
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actions: ['create-item'],
    actionType: 'action'
  });
};

// ❌ WRONG: Incomplete tracking
const handleClick = () => {
  trackClick({}); // Missing required properties
};
```

#### 3. Error Handling

```typescript
// ✅ CORRECT: Proper error handling
try {
  await shell.navigation.navigateTo('billing', '/history');
} catch (error) {
  await shell.logger.error('Navigation failed', error);
}

// ❌ WRONG: No error handling
await shell.navigation.navigateTo('billing', '/history');
```

### Common Pitfalls

#### ❌ Wrong: Missing Shell Context

```typescript
// Don't use hooks without ShellContext
function MyComponent() {
  const { trackClick } = useOvhTracking(); // Will fail without context
}
```

#### ✅ Correct: Provide Shell Context

```typescript
// Wrap app with ShellContext.Provider
<ShellContext.Provider value={shellContext}>
  <MyComponent />
</ShellContext.Provider>
```

#### ❌ Wrong: Deprecated Hook Usage

```typescript
// Don't use deprecated hooks
import { useShell, useNavigation } from '@ovh-ux/manager-react-shell-client';
```

#### ✅ Correct: Use ShellContext

```typescript
// Use ShellContext directly
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  // Use shell.navigation, shell.tracking, etc.
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use ShellContext**: Use `useContext(ShellContext)` instead of deprecated hooks
2. **Initialize shell context**: Always call `initShellContext` in main.tsx
3. **Provide tracking context**: Include tracking parameters in shell initialization
4. **Handle errors properly**: Wrap shell API calls in try-catch blocks
5. **Use proper tracking enums**: Use PageType, PageLocation, ButtonType, ActionType
6. **Implement breadcrumbs**: Use useBreadcrumb for navigation consistency
7. **Set up i18n properly**: Use initI18n with correct namespaces
8. **Clean up listeners**: Remove event listeners in useEffect cleanup

### Shell Integration Checklist

- [ ] ShellContext.Provider wraps the app
- [ ] initShellContext called with tracking parameters
- [ ] Tracking context includes chapter1, chapter2, chapter3, level2Config
- [ ] useOvhTracking implemented for user interactions
- [ ] Breadcrumbs configured with useBreadcrumb
- [ ] i18n initialized with initI18n
- [ ] Error handling for all shell API calls
- [ ] Cleanup of event listeners

### Tracking Implementation Checklist

- [ ] trackCurrentPage called on route changes
- [ ] trackClick implemented for user actions
- [ ] Proper enums used (PageType, PageLocation, ButtonType, ActionType)
- [ ] Actions array follows naming conventions
- [ ] Tracking context properly configured

### Navigation Checklist

- [ ] useNavigation for inter-app navigation
- [ ] Proper error handling for navigation calls
- [ ] URL construction with navigation.getURL
- [ ] Cleanup of routing listeners

### Performance Considerations

- [ ] Memoize shell context values
- [ ] Use useCallback for event handlers
- [ ] Implement proper cleanup in useEffect
- [ ] Avoid unnecessary re-renders with shell state

---

## ⚖️ The Shell Client's Moral

- **Consistent integration** ensures seamless user experience across applications
- **Proper tracking** provides valuable insights for product improvement
- **Error handling** prevents silent failures and improves reliability
- **Context management** enables clean and maintainable code

**👉 Good shell integration is invisible to users but essential for application coherence.**

## 🔄 Exports en Cascade

### Hooks de Navigation

#### useNavigationGetUrl

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

// Obtenir une URL avec cache React Query
function NavigationComponent() {
  const { data: url, isLoading } = useNavigationGetUrl(
    ['billing', '#/billing/invoices'],
    {
      enabled: true,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  );

  if (isLoading) return <div>Loading...</div>;
  
  return <a href={url}>Go to Billing</a>;
}
```

#### useRouteSynchro

```typescript
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

// Synchronisation automatique des routes avec le shell
function App() {
  useRouteSynchro(); // Synchronise automatiquement les changements de route
  
  return <div>App content</div>;
}
```

### Hooks Dépréciés (Utiliser ShellContext)

#### useNavigation (Déprécié)

```typescript
// ❌ DÉPRÉCIÉ: Utiliser ShellContext directement
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

// ✅ RECOMMANDÉ: Utiliser ShellContext
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

function Component() {
  const { shell } = useContext(ShellContext);
  const navigation = shell.navigation;
  
  return <div>Navigation: {navigation}</div>;
}
```

#### useRouting (Déprécié)

```typescript
// ❌ DÉPRÉCIÉ: Utiliser ShellContext directement
import { useRouting } from '@ovh-ux/manager-react-shell-client';

// ✅ RECOMMANDÉ: Utiliser ShellContext
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

function Component() {
  const { shell } = useContext(ShellContext);
  const routing = shell.routing;
  
  return <div>Routing: {routing}</div>;
}
```

#### useUX (Déprécié)

```typescript
// ❌ DÉPRÉCIÉ: Utiliser ShellContext directement
import { useUX } from '@ovh-ux/manager-react-shell-client';

// ✅ RECOMMANDÉ: Utiliser ShellContext
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

function Component() {
  const { shell } = useContext(ShellContext);
  const ux = shell.ux;
  
  return <div>UX: {ux}</div>;
}
```

#### useTracking (Déprécié)

```typescript
// ❌ DÉPRÉCIÉ: Utiliser ShellContext directement
import { useTracking } from '@ovh-ux/manager-react-shell-client';

// ✅ RECOMMANDÉ: Utiliser ShellContext
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';

function Component() {
  const { shell } = useContext(ShellContext);
  const tracking = shell.tracking;
  
  return <div>Tracking: {tracking}</div>;
}
```

### Hooks d'Environnement

#### useEnvironment

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

function EnvironmentComponent() {
  const environment = useEnvironment();
  
  if (!environment) {
    return <div>Loading environment...</div>;
  }
  
  return (
    <div>
      <p>Region: {environment.getRegion()}</p>
      <p>User: {environment.getUser().nichandle}</p>
      <p>Locale: {environment.getUserLocale()}</p>
    </div>
  );
}
```

### Hooks de Breadcrumb

#### useBreadcrumb

```typescript
import { useBreadcrumb } from '@ovh-ux/manager-react-shell-client';

function BreadcrumbComponent() {
  const breadcrumb = useBreadcrumb({
    rootLabel: 'Home',
    appName: 'bmc-nasha'
  });
  
  return (
    <nav>
      {breadcrumb.map((item, index) => (
        <span key={index}>
          <a href={item.href}>{item.label}</a>
          {index < breadcrumb.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}
```

### Initialisation i18n

#### initI18n

```typescript
import { initI18n } from '@ovh-ux/manager-react-shell-client';

// Initialisation complète d'i18n
const initializeI18n = async (context) => {
  const i18n = await initI18n({
    context,
    reloadOnLocaleChange: false,
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'onboarding']
  });
  
  return i18n;
};
```

#### Utilitaires de Locale

```typescript
import { 
  ovhLocaleToI18next, 
  i18nextLocaleToOvh,
  defaultLocale,
  defaultAvailableLocales 
} from '@ovh-ux/manager-react-shell-client';

// Conversion de locales
const ovhLocale = 'fr_FR';
const i18nextLocale = ovhLocaleToI18next(ovhLocale); // 'fr-FR'

const i18nextLocale2 = 'en-GB';
const ovhLocale2 = i18nextLocaleToOvh(i18nextLocale2); // 'en_GB'

// Locales par défaut
const locale = defaultLocale; // 'fr_FR'
const locales = defaultAvailableLocales; // ['fr_FR']
```

### Intégration avec Request Tagger

```typescript
import { initShellContext } from '@ovh-ux/manager-react-shell-client';

// L'initialisation du shell intègre automatiquement request-tagger
const initializeApp = async (appName, tracking) => {
  const { shell, environment, tracking: shellTracking } = await initShellContext(appName, tracking);
  
  // La version de l'application est automatiquement définie dans request-tagger
  // si __VERSION__ est disponible
  
  return { shell, environment, tracking: shellTracking };
};
```
