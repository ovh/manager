---
title: Manager React Shell Client
version: 0.9.3
last_update: 2025-11-21
tags: [shell, client, react, tracking, navigation, ovhcloud, manager]
ai: true
---

# Manager React Shell Client

> **📦 Version:** `@ovh-ux/manager-react-shell-client@^0.9.3`

## 🧭 Purpose

The **Manager React Shell Client** provides React hooks and utilities for integrating µApps with the OVHcloud Manager shell. It handles shell communication, tracking, navigation, breadcrumbs, and internationalization in React applications.

## ⚙️ Context

Manager React Shell Client is designed for:
- **Shell integration** in React µApps
- **Tracking implementation** with AT Internet
- **Navigation management** between applications
- **Breadcrumb generation** for user navigation
- **Internationalization** setup and management
- **UX components** integration (sidebars, modals, etc.)

## 🔗 References

- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)
- [Manager Core API](./manager-core-api.md)
- [Shell Package](./shell.md)

## 📘 Quick Start

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-react-shell-client": "^0.9.3"
  }
}
```

### Shell Context Initialization

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

### ShellContext Usage (Recommended)

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell, environment, tracking } = useContext(ShellContext);
  
  // Access shell APIs
  const handleEnvironmentChange = async () => {
    await shell.environment.setUniverse('BareMetalCloud');
  };
  
  return <div>Component content</div>;
}
```

## 📦 Hooks Reference

| Hook | Returns | Usage | Status |
|------|---------|-------|--------|
| **useOvhTracking** | `{ trackCurrentPage, trackPage, trackClick }` | Tracking implementation | ✅ Active |
| **useNavigationGetUrl** | `{ data: url, isLoading }` | Get navigation URL with React Query cache | ✅ Active |
| **useRouteSynchro** | `void` | Auto-sync routes with shell | ✅ Active |
| **useBreadcrumb** | `BreadcrumbItem[]` | Generate breadcrumb items | ✅ Active |
| **useEnvironment** | `Environment` | Access environment properties | ✅ Active |
| **useShell** | `Shell` | Access shell APIs | ⚠️ Deprecated |
| **useNavigation** | `Navigation` | Navigation methods | ⚠️ Deprecated |
| **useRouting** | `Routing` | Routing methods | ⚠️ Deprecated |
| **useUX** | `UX` | UX components | ⚠️ Deprecated |
| **useTracking** | `Tracking` | Tracking methods | ⚠️ Deprecated |

**⚠️ Deprecated hooks:** Use `ShellContext` directly instead.

## 🎯 Tracking Integration

### useOvhTracking Hook

```typescript
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { trackCurrentPage, trackPage, trackClick } = useOvhTracking();
  
  useEffect(() => {
    trackCurrentPage();
  }, []);
  
  const handleClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actions: ['create-service'],
      actionType: 'navigation'
    });
  };
  
  return <button onClick={handleClick}>Create Service</button>;
}
```

### Tracking Enums

```typescript
import { PageType, PageLocation, ButtonType, ActionType } from '@ovh-ux/manager-react-shell-client';

// Page types
PageType.onboarding | PageType.listing | PageType.dashboard | PageType.popup | 
PageType.bannerSuccess | PageType.bannerError | PageType.bannerInfo | 
PageType.bannerWarning | PageType.funnel

// Page locations
PageLocation.page | PageLocation.funnel | PageLocation.banner | PageLocation.popup |
PageLocation.datagrid | PageLocation.tile | PageLocation.mainTabnav

// Button types
ButtonType.button | ButtonType.link | ButtonType.select | ButtonType.externalLink |
ButtonType.tile | ButtonType.tutorial | ButtonType.tab

// Action types
ActionType.action | ActionType.navigation | ActionType.download | ActionType.exit
```

## 🧭 Navigation

### useNavigationGetUrl (Recommended)

```typescript
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

function NavigationComponent() {
  const { data: url, isLoading } = useNavigationGetUrl(
    ['billing', '#/billing/invoices'],
    { enabled: true, staleTime: 5 * 60 * 1000 }
  );
  
  if (isLoading) return <div>Loading...</div>;
  return <a href={url}>Go to Billing</a>;
}
```

