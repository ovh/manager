---
title: Shell
version: 4.7.11
last_update: 2025-11-21
tags: [shell, ovhcloud, manager, architecture, communication, plugins, tracking, navigation]
ai: true
---

# Shell

> **📦 Version:** `@ovh-ux/shell@^4.7.11`
> **📦 Package:** Internal OVHcloud Manager package

## 🧭 Purpose

The **Shell** package is the core communication layer for the OVHcloud Manager ecosystem. It provides inter-application communication, plugin management, and standardized APIs for µApps to interact with the container application.

This package is the foundation of the Manager architecture, enabling seamless communication between the container application and µApps through a standardized plugin system.

## ⚙️ Context

Shell is designed for:
- **Inter-application communication** via postMessage and direct client
- **Plugin architecture** for extensible functionality
- **Standardized APIs** for common operations
- **Tracking integration** with AT Internet
- **Navigation management** between applications
- **UX components** integration (sidebars, modals, progress)

This package is essential for:
- **µApp integration** in the Manager ecosystem
- **Communication patterns** between applications
- **Plugin development** for extended functionality
- **Architecture understanding** of the Manager system

## 🔗 References

- [Manager React Shell Client](./manager-react-shell-client.md)
- [Manager React Core Application](./manager-react-core-application.md)
- [React Tracking](../10-architecture/react-tracking.md)
- [µApp Containerization](../10-architecture/uapp-containerization.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/shell": "^4.7.11"
  }
}
```

### Shell Client API

#### Basic Shell Client

```typescript
import { initShellClient } from '@ovh-ux/shell';

// Initialize shell client
const shellClient = await initShellClient();

// Access shell APIs
const environment = await shellClient.environment.getEnvironment();
const locale = await shellClient.i18n.getLocale();
const locations = await shellClient.location.getLocations();
```

#### Shell Client API Structure

```typescript
interface ShellClientApi {
  environment: {
    getEnvironment: () => Promise<Environment>;
    setUniverse: (universe: string) => Promise<void>;
    setApplication: (applicationId: ApplicationId) => Promise<void>;
    setUser: (user: User) => Promise<void>;
  };
  i18n: {
    getLocale: () => Promise<string>;
    onLocaleChange: (callback: Function) => void;
    setLocale: (locale: string) => Promise<void>;
    getAvailableLocales: () => Promise<Locale[]>;
  };
  routing: {
    listenForHashChange: () => void;
    stopListenForHashChange: () => void;
    onHashChange: () => void;
  };
  auth: ClientAuthApi;
  ux: UxApi;
  location: {
    getLocations: () => Promise<Location[]>;
  };
  navigation: ClientNavigationApi;
  tracking: TrackingAPI;
  logger: LoggerApi;
}
```

### Authentication Plugin

#### Auth API

```typescript
import { auth } from '@ovh-ux/shell';

// Initialize auth plugin
const authPlugin = auth({
  goToLogin: () => {
    // Custom login redirect logic
    window.location.href = '/login';
  },
  goToLogout: () => {
    // Custom logout redirect logic
    window.location.href = '/logout';
  }
});

// Use auth methods
authPlugin.login();
authPlugin.logout();
```

#### Client Auth API

```typescript
interface ClientAuthApi {
  login: () => void;
  logout: (url?: string) => void;
}

// Usage in µApp
const shellClient = await initShellClient();

// Login user
shellClient.auth.login();

// Logout with redirect
shellClient.auth.logout('/home');
```

### Navigation Plugin

#### Navigation API

```typescript
import { navigation } from '@ovh-ux/shell';

// Initialize navigation plugin
const navPlugin = navigation(environment);

// Navigate to another application
navPlugin.navigateTo('billing', '/billing/history', {
  serviceId: '123',
  tab: 'invoices'
});

// Get URL for navigation
const url = navPlugin.getURL('billing', '/billing/history', {
  serviceId: '123'
});

// Reload current page
navPlugin.reload();
```

#### Client Navigation API

```typescript
interface ClientNavigationApi {
  getURL: (application: ApplicationId, path: string, params: Record<string, ParamValueType>) => Promise<string>;
  navigateTo: (application: ApplicationId, path: string, params: Record<string, ParamValueType>) => Promise<void>;
  reload: () => Promise<void>;
}

// Usage in µApp
const shellClient = await initShellClient();

// Navigate to billing
await shellClient.navigation.navigateTo('billing', '/billing/history', {
  serviceId: '123'
});

// Get URL
const url = await shellClient.navigation.getURL('billing', '/billing/history', {
  serviceId: '123'
});
```

### Tracking Plugin

#### Tracking Configuration

```typescript
import { TrackingPlugin } from '@ovh-ux/shell';

