---
title: Manager React Components (MRC) Library
last_update: 2025-01-27
tags: [components, react, ui, library, ovhcloud, manager]
ai: true
---

# Manager React Components (MRC) Library

> **⚠️ DEPRECATED**: This library is being replaced by [MUK Components](./muk.md). Use MUK as the single source of truth for all UI components.
> **📦 Version:** `@ovh-ux/manager-react-components@^2.39.0`

## 🧭 Purpose

The **Manager React Components (MRC)** library is the centralized React component system for the OVHcloud Manager ecosystem. It provides a collection of reusable components, custom hooks, and utilities that standardize the user interface and interactions across all Manager applications.

**🚨 MIGRATION REQUIRED**: All MRC usage should be migrated to MUK components. See [MUK Components](./muk.md) for the new unified approach.

## ⚙️ Context

MRC is built on the following foundations:

- **React 18+** : Base framework for components
- **ODS Components v18.6.2** : Base components from the OVHcloud design system
- **Tailwind CSS** : Utility-first styling system
- **TypeScript** : Static typing for robustness
- **React Query** : Server state management and caching
- **React i18next** : Internationalization
- **Zustand** : Lightweight client state management

## 🔗 References

- [ODS Components](./ods-components.md)
- [ODS Themes](./ods-themes.md)
- [Frontend React Patterns](../30-best-practices/frontend-react-patterns.md)
- [Manager API Overview](../10-architecture/api-overview.md)
- [Package Repository](https://github.com/ovh/manager/tree/master/packages/manager-react-components)

## 📘 Guidelines / Implementation

### Library Structure

```
src/
├── components/          # Reusable UI components
│   ├── action-banner/   # Action banners
│   ├── datagrid/        # Data tables
│   ├── drawer/          # Side drawers
│   ├── filters/         # Filter system
│   ├── modal/           # Modal dialogs
│   ├── notifications/   # Notification system
│   ├── pagination/      # Pagination controls
│   ├── stepper/         # Step-by-step wizards
│   └── tabs/            # Tab navigation
├── hooks/               # Custom React hooks
│   ├── use-iam/         # IAM authorization hooks
│   ├── use-notifications/ # Notification hooks
│   └── use-tracking/    # Tracking hooks
├── services/            # Business logic services
│   ├── iam/             # IAM service
│   ├── notifications/   # Notification service
│   └── tracking/        # Tracking service
└── utils/               # Utility functions
    ├── iam/             # IAM utilities
    ├── notifications/   # Notification utilities
    └── tracking/        # Tracking utilities
```

### Core Components

#### ActionBanner
**Description**: Banner component for displaying actions and information

**Import**:
```typescript
import { ActionBanner } from '@ovh-ux/manager-react-components';
```

**Props**:
```typescript
interface ActionBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  description?: string;
  actions?: React.ReactNode[];
  onDismiss?: () => void;
  isDismissible?: boolean;
}
```

**Example**:
```typescript
<ActionBanner
  type="info"
  title="Information"
  description="This is an information banner"
  actions={[
    <button key="action1">Action 1</button>,
    <button key="action2">Action 2</button>
  ]}
  onDismiss={handleDismiss}
  isDismissible
/>
```

#### Datagrid
**Description**: Data table component with sorting, filtering, and pagination

**Import**:
```typescript
import { Datagrid, useDatagrid } from '@ovh-ux/manager-react-components';
```

**Props**:
```typescript
interface DatagridProps {
  columns: DatagridColumn[];
  items: any[];
  isLoading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}
```

**Example**:
```typescript
const { data: users, isLoading } = useUsers();

const columns = useDatagrid({
  columns: [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  items: users || []
});

return (
  <Datagrid
    columns={columns}
    items={users || []}
    isLoading={isLoading}
    onSort={handleSort}
    onFilter={handleFilter}
  />
);
```

#### Drawer
**Description**: Side drawer component for additional content

**Import**:
```typescript
import { Drawer } from '@ovh-ux/manager-react-components';
```

**Props**:
```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right';
}
```

**Example**:
```typescript
<Drawer
  isOpen={isDrawerOpen}
  onClose={handleCloseDrawer}
  title="User Details"
  size="medium"
  position="right"
>
  <UserDetails userId={selectedUserId} />
</Drawer>
```

#### Modal
**Description**: Modal component with loading states and steps

**Import**:
```typescript
import { Modal } from '@ovh-ux/manager-react-components';
```

**Props**:
```typescript
interface ModalProps {
  heading?: string;
  step?: { current?: number; total?: number };
  type?: ODS_MODAL_COLOR;
  isLoading?: boolean;
  primaryLabel?: string;
  isPrimaryButtonLoading?: boolean;
  isPrimaryButtonDisabled?: boolean;
  onPrimaryButtonClick?: () => void;
  secondaryLabel?: string;
  isSecondaryButtonDisabled?: boolean;
  onSecondaryButtonClick?: () => void;
  onDismiss?: () => void;
  isOpen?: boolean;
  children?: React.ReactNode;
}
```

**Example**:
```typescript
<Modal
  heading="Create Resource"
  step={{ current: 2, total: 3 }}
  type={ODS_MODAL_COLOR.information}
  primaryLabel="Next"
  secondaryLabel="Cancel"
  onPrimaryButtonClick={handleNext}
  onSecondaryButtonClick={handleCancel}
  onDismiss={handleClose}
  isOpen={isModalOpen}
>
  <CreateResourceForm />
</Modal>
```

#### Stepper
**Description**: Step-by-step wizard component

**Import**:
```typescript
import { Stepper } from '@ovh-ux/manager-react-components';
```

**Props**:
```typescript
interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  isVertical?: boolean;
  isClickable?: boolean;
}
```

**Example**:
```typescript
<Stepper
  steps={[
    { id: 1, label: 'Step 1', description: 'First step' },
    { id: 2, label: 'Step 2', description: 'Second step' },
    { id: 3, label: 'Step 3', description: 'Third step' }
  ]}
  currentStep={currentStep}
  onStepChange={handleStepChange}
  isVertical
  isClickable
/>
```

### Custom Hooks

#### useIam
**Description**: Hook for IAM authorization management

**Import**:
```typescript
import { useIam } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
const { hasPermission, checkPermission, isAuthorized } = useIam();

// Check if user has permission
const canEdit = hasPermission('resource:write');

// Check permission for specific resource
const canEditResource = checkPermission('resource:write', 'urn:v1:eu:resource:123');

// Check if user is authorized for multiple actions
const isAuthorizedForActions = isAuthorized(['resource:read', 'resource:write']);
```

#### useNotifications
**Description**: Hook for managing notifications

**Import**:
```typescript
import { useNotifications } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
const { addSuccess, addError, addWarning, addInfo, removeNotification } = useNotifications();

// Add success notification
addSuccess('Operation completed successfully');

// Add error notification
addError('An error occurred', { error: errorDetails });

// Add warning notification
addWarning('Please review your input');

// Add info notification
addInfo('Information message');

// Remove notification
removeNotification(notificationId);
```

#### useTracking
**Description**: Hook for tracking user interactions

**Import**:
```typescript
import { useTracking } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
const { trackPage, trackClick, trackEvent } = useTracking();

// Track page view
trackPage('user::listing::page');

// Track button click
trackClick('user::listing::create-button');

// Track custom event
trackEvent('user::action::custom', { userId: '123', action: 'custom' });
```

### Services

#### IAM Service
**Description**: Service for IAM authorization management

**Import**:
```typescript
import { IamService } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
const iamService = new IamService();

// Check permission
const hasPermission = await iamService.hasPermission('resource:read');

// Check permission for resource
const canAccess = await iamService.canAccess('resource:read', 'urn:v1:eu:resource:123');

// Get user permissions
const permissions = await iamService.getUserPermissions();
```

#### Notification Service
**Description**: Service for managing notifications

**Import**:
```typescript
import { NotificationService } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
const notificationService = new NotificationService();

// Add notification
notificationService.add({
  type: 'success',
  message: 'Operation completed',
  duration: 5000
});

// Remove notification
notificationService.remove(notificationId);

// Clear all notifications
notificationService.clear();
```

### Utilities

#### IAM Utilities
**Description**: Utility functions for IAM operations

**Import**:
```typescript
import { IamUtils } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
// Format URN
const formattedUrn = IamUtils.formatUrn('resource', '123', 'eu');

// Parse URN
const parsedUrn = IamUtils.parseUrn('urn:v1:eu:resource:123');

// Check URN validity
const isValid = IamUtils.isValidUrn('urn:v1:eu:resource:123');
```

#### Notification Utilities
**Description**: Utility functions for notifications

**Import**:
```typescript
import { NotificationUtils } from '@ovh-ux/manager-react-components';
```

**Usage**:
```typescript
// Format notification message
const formattedMessage = NotificationUtils.formatMessage('Hello {name}', { name: 'John' });

// Validate notification data
const isValid = NotificationUtils.validateNotification(notificationData);

// Generate notification ID
const id = NotificationUtils.generateId();
```

### Best Practices

#### 1. Component Usage
- **Use MRC components**: Prefer MRC components over custom implementations
- **Follow ODS patterns**: Use ODS components as base for MRC components
- **Consistent styling**: Use Tailwind CSS classes for consistent styling
- **TypeScript**: Use TypeScript for all component props and state

#### 2. Hook Usage
- **Custom hooks**: Use MRC custom hooks for common functionality
- **State management**: Use Zustand for client state management
- **Server state**: Use React Query for server state management
- **Error handling**: Implement proper error handling in hooks

#### 3. Service Usage
- **Service layer**: Use MRC services for business logic
- **API integration**: Integrate with Manager API through services
- **Error handling**: Implement proper error handling in services
- **Caching**: Use React Query for API response caching

#### 4. Testing
- **Component testing**: Test MRC components with React Testing Library
- **Hook testing**: Test custom hooks with React Hooks Testing Library
- **Service testing**: Test services with Jest
- **Integration testing**: Test component integration with services

### Migration from AngularJS

#### Key Differences
1. **Component-based**: React components instead of AngularJS directives
2. **Hook-based**: React hooks instead of AngularJS services
3. **State management**: Zustand instead of AngularJS scope
4. **Styling**: Tailwind CSS instead of custom CSS

#### Migration Steps
1. **Install MRC**: Install `@ovh-ux/manager-react-components`
2. **Replace components**: Replace AngularJS components with MRC components
3. **Update hooks**: Replace AngularJS services with MRC hooks
4. **Update styling**: Replace custom CSS with Tailwind CSS classes
5. **Test integration**: Test MRC component integration

### Troubleshooting

#### Common Issues
1. **Import errors**: Check if MRC is properly installed
2. **Type errors**: Ensure TypeScript types are properly imported
3. **Styling issues**: Check if Tailwind CSS is properly configured
4. **Hook errors**: Verify hook dependencies and usage

#### Debug Mode
Enable debug mode for MRC components:

```typescript
// Enable debug mode
process.env.MRC_DEBUG = 'true';

// Debug component props
console.log('MRC Component Props:', props);

// Debug hook state
console.log('MRC Hook State:', state);
```

### References

- [ODS Components Documentation](./ods-components.md)
- [ODS Themes Documentation](./ods-themes.md)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