### ShellContext Navigation

**When to use:**
- `useNavigationGetUrl`: Use when you need a URL to attach to an anchor element (`<a href={url}>`)
- `shell.navigation.getURL()`: Use when you need a URL inside a button click callback or event handler

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  
  const handleNavigate = async () => {
    await shell.navigation.navigateTo('billing', '/billing/history');
  };
  
  const handleGetUrl = async () => {
    const url = await shell.navigation.getURL('billing', '/billing/history');
    // Use URL in button click callback
    window.location.href = url;
  };
  
  return (
    <div>
      <button onClick={handleNavigate}>Navigate</button>
      <button onClick={handleGetUrl}>Get URL</button>
    </div>
  );
}
```

**Navigation API:**
- `navigation.navigateTo(appName: string, path: string): Promise<void>`
- `navigation.getURL(appName: string, path: string): Promise<string>`
- `navigation.reload(): Promise<void>`
- `navigation.goBack(): Promise<void>`
- `navigation.goForward(): Promise<void>`

## 🍞 Breadcrumb Management

### useBreadcrumb Hook

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
          {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          {index < breadcrumbItems.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}
```

**BreadcrumbItem Type:**
```typescript
type BreadcrumbItem = {
  label: string;
  href?: string;
};
```

## 🌐 Internationalization

### initI18n Function

```typescript
import { initI18n } from '@ovh-ux/manager-react-shell-client';

const i18n = await initI18n({
  context: shellContext,
  reloadOnLocaleChange: true,
  defaultNS: 'common',
  ns: ['common', 'dashboard', 'onboarding']
});
```

### Locale Management

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function LocaleSelector() {
  const { shell } = useContext(ShellContext);
  
  const handleLocaleChange = async (locale: string) => {
    await shell.i18n.setLocale(locale);
  };
  
  return (
    <select onChange={(e) => handleLocaleChange(e.target.value)}>
      <option value="fr_FR">Français</option>
      <option value="en_GB">English</option>
    </select>
  );
}
```

### Locale Utilities

```typescript
import { 
  ovhLocaleToI18next, 
  i18nextLocaleToOvh,
  defaultLocale,
  defaultAvailableLocales 
} from '@ovh-ux/manager-react-shell-client';

// Conversions
ovhLocaleToI18next('fr_FR'); // 'fr-FR'
i18nextLocaleToOvh('en-GB'); // 'en_GB'
```

## 🎨 UX Components

### ShellContext UX (Recommended)

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function UXComponent() {
  const { shell } = useContext(ShellContext);
  
  const handleShowSidebar = async () => {
    await shell.ux.showAccountSidebar();
  };
  
  const handleStartProgress = async () => {
    await shell.ux.startProgress();
  };
  
  return (
    <div>
      <button onClick={handleShowSidebar}>Show Sidebar</button>
      <button onClick={handleStartProgress}>Start Progress</button>
    </div>
  );
}
```

**UX API Methods:**
- **Sidebar:** `showAccountSidebar()`, `isAccountSidebarVisible()`, `showMenuSidebar()`, `isMenuSidebarVisible()`, `resetAccountSidebar()`
- **Progress:** `startProgress()`, `stopProgress()`, `hidePreloader()`, `showPreloader()`
- **Live Chat:** `openLiveChat()`, `closeChatbot()`, `isChatbotVisible()`, `isChatbotReduced()`
- **Modal:** `notifyModalActionDone(id: string)`

## 🌍 Environment Management

### useEnvironment Hook

```typescript
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

function EnvironmentComponent() {
  const environment = useEnvironment();
  
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

**Environment API:**
- `environment.getEnvironment(): Promise<Environment>`
- `environment.setUniverse(universe: string): Promise<void>`
- `environment.setApplication(appId: ApplicationId): Promise<void>`
- `environment.setUser(user: User): Promise<void>`
- `environment.getRegion(): string`
- `environment.getUniverse(): string`
- `environment.getUser(): User`
- `environment.getUserLocale(): string`

## 🔄 Routing Management

### useRouteSynchro Hook

```typescript
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