// Configure tracking for different regions
const trackingConfig: RegionsTrackingConfig = {
  EU: {
    config: {
      level1: 'BareMetalCloud',
      level2: '86',
      level3: 'nasha'
    }
  },
  CA: {
    config: {
      level1: 'BareMetalCloud',
      level2: '86',
      level3: 'nasha'
    }
  },
  US: {
    config: {
      level1: 'BareMetalCloud',
      level2: '52',
      level3: 'nasha'
    }
  }
};

// Initialize tracking
const tracking = new TrackingPlugin();
tracking.setConfig('EU', trackingConfig);
```

#### Tracking API Usage

```typescript
interface TrackingAPI {
  trackPage: (params: TrackingPageParams) => void;
  trackClick: (params: TrackingClickParams) => void;
  trackEvent: (params: TrackingEventParams) => void;
}

// Usage in µApp
const shellClient = await initShellClient();

// Track page view
shellClient.tracking.trackPage({
  name: 'nasha-dashboard',
  level2: '86'
});

// Track user interaction
shellClient.tracking.trackClick({
  name: 'create-service',
  level2: '86'
});
```

### UX Plugin

#### UX API

```typescript
interface UxApi {
  showAccountSidebar: () => Promise<void>;
  isAccountSidebarVisible: () => Promise<boolean>;
  showMenuSidebar: () => Promise<void>;
  isMenuSidebarVisible: () => Promise<boolean>;
  startProgress: () => Promise<void>;
  stopProgress: () => Promise<void>;
  openLiveChat: () => Promise<void>;
  closeChatbot: () => Promise<void>;
  showPreloader: () => Promise<void>;
  hidePreloader: () => Promise<void>;
}

// Usage in µApp
const shellClient = await initShellClient();

// Show account sidebar
await shellClient.ux.showAccountSidebar();

// Start progress indicator
await shellClient.ux.startProgress();

// Open live chat
await shellClient.ux.openLiveChat();
```

#### Modal Management

```typescript
import { UxModal } from '@ovh-ux/shell';

// Create modal
const modal = new UxModal({
  content: '<div>Modal content</div>',
  size: 'lg',
  className: 'custom-modal'
});

// Show modal
modal.show();

// Hide modal
modal.hide();

// Change modal size
modal.changeSize('xl');
```

### Location Plugin

#### Location API

```typescript
interface Location {
  availabilityZones: string[];
  cardinalPoint: CardinalPoint;
  cityCode: string;
  cityLatitude: number;
  cityLongitude: number;
  cityName: string;
  code: string;
  countryCode: string;
  countryName: string;
  geographyCode: string;
  geographyName: string;
  location: string;
  name: string;
  openingYear: number;
  specificType: SpecificType;
  type: Type;
}

// Usage in µApp
const shellClient = await initShellClient();

// Get available locations
const locations = await shellClient.location.getLocations();

// Filter locations by type
const standardLocations = locations.filter(loc => 
  loc.specificType === 'STANDARD'
);

// Filter by region
const euLocations = locations.filter(loc => 
  loc.cardinalPoint === 'CENTRAL'
);
```

### Logger Plugin

#### Logger API

```typescript
interface LoggerApi {
  log: (...args: unknown[]) => Promise<void>;
  info: (...args: unknown[]) => Promise<void>;
  warn: (...args: unknown[]) => Promise<void>;
  error: (...args: unknown[]) => Promise<void>;
  debug: (...args: unknown[]) => Promise<void>;
}

// Usage in µApp
const shellClient = await initShellClient();

// Log messages
await shellClient.logger.info('Application started');
await shellClient.logger.warn('Deprecated API used');
await shellClient.logger.error('Failed to load data', error);
await shellClient.logger.debug('Debug information', data);
```

### Message Bus

#### Direct Client Message Bus

```typescript
import { DirectClientMessageBus } from '@ovh-ux/shell';

// Create direct client message bus
const messageBus = new DirectClientMessageBus();

// Send message
messageBus.send('nasha', 'data-updated', {
  serviceId: '123',
  data: serviceData
});

// Listen for messages
messageBus.on('nasha', 'data-updated', (data) => {
  console.log('Data updated:', data);
});
```

#### IFrame Message Bus

```typescript
import { IFrameMessageBus } from '@ovh-ux/shell';

// Create iframe message bus
const messageBus = new IFrameMessageBus();

// Send message to parent
messageBus.send('parent', 'navigation-request', {
  application: 'billing',
  path: '/billing/history'
});

// Listen for messages from parent
messageBus.on('parent', 'locale-changed', (locale) => {
  console.log('Locale changed to:', locale);
});
```

### Advanced Usage Patterns

#### Shell Initialization

```typescript
import { initShellClient } from '@ovh-ux/shell';

// Initialize shell with error handling
const initializeShell = async () => {
  try {
    const shellClient = await initShellClient();
    
    // Configure tracking
    await shellClient.tracking.setConfig('EU', trackingConfig);
    
    // Set up navigation listeners
    shellClient.routing.listenForHashChange();
    
    // Configure locale
    const locale = await shellClient.i18n.getLocale();
    console.log('Current locale:', locale);
    
    return shellClient;
  } catch (error) {
    console.error('Failed to initialize shell:', error);
    throw error;
  }
};
```

#### Plugin Development

```typescript
import { plugin } from '@ovh-ux/shell';

