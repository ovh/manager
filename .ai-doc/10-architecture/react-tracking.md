---
title: React Application Tracking
last_update: 2025-01-27
tags: [tracking, analytics, react, ovhcloud, manager, at-internet]
ai: true
---

# React Application Tracking

## 🧭 Purpose

This document explains how to implement and use tracking in React applications within the OVHcloud Manager ecosystem. It covers the tracking setup, configuration, and usage patterns for both page display tracking and click tracking using the OvhAtInternet class and custom React hooks.

The tracking system ensures consistent analytics across all Manager applications while maintaining the new nomenclature standards for React applications.

## ⚙️ Context

The tracking system in React applications:
- **Uses the same tracking tool** as Angular applications (OvhAtInternet)
- **Implements custom hooks** for React-specific usage patterns
- **Follows new nomenclature** standards for React applications
- **Integrates with the shell client** for shared tracking context
- **Supports both page and click tracking** with predefined enums

This system is designed for:
- **New µApp projects** with tracking already implemented
- **React applications** in the Manager ecosystem
- **Consistent analytics** across all OVHcloud products
- **Easy configuration** through the generator

## 🔗 References

- [Development Standards](../30-best-practices/development-standards.md)
- [Frontend React Patterns](../30-best-practices/frontend-react-patterns.md)
- [Manager API Overview](./api-overview.md)
- [OVH At Internet Documentation](https://developers.atinternet-solutions.com/)

## 📘 Guidelines / Implementation

### Tracking Nomenclature

#### Page Tracking Format
The new nomenclature for React applications follows this pattern:

```
{{universe}}::{{range_product}}::{{line_product}}::{{line_product}}::{{page_name}}
```

**Example**: VRack services listing page
```
bare_metal_cloud::network::vrack-services::vrack-services::listing
```

#### Structure Breakdown
- **Universe**: High-level product category (e.g., `BareMetalCloud`)
- **Range Product**: Product range (e.g., `Network`)
- **Line Product**: Specific product line (e.g., `vrack-services`)
- **Page Name**: Specific page identifier (e.g., `listing`)

### Application Setup

#### 1. Generator Configuration

When creating a new µApp, the generator will ask for tracking configuration:

```bash
$ yarn workspace @ovh-ux/manager-generator run start
$ plop

? What is the level2 of the app ? 85 - ManagerServer
? What is the universe of the app ? BareMetalCloud
? What is the subuniverse of the app ? NetWork
? What is the name of the new app? vrack services
```

#### 2. Tracking Constants

After generation, you'll find `tracking.constant.ts` at the root of your application:

```typescript
// tracking.constant.ts
export const LEVEL2 = {
  EU: {
    config: {
      level2: "86",
    },
  },
  CA: {
    config: {
      level2: "86",
    },
  },
  US: {
    config: {
      level2: "52",
    },
  },
};

export const UNIVERSE = "BareMetalCloud";
export const SUB_UNIVERSE = "NETWORK";
```

#### 3. Shell Context Integration

Initialize tracking context in `main.tsx`:

```typescript
// main.tsx
import { UNIVERSE, SUB_UNIVERSE, LEVEL2 } from './tracking.constant';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  level2Config: LEVEL2,
  pageTheme: UNIVERSE,
};

const context = await initShellContext(appName, trackingContext);
```

### Page Display Tracking

#### Automatic Implementation

Page display tracking is automatically implemented in your `layout.tsx` file:

```typescript
// layout.tsx
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";

function Layout() {
  const { trackCurrentPage } = useOvhTracking();
  const location = useLocation();

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  return (
    // Your layout content
  );
}
```

#### Route Configuration

Configure tracking for each route in `Routes.tsx`:

```typescript
// Routes.tsx
import { PageType } from "@ovh-ux/manager-react-shell-client";

const routes = [
  {
    id: 'onboarding',
    path: 'onboarding',
    ...lazyRouteConfig(() => import('@/pages/onboarding')),
    handle: {
      tracking: {
        pageName: 'onboarding',
        pageType: PageType.onboarding,
      }
    }
  },
  {
    id: 'listing',
    path: 'listing',
    ...lazyRouteConfig(() => import('@/pages/listing')),
    handle: {
      tracking: {
        pageName: 'listing',
        pageType: PageType.listing,
      }
    }
  },
  {
    id: 'details',
    path: 'details/:id',
    ...lazyRouteConfig(() => import('@/pages/details')),
    handle: {
      tracking: {
        pageName: 'details',
        pageType: PageType.details,
      }
    }
  }
];
```

#### PageType Enum

Available page types for tracking:

```typescript
enum PageType {
  onboarding = 'onboarding',
  listing = 'listing',
  details = 'details',
  creation = 'creation',
  edition = 'edition',
  deletion = 'deletion',
  configuration = 'configuration',
  billing = 'billing',
  support = 'support',
  documentation = 'documentation'
}
```

### Click Tracking

#### Basic Usage

Import and use the `trackClick` method:

```typescript
// Component.tsx
import {
  useOvhTracking,
  PageLocation,
  ButtonType,
  ActionType
} from "@ovh-ux/manager-react-shell-client";

function MyComponent() {
  const { trackClick } = useOvhTracking();

  const handleDelete = () => {
    // Your delete logic
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: ActionType.navigation,
      actions: ["delete-endpoints"],
    });
  };

  const handleCreate = () => {
    // Your create logic
    trackClick({
      location: PageLocation.header,
      buttonType: ButtonType.button,
      actionType: ActionType.navigation,
      actions: ["create-endpoint"],
    });
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
```

#### Tracking Enums

**PageLocation** - Where the click occurred:
```typescript
enum PageLocation {
  header = 'header',
  sidebar = 'sidebar',
  datagrid = 'datagrid',
  modal = 'modal',
  form = 'form',
  breadcrumb = 'breadcrumb',
  tab = 'tab',
  filter = 'filter',
  pagination = 'pagination'
}
```

**ButtonType** - Type of interactive element:
```typescript
enum ButtonType {
  button = 'button',
  link = 'link',
  dropdown = 'dropdown',
  checkbox = 'checkbox',
  radio = 'radio',
  select = 'select',
  input = 'input',
  icon = 'icon'
}
```

**ActionType** - Nature of the action:
```typescript
enum ActionType {
  navigation = 'navigation',
  action = 'action',
  filter = 'filter',
  sort = 'sort',
  export = 'export',
  import = 'import',
  download = 'download',
  upload = 'upload'
}
```

#### Advanced Click Tracking

```typescript
// Advanced tracking with custom actions
const handleComplexAction = () => {
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actionType: ActionType.action,
    actions: ["bulk-delete", "confirm", "success"],
    customData: {
      itemCount: selectedItems.length,
      itemType: 'endpoints'
    }
  });
};

// Tracking with context
const handleContextualAction = (itemId: string, itemType: string) => {
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actionType: ActionType.navigation,
    actions: [`edit-${itemType}`],
    customData: {
      itemId,
      itemType
    }
  });
};
```

### Custom Hook Implementation

#### useOvhTracking Hook

The custom hook provides a clean interface to the tracking system:

```typescript
// useOvhTracking.ts (in shell-client)
interface UseOvhTrackingReturn {
  trackCurrentPage: () => void;
  trackClick: (params: TrackClickParams) => void;
  trackEvent: (event: string, data?: any) => void;
}

interface TrackClickParams {
  location: PageLocation;
  buttonType: ButtonType;
  actionType: ActionType;
  actions: string[];
  customData?: Record<string, any>;
}

export function useOvhTracking(): UseOvhTrackingReturn {
  const shell = useShell();
  const { tracking, pageTracking } = useTrackingContext();

  const trackCurrentPage = useCallback(() => {
    if (tracking && pageTracking) {
      shell.tracking.trackPage({
        name: pageTracking.pageName,
        level2: pageTracking.level2,
        chapter1: tracking.chapter1,
        chapter2: tracking.chapter2,
        chapter3: tracking.chapter3,
        pageTheme: tracking.pageTheme,
      });
    }
  }, [shell.tracking, tracking, pageTracking]);

  const trackClick = useCallback((params: TrackClickParams) => {
    if (tracking) {
      shell.tracking.trackClick({
        name: params.actions.join('::'),
        type: params.buttonType,
        chapter1: tracking.chapter1,
        chapter2: tracking.chapter2,
        chapter3: tracking.chapter3,
        level2: tracking.level2Config,
        ...params.customData
      });
    }
  }, [shell.tracking, tracking]);

  return {
    trackCurrentPage,
    trackClick,
    trackEvent: shell.tracking.trackEvent
  };
}
```

### Testing and Debugging

#### Local Development Testing

1. **Enable Debug Mode**:
   - Open browser DevTools
   - Go to Local Storage panel
   - Add new variable:
     - **Key**: `MANAGER_TRACKING_DEBUG`
     - **Value**: `1`
   - Restart local server or refresh browser

2. **View Tracking Events**:
   - Go to Network panel in DevTools
   - Search for `xiti` in the filter
   - View all tracking requests

#### Staging Environment Testing

```typescript
// Debug tracking in staging
const { trackClick } = useOvhTracking();

const handleDebugClick = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Tracking click:', {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: ActionType.navigation,
      actions: ["test-action"]
    });
  }
  
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actionType: ActionType.navigation,
    actions: ["test-action"]
  });
};
```

### Best Practices

#### 1. Consistent Naming

```typescript
// ✅ CORRECT: Consistent action naming
trackClick({
  actions: ["create-endpoint", "form-submit", "success"]
});

// ❌ WRONG: Inconsistent naming
trackClick({
  actions: ["createEndpoint", "form_submit", "Success"]
});
```

#### 2. Meaningful Actions

```typescript
// ✅ CORRECT: Descriptive actions
trackClick({
  actions: ["bulk-delete-endpoints", "confirm-dialog", "success"]
});

// ❌ WRONG: Generic actions
trackClick({
  actions: ["click", "ok", "done"]
});
```

#### 3. Proper Location Context

```typescript
// ✅ CORRECT: Accurate location
trackClick({
  location: PageLocation.datagrid, // User clicked in datagrid
  actions: ["select-all"]
});

// ❌ WRONG: Wrong location
trackClick({
  location: PageLocation.header, // But action was in datagrid
  actions: ["select-all"]
});
```

#### 4. Complete Route Configuration

```typescript
// ✅ CORRECT: All routes have tracking
const routes = [
  {
    id: 'listing',
    path: 'listing',
    handle: {
      tracking: {
        pageName: 'listing',
        pageType: PageType.listing,
      }
    }
  },
  {
    id: 'details',
    path: 'details/:id',
    handle: {
      tracking: {
        pageName: 'details',
        pageType: PageType.details,
      }
    }
  }
];
```

### Common Patterns

#### 1. CRUD Operations Tracking

```typescript
// Create operation
const handleCreate = () => {
  trackClick({
    location: PageLocation.header,
    buttonType: ButtonType.button,
    actionType: ActionType.navigation,
    actions: ["create-resource"]
  });
  // Navigate to create page
};

// Read operation (page view is automatic)
// No additional tracking needed

// Update operation
const handleEdit = (id: string) => {
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actionType: ActionType.navigation,
    actions: ["edit-resource"],
    customData: { resourceId: id }
  });
  // Navigate to edit page
};

// Delete operation
const handleDelete = (id: string) => {
  trackClick({
    location: PageLocation.datagrid,
    buttonType: ButtonType.button,
    actionType: ActionType.action,
    actions: ["delete-resource", "confirm"],
    customData: { resourceId: id }
  });
  // Show confirmation dialog
};
```

#### 2. Form Tracking

```typescript
const handleFormSubmit = (formData: FormData) => {
  trackClick({
    location: PageLocation.form,
    buttonType: ButtonType.button,
    actionType: ActionType.action,
    actions: ["form-submit", "create-resource"],
    customData: {
      formFields: Object.keys(formData).length,
      hasValidation: true
    }
  });
};

const handleFormCancel = () => {
  trackClick({
    location: PageLocation.form,
    buttonType: ButtonType.button,
    actionType: ActionType.navigation,
    actions: ["form-cancel", "back-to-listing"]
  });
};
```

#### 3. Filter and Search Tracking

```typescript
const handleFilter = (filterType: string, value: string) => {
  trackClick({
    location: PageLocation.filter,
    buttonType: ButtonType.select,
    actionType: ActionType.filter,
    actions: ["apply-filter", filterType],
    customData: { filterValue: value }
  });
};

const handleSearch = (query: string) => {
  trackClick({
    location: PageLocation.header,
    buttonType: ButtonType.input,
    actionType: ActionType.filter,
    actions: ["search", "submit"],
    customData: { queryLength: query.length }
  });
};
```

---

## 🤖 AI Development Guidelines

### Essential Tracking Rules for AI Code Generation

1. **Always configure route tracking**: Every route must have tracking configuration in the handle
2. **Use consistent naming**: Follow kebab-case for actions and use descriptive names
3. **Include proper enums**: Use PageLocation, ButtonType, and ActionType enums
4. **Track meaningful interactions**: Focus on user actions that provide business value
5. **Add custom data when relevant**: Include contextual information for better analytics
6. **Test tracking in development**: Always verify tracking works in local environment
7. **Follow nomenclature standards**: Use the universe::range::line::page format
8. **Implement both page and click tracking**: Cover all user interactions
9. **Use the custom hook**: Always use useOvhTracking instead of direct shell access
10. **Document tracking decisions**: Explain why specific tracking points were chosen

### Tracking Implementation Checklist

- [ ] Route tracking configured for all pages
- [ ] PageType enum used correctly
- [ ] Click tracking implemented for key interactions
- [ ] Proper enums used (PageLocation, ButtonType, ActionType)
- [ ] Consistent action naming (kebab-case)
- [ ] Custom data included when relevant
- [ ] Debug mode tested in development
- [ ] Tracking constants properly configured
- [ ] Shell context initialized correctly
- [ ] useOvhTracking hook used consistently

### Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Missing route tracking
const routes = [
  {
    id: 'listing',
    path: 'listing',
    // Missing handle.tracking
  }
];

// ❌ WRONG: Direct shell access
const shell = useShell();
shell.tracking.trackClick({...}); // Should use useOvhTracking

// ❌ WRONG: Inconsistent naming
trackClick({
  actions: ["createEndpoint", "form_submit", "Success"] // Mixed cases
});

// ❌ WRONG: Missing enums
trackClick({
  location: "datagrid", // Should use PageLocation.datagrid
  buttonType: "button", // Should use ButtonType.button
  actionType: "action"  // Should use ActionType.action
});
```

### Recommended Patterns

```typescript
// ✅ CORRECT: Complete route configuration
const routes = [
  {
    id: 'listing',
    path: 'listing',
    handle: {
      tracking: {
        pageName: 'listing',
        pageType: PageType.listing,
      }
    }
  }
];

// ✅ CORRECT: Using custom hook
const { trackClick } = useOvhTracking();

// ✅ CORRECT: Consistent naming and enums
trackClick({
  location: PageLocation.datagrid,
  buttonType: ButtonType.button,
  actionType: ActionType.navigation,
  actions: ["create-endpoint"],
  customData: { source: "datagrid" }
});
```

---

## ⚖️ The Tracker's Moral

- **Consistent tracking** provides valuable insights into user behavior
- **Proper configuration** ensures accurate analytics across all applications
- **Meaningful events** help improve user experience and business decisions
- **Testing and debugging** prevent tracking issues in production

**👉 Good tracking is invisible to users but invaluable to the business.**