function App() {
  useRouteSynchro(); // Auto-syncs route changes with shell
  return <div>App content</div>;
}
```

### ShellContext Routing (Alternative)

```typescript
import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function RoutingComponent() {
  const { shell } = useContext(ShellContext);
  
  useEffect(() => {
    shell.routing.listenForHashChange();
    return () => {
      shell.routing.stopListenForHashChange();
    };
  }, [shell]);
  
  return <div>Routing component</div>;
}
```

## 📝 Advanced Usage

### Complete Shell Integration

```typescript
import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function AppShellIntegration() {
  const { shell, environment, tracking } = useContext(ShellContext);
  
  useEffect(() => {
    const initializeShell = async () => {
      await shell.environment.setUniverse('BareMetalCloud');
      
      if (tracking) {
        shell.tracking.trackPage({
          name: 'app-initialization',
          level2: tracking.level2Config
        });
      }
      
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

### Error Handling

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function ErrorHandlingComponent() {
  const { shell } = useContext(ShellContext);
  
  const handleApiCall = async () => {
    try {
      const result = await fetch('/api/data');
      await shell.logger.info('API call successful', result);
    } catch (error) {
      await shell.logger.error('API call failed', error);
      await shell.ux.notifyModalActionDone('error-modal');
    }
  };
  
  return <div>Error handling component</div>;
}
```

## ⚠️ Best Practices & Common Pitfalls

### ✅ Best Practices

```typescript
// ✅ CORRECT: Use ShellContext directly
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function MyComponent() {
  const { shell } = useContext(ShellContext);
  // Use shell APIs
}

// ✅ CORRECT: Complete tracking setup
const { trackClick } = useOvhTracking();
trackClick({
  location: PageLocation.datagrid,
  buttonType: ButtonType.button,
  actions: ['create-item'],
  actionType: 'action'
});

// ✅ CORRECT: Proper error handling
try {
  await shell.navigation.navigateTo('billing', '/history');
} catch (error) {
  await shell.logger.error('Navigation failed', error);
}
```

### ❌ Common Mistakes

```typescript
// ❌ WRONG: Missing Shell Context
function MyComponent() {
  const { trackClick } = useOvhTracking(); // Will fail without context
}

// ❌ WRONG: Deprecated hook usage
import { useShell, useNavigation } from '@ovh-ux/manager-react-shell-client';

// ❌ WRONG: No error handling
await shell.navigation.navigateTo('billing', '/history');
```

## 🤖 AI Development Guidelines

### Essential Rules

1. **Always use ShellContext**: Use `useContext(ShellContext)` instead of deprecated hooks
2. **Initialize shell context**: Always call `initShellContext` in main.tsx
3. **Provide tracking context**: Include tracking parameters in shell initialization
4. **Handle errors properly**: Wrap shell API calls in try-catch blocks
5. **Use proper tracking enums**: Use PageType, PageLocation, ButtonType, ActionType
6. **Implement breadcrumbs**: Use useBreadcrumb for navigation consistency
7. **Set up i18n properly**: Use initI18n with correct namespaces
8. **Clean up listeners**: Remove event listeners in useEffect cleanup

### Integration Checklist

- [ ] ShellContext.Provider wraps the app
- [ ] initShellContext called with tracking parameters
- [ ] Tracking context includes chapter1, chapter2, chapter3, level2Config
- [ ] useOvhTracking implemented for user interactions
- [ ] Breadcrumbs configured with useBreadcrumb
- [ ] i18n initialized with initI18n
- [ ] Error handling for all shell API calls
- [ ] Cleanup of event listeners

---

## ⚖️ The Shell Client's Moral

- **Consistent integration** ensures seamless user experience across applications
- **Proper tracking** provides valuable insights for product improvement
- **Error handling** prevents silent failures and improves reliability
- **Context management** enables clean and maintainable code

**👉 Good shell integration is invisible to users but essential for application coherence.**