// Create custom plugin
const customPlugin = plugin({
  name: 'custom-plugin',
  init: (shellClient) => {
    return {
      customMethod: () => {
        console.log('Custom method called');
      },
      getCustomData: () => {
        return { data: 'custom' };
      }
    };
  }
});

// Register plugin
shellClient.registerPlugin(customPlugin);
```

#### Error Handling

```typescript
import { initShellClient } from '@ovh-ux/shell';

const shellClient = await initShellClient();

// Wrap shell calls with error handling
const safeShellCall = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (error) {
    console.error('Shell call failed:', error);
    // Fallback behavior
    return null;
  }
};

// Usage
const environment = await safeShellCall(() => 
  shellClient.environment.getEnvironment()
);

const locale = await safeShellCall(() => 
  shellClient.i18n.getLocale()
);
```

### Best Practices

#### 1. Shell Initialization

```typescript
// ✅ CORRECT: Proper shell initialization
const initializeShell = async () => {
  const shellClient = await initShellClient();
  
  // Configure tracking
  await shellClient.tracking.setConfig('EU', trackingConfig);
  
  // Set up listeners
  shellClient.routing.listenForHashChange();
  
  return shellClient;
};

// ❌ WRONG: Missing configuration
const shellClient = await initShellClient();
// Missing tracking configuration and listeners
```

#### 2. Error Handling

```typescript
// ✅ CORRECT: Proper error handling
try {
  await shellClient.navigation.navigateTo('billing', '/history');
} catch (error) {
  console.error('Navigation failed:', error);
  // Fallback navigation
  window.location.href = '/billing/history';
}

// ❌ WRONG: No error handling
await shellClient.navigation.navigateTo('billing', '/history');
```

#### 3. Plugin Usage

```typescript
// ✅ CORRECT: Proper plugin usage
const shellClient = await initShellClient();
await shellClient.ux.startProgress();
// ... do work
await shellClient.ux.stopProgress();

// ❌ WRONG: Missing cleanup
const shellClient = await initShellClient();
await shellClient.ux.startProgress();
// Missing stopProgress call
```

### Common Pitfalls

#### ❌ Wrong: Missing Shell Initialization

```typescript
// Don't use shell without initialization
function MyComponent() {
  const shellClient = useShell(); // May be null
  shellClient.tracking.trackPage(); // Error if null
}
```

#### ✅ Correct: Proper Shell Usage

```typescript
function MyComponent() {
  const shellClient = useShell();
  
  if (!shellClient) {
    return <div>Loading...</div>;
  }
  
  shellClient.tracking.trackPage();
}
```

#### ❌ Wrong: Missing Error Handling

```typescript
// Don't ignore shell errors
const locale = await shellClient.i18n.getLocale();
```

#### ✅ Correct: Handle Shell Errors

```typescript
try {
  const locale = await shellClient.i18n.getLocale();
} catch (error) {
  console.error('Failed to get locale:', error);
  // Use fallback locale
  const locale = 'fr_FR';
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always initialize shell**: Use initShellClient before accessing shell APIs
2. **Handle shell errors**: Wrap shell calls in try-catch blocks
3. **Check shell availability**: Verify shell client is available before use
4. **Configure tracking**: Set up tracking configuration for the application
5. **Clean up listeners**: Remove event listeners when components unmount
6. **Use proper APIs**: Use the correct shell API for each operation
7. **Handle async operations**: Use await for all shell operations
8. **Implement fallbacks**: Provide fallback behavior when shell fails

### Shell Integration Checklist

- [ ] Shell client initialized with initShellClient
- [ ] Tracking configuration set up
- [ ] Navigation listeners configured
- [ ] Error handling implemented
- [ ] Cleanup functions defined
- [ ] Fallback behavior implemented
- [ ] Plugin registration completed
- [ ] Message bus configured

### Communication Checklist

- [ ] Message bus initialized
- [ ] Event listeners set up
- [ ] Message sending implemented
- [ ] Error handling for communication
- [ ] Cleanup of listeners
- [ ] Fallback communication methods

### Performance Optimization Checklist

- [ ] Lazy loading of shell plugins
- [ ] Efficient message handling
- [ ] Proper cleanup of resources
- [ ] Optimized tracking calls
- [ ] Minimal shell API usage
- [ ] Caching of shell data

---

## ⚖️ The Shell's Moral

- **Standardized communication** ensures consistent behavior across all applications
- **Plugin architecture** provides extensible functionality for different use cases
- **Error handling** prevents application crashes and improves reliability
- **Proper initialization** ensures all shell features work correctly

**👉 Good shell integration is invisible to users but essential for application communication.**
