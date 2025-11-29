---
title: React Application Tracking
last_update: 2025-01-27
tags: [tracking, analytics, react, ovhcloud, manager, at-internet]
ai: true
---

# React Application Tracking

## 🧭 Purpose

This document explains how to implement and use tracking in React applications within the OVHcloud Manager ecosystem. It covers the tracking setup, configuration, and usage patterns for both page display tracking and click tracking using the OvhAtInternet class and custom React hooks.

## ⚙️ Context

The tracking system in React applications:
- **Uses the same tracking tool** as Angular applications (OvhAtInternet)
- **Implements custom hooks** for React-specific usage patterns
- **Follows new nomenclature** standards for React applications
- **Integrates with the shell client** for shared tracking context
- **Supports both page and click tracking** with predefined enums

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
BareMetalCloud::NETWORK::VRACK::VRACK::listing
```

#### Click Tracking Format
Click tracking follows this pattern:

```
{{universe}}::{{range_product}}::{{line_product}}::{{line_product}}::{{page_name}}::{{action}}
```

**Example**: Create button click on VRack listing page
```
BareMetalCloud::NETWORK::VRACK::VRACK::listing::create-button
```

### Setup and Configuration

#### 1. Tracking Constants

Create `tracking.constant.ts`:

```typescript
// tracking.constant.ts
export const APP_NAME = "vrack";
export const UNIVERSE = "BareMetalCloud";
export const SUB_UNIVERSE = "NETWORK";
export const LEVEL2 = "VRACK";
```

#### 2. Shell Context Integration

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
  help = 'help',
  error = 'error'
}
```

### Click Tracking

#### Using the Hook

Use the `useOvhTracking` hook for click tracking:

```typescript
// components/UserActions.tsx
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";

export function UserActions() {
  const { trackClick } = useOvhTracking();

  const handleCreate = () => {
    trackClick('create-button');
    // Your create logic
  };

  const handleEdit = (id: string) => {
    trackClick('edit-button', { id });
    // Your edit logic
  };

  const handleDelete = (id: string) => {
    trackClick('delete-button', { id });
    // Your delete logic
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
      <button onClick={() => handleEdit('123')}>Edit</button>
      <button onClick={() => handleDelete('123')}>Delete</button>
    </div>
  );
}
```

#### Click Tracking with Data

For more detailed tracking, include additional data:

```typescript
// components/UserActions.tsx
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";

export function UserActions() {
  const { trackClick } = useOvhTracking();

  const handleAction = (action: string, data: any) => {
    trackClick(action, {
      ...data,
      timestamp: Date.now(),
      userId: 'user123'
    });
  };

  return (
    <div>
      <button onClick={() => handleAction('create-button', { type: 'user' })}>
        Create User
      </button>
      <button onClick={() => handleAction('create-button', { type: 'group' })}>
        Create Group
      </button>
    </div>
  );
}
```

### Advanced Tracking Patterns

#### Custom Tracking Hook

Create a custom hook for specific tracking needs:

```typescript
// hooks/useCustomTracking.ts
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";

export function useCustomTracking() {
  const { trackClick } = useOvhTracking();

  const trackUserAction = (action: string, userId: string) => {
    trackClick(action, { userId, timestamp: Date.now() });
  };

  const trackPageView = (pageName: string) => {
    trackClick('page-view', { pageName, timestamp: Date.now() });
  };

  return { trackUserAction, trackPageView };
}
```

#### Tracking with Error Handling

Implement error handling for tracking:

```typescript
// components/TrackedComponent.tsx
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";

export function TrackedComponent() {
  const { trackClick } = useOvhTracking();

  const handleAction = async (action: string) => {
    try {
      trackClick(action, { status: 'start' });
      
      // Your action logic
      await performAction();
      
      trackClick(action, { status: 'success' });
    } catch (error) {
      trackClick(action, { status: 'error', error: error.message });
    }
  };

  return (
    <button onClick={() => handleAction('custom-action')}>
      Perform Action
    </button>
  );
}
```

### Testing Tracking

#### Unit Tests

Test tracking functionality in your components:

```typescript
// components/__tests__/UserActions.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useOvhTracking } from "@ovh-ux/manager-react-shell-client";
import { UserActions } from '../UserActions';

jest.mock("@ovh-ux/manager-react-shell-client");

describe('UserActions', () => {
  const mockTrackClick = jest.fn();

  beforeEach(() => {
    (useOvhTracking as jest.Mock).mockReturnValue({
      trackClick: mockTrackClick
    });
  });

  it('should track create button click', () => {
    render(<UserActions />);
    
    fireEvent.click(screen.getByText('Create'));
    
    expect(mockTrackClick).toHaveBeenCalledWith('create-button');
  });

  it('should track edit button click with id', () => {
    render(<UserActions />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(mockTrackClick).toHaveBeenCalledWith('edit-button', { id: '123' });
  });
});
```

#### Integration Tests

Test tracking in the context of the application:

```typescript
// __tests__/tracking.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';

describe('Tracking Integration', () => {
  it('should track page navigation', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to a page
    fireEvent.click(screen.getByText('Users'));
    
    // Verify tracking was called
    // This would depend on your specific tracking implementation
  });
});
```

### Best Practices

#### 1. Consistent Naming
- Use consistent naming conventions for tracking events
- Follow the established nomenclature patterns
- Use descriptive names for actions

#### 2. Minimal Data
- Only track necessary data
- Avoid tracking sensitive information
- Keep tracking payloads small

#### 3. Error Handling
- Always handle tracking errors gracefully
- Don't let tracking errors break your application
- Log tracking errors for debugging

#### 4. Performance
- Use tracking asynchronously when possible
- Avoid blocking the main thread
- Consider batching tracking events

#### 5. Testing
- Test tracking functionality thoroughly
- Mock tracking in unit tests
- Verify tracking in integration tests

### Troubleshooting

#### Common Issues

1. **Tracking not working**
   - Check if the shell context is properly initialized
   - Verify tracking constants are correct
   - Ensure the tracking hook is properly imported

2. **Incorrect nomenclature**
   - Verify the tracking format follows the established pattern
   - Check if all required parts are included
   - Ensure consistent naming across the application

3. **Performance issues**
   - Check if tracking is blocking the main thread
   - Consider using async tracking
   - Verify tracking payload size

#### Debug Mode

Enable debug mode for tracking:

```typescript
// tracking.constant.ts
export const TRACKING_DEBUG = process.env.NODE_ENV === 'development';

// In your tracking hook
if (TRACKING_DEBUG) {
  console.log('Tracking event:', event, data);
}
```

### Migration from Angular

#### Key Differences

1. **Hook-based approach**: React uses hooks instead of services
2. **Automatic page tracking**: Page tracking is handled automatically
3. **Simplified configuration**: Less configuration required
4. **Better TypeScript support**: Improved type safety

#### Migration Steps

1. **Update tracking constants**: Use the new nomenclature format
2. **Replace service calls**: Use the `useOvhTracking` hook
3. **Update route configuration**: Use the new route tracking format
4. **Test tracking**: Verify all tracking events work correctly

### References

- [OVH At Internet Documentation](https://developers.atinternet-solutions.com/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Manager Shell Client Documentation](../20-dependencies/manager-react-shell-client.md)
