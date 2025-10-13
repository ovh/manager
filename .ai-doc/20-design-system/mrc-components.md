---
title: Manager React Components (MRC) Library
last_update: 2025-01-27
tags: [components, react, ui, library, ovhcloud, manager]
ai: true
---

# Manager React Components (MRC) Library

## 🧭 Purpose

The **Manager React Components (MRC)** library is the centralized React component system for the OVHcloud Manager ecosystem. It provides a collection of reusable components, custom hooks, and utilities that standardize the user interface and interactions across all Manager applications.

This library ensures visual and functional consistency by building upon the **ODS Design System (OVHcloud Design System)** while adding Manager-specific functionality.

## ⚙️ Context

MRC is built on the following foundations:

- **React 18+** : Base framework for components
- **ODS Components** : Base components from the OVHcloud design system
- **Tailwind CSS** : Utility-first styling system
- **TypeScript** : Static typing for robustness
- **React Query** : Server state management and caching
- **React i18next** : Internationalization
- **Zustand** : Lightweight client state management

The library is distributed via npm under the name `@ovh-ux/manager-react-components` and is used by all Manager µApps.

## 🔗 References

- [ODS Components](../20-design-system/ods-components.md)
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
│   ├── navigation/      # Navigation components
│   ├── notifications/   # Notification system
│   └── templates/       # Page templates
├── hooks/              # Custom hooks
│   ├── datagrid/       # Datagrid hooks
│   ├── services/       # API service hooks
│   ├── region/         # Region management hooks
│   └── iam/            # Authorization hooks
├── utils/              # Utilities
└── enumTypes/          # Types and enumerations
```

### Main Components

#### Base Components
- **ManagerButton** : Button with IAM integration and tooltips
- **ManagerText** : Text with authorization management
- **ManagerLink** : Link with navigation and authorization
- **Modal** : Modals with loading states and steps
- **Badge** : Status and information badges
- **Clipboard** : Copy-to-clipboard functionality

#### Data Components
- **Datagrid** : Data table with sorting, filters and pagination
- **DatagridTopbar** : Top bar for datagrid with actions
- **TextCell** : Formatted text cell for datagrid
- **ClipboardCell** : Copy-to-clipboard cell for datagrid
- **IndeterminateCheckbox** : Checkbox with indeterminate state
- **Filters** : Advanced filter system
  - **FilterAdd** : Add new filters
  - **FilterList** : Display active filters
  - **TagsFilterForm** : Tag-based filtering
- **TagsList** : Display list of tags
- **TagsModal** : Modal for tag management
- **TagsTile** : Tile component for tags
- **ServiceStateBadge** : Service state badges

#### Navigation Components
- **Breadcrumb** : Breadcrumb navigation
- **Drawer** : Collapsible side drawers
  - **DrawerBase** : Base drawer component
  - **DrawerCollapsible** : Collapsible drawer variant
  - **DrawerBackdrop** : Drawer backdrop
  - **DrawerHandle** : Drawer handle for interaction
- **Navigation Menus** : Navigation menu components
  - **ActionMenu** : Action-based menu
  - **GuideMenu** : Guide navigation menu
  - **ChangelogMenu** : Changelog menu
- **Card** : Navigation card component
- **RedirectionGuard** : Route redirection guard

#### Content Components
- **Headers** : Page header components
- **ManagerTile** : Manager-specific tile component
- **DashboardTile** : Dashboard tile component
- **TileBlock** : Block component for tiles
- **Price** : Price display component
- **FormattedDate** : Formatted date display

#### Container Components
- **Step** : Step indicator component
- **Tabs** : Tab container component

#### Input Components
- **TilesInput** : Tiles-based input component

#### Typography Components
- **Title** : Title component
- **Links** : Link components

#### Template Components
- **BaseLayout** : Base page layout
- **Error** : Error page template
- **ErrorBoundary** : Error boundary component
- **Onboarding** : Onboarding template
- **Layout** : General layout component
- **DeleteModal** : Delete confirmation modal
- **DeleteServiceModal** : Service deletion modal
- **UpdateNameModal** : Name update modal
- **UpdateIamNameModal** : IAM name update modal

#### Specialized Components
- **ActionBanner** : Contextual action banners
- **GuidesHeader** : Guides header component
- **PciGuidesHeader** : PCI-specific guides header
- **Notifications** : Notification system
- **Region** : Region selector
- **Order** : Order components
  - **OrderConfiguration** : Order configuration
  - **OrderSummary** : Order summary
- **PciMaintenanceBanner** : PCI maintenance banner

### Custom Hooks

#### Data Management
```typescript
// API service hooks
import { useMe, useProjectRegions, useCatalogPrice } from '@ovh-ux/manager-react-components';

// Datagrid hooks
import { useDatagrid, useIcebergV2, useIcebergV6, useResourcesV6 } from '@ovh-ux/manager-react-components';

// Service management hooks (deprecated - will be moved to @ovh-ux/manager-module-common-api)
import { useDeleteService, useUpdateServiceName, useServiceDetails } from '@ovh-ux/manager-react-components';
```

#### Authorization Management
```typescript
// IAM hooks for authorization
import { useOvhIam } from '@ovh-ux/manager-react-components';
```

#### Date and Time
```typescript
// Date formatting hooks
import { useDateFnsLocale, useFormatDate, useFormattedDate } from '@ovh-ux/manager-react-components';
```

#### Region Management
```typescript
// Region and micro-region hooks
import { useTranslatedMicroRegions, getMacroRegion, isLocalZone } from '@ovh-ux/manager-react-components';
```

#### PCI (Public Cloud Infrastructure)
```typescript
// PCI-specific hooks
import { useProductMaintenance, useAggregatedPrivateNetworks, useMigrationSteins } from '@ovh-ux/manager-react-components';
```

#### Project Management
```typescript
// Project provider hooks
import { useProject, useProjectUrl } from '@ovh-ux/manager-react-components';
```

#### Feature Availability
```typescript
// Feature availability hooks
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
```

#### Utilities
```typescript
// Utility hooks
import { useBytes, useNotifications, useBreadcrumb } from '@ovh-ux/manager-react-components';

// Task management hooks (deprecated - will be moved to @ovh-ux/manager-module-common-api)
import { useTask } from '@ovh-ux/manager-react-components';
```

### Utilities and Types

#### Utility Functions
```typescript
// Utility functions
import { uniqBy, hashCode } from '@ovh-ux/manager-react-components';
```

#### Enum Types
```typescript
// Enum types and constants
import { Locale, IntervalUnit } from '@ovh-ux/manager-react-components';
```

#### Test Utilities
```typescript
// Test provider for component testing
import { TestProvider } from '@ovh-ux/manager-react-components';
```

### ODS Integration

MRC builds upon ODS for base components:

```typescript
import { 
  OdsButton, 
  OdsModal, 
  OdsText,
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR 
} from '@ovhcloud/ods-components/react';
```

### Configuration and Build

#### Vite Configuration
- Optimized build with dependency externalization
- TypeScript support with type generation
- Tailwind CSS integration
- Static asset copying

#### Tailwind Configuration
```javascript
// Custom Manager breakpoints
screens: {
  xs: '0',
  sm: '36em',
  md: '48em', 
  lg: '62em',
  xl: '75em',
  xxl: '87.5em'
}
```

### Usage in µApps

#### Basic Component Usage
```typescript
// Import components
import { 
  ManagerButton, 
  Datagrid, 
  useDatagrid,
  useMe 
} from '@ovh-ux/manager-react-components';

// Usage with IAM authorization
<ManagerButton
  id="create-instance"
  label="Create Instance"
  iamActions={['instance:create']}
  urn="urn:v1:eu:instance:123"
>
  Create
</ManagerButton>
```

#### Component Props and Interfaces

##### ManagerButton Props
```typescript
interface ManagerButtonProps {
  id: string;                    // Required: unique identifier
  label: string;                 // Required: button label
  iamActions?: string[];         // Optional: IAM actions for authorization
  urn?: string;                  // Optional: resource URN for IAM
  displayTooltip?: boolean;      // Optional: show tooltip when unauthorized (default: true)
  isIamTrigger?: boolean;        // Optional: trigger IAM check (default: true)
  children?: React.ReactNode;    // Optional: button content
}
```

##### Modal Props
```typescript
interface ModalProps {
  heading?: string;              // Optional: modal title
  step?: {                       // Optional: step indicator
    current?: number;
    total?: number;
  };
  type?: ODS_MODAL_COLOR;        // Optional: modal type (information, critical, etc.)
  isLoading?: boolean;           // Optional: loading state
  primaryLabel?: string;         // Optional: primary button label
  isPrimaryButtonLoading?: boolean;
  isPrimaryButtonDisabled?: boolean;
  onPrimaryButtonClick?: () => void;
  secondaryLabel?: string;       // Optional: secondary button label
  isSecondaryButtonLoading?: boolean;
  isSecondaryButtonDisabled?: boolean;
  onSecondaryButtonClick?: () => void;
  onDismiss?: () => void;        // Optional: dismiss handler
  isOpen?: boolean;              // Optional: modal open state (default: true)
  children?: React.ReactNode;    // Optional: modal content
}
```

##### Datagrid Props
```typescript
interface DatagridProps<T> {
  columns: DatagridColumn<T>[];  // Required: column definitions
  items: T[];                    // Required: data items
  totalItems: number;            // Required: total item count
  pagination?: PaginationState;  // Optional: pagination state
  sorting?: ColumnSort;          // Optional: sorting state
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortChange?: any;            // Optional: sort change handler
  className?: string;            // Optional: CSS class
  hasNextPage?: boolean;         // Optional: has more pages
  onFetchNextPage?: any;         // Optional: load more handler
  onFetchAllPages?: React.MouseEventHandler<HTMLOdsButtonElement>;
  manualSorting?: boolean;       // Optional: manual sorting
  manualPagination?: boolean;    // Optional: manual pagination
  noResultLabel?: string;        // Optional: no results message
  isLoading?: boolean;           // Optional: loading state
  numberOfLoadingRows?: number;  // Optional: loading rows count
  filters?: FilterProps;         // Optional: filter configuration
  onSearch?: (search: string) => void; // Optional: search handler
}
```

#### Common Usage Patterns

##### IAM Authorization Pattern
```typescript
// Always use IAM props for security-sensitive components
<ManagerButton
  id="delete-resource"
  label="Delete"
  iamActions={['resource:delete']}
  urn={`urn:v1:eu:resource:${resourceId}`}
  onClick={handleDelete}
/>

<ManagerText iamActions={['resource:read']} urn={resourceUrn}>
  Sensitive information
</ManagerText>
```

##### Modal with Steps Pattern
```typescript
<Modal
  heading="Create Resource"
  step={{ current: 2, total: 3 }}
  type={ODS_MODAL_COLOR.information}
  primaryLabel="Next"
  secondaryLabel="Cancel"
  onPrimaryButtonClick={handleNext}
  onSecondaryButtonClick={handleCancel}
  isOpen={isModalOpen}
>
  <div>Step 2 content</div>
</Modal>
```

##### Datagrid with Filters Pattern
```typescript
const { data, isLoading, pagination, sorting, onPaginationChange, onSortChange } = useDatagrid({
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' }
  ],
  items: resources,
  totalItems: totalCount,
  pagination,
  sorting,
  onPaginationChange,
  onSortChange,
  isLoading,
  filters: {
    filters: activeFilters,
    remove: removeFilter
  }
});

<Datagrid {...data} />
```

##### Error Handling Pattern
```typescript
import { ErrorBoundary } from '@ovh-ux/manager-react-components';

<ErrorBoundary fallback={<ErrorComponent />}>
  <YourComponent />
</ErrorBoundary>
```

##### Region Selection Pattern
```typescript
import { Region } from '@ovh-ux/manager-react-components';

<Region
  regions={availableRegions}
  selectedRegion={currentRegion}
  onRegionChange={handleRegionChange}
/>
```

### Testing and Quality

- **Vitest** : Unit testing framework
- **Testing Library** : React component testing
- **Coverage** : Code coverage
- **TypeScript** : Type checking
- **ESLint/Prettier** : Code quality and formatting

### Development

#### Adding a New Component
1. Create folder in `src/components/`
2. Implement component with tests
3. Add translations if needed
4. Export in `src/components/index.ts`
5. Create Storybook stories
6. Add e2e tests

#### Available Scripts
```bash
# Development
yarn dev          # Development build
yarn test         # Unit tests
yarn test:watch   # Tests in watch mode
yarn test:cov     # Tests with coverage

# Build
yarn build        # Production build
yarn prepare      # Build before publishing
```

### Best Practices

1. **Atomic Components** : Create reusable and modular components
2. **Strict TypeScript** : Use strict typing for robustness
3. **Accessibility** : Follow WCAG standards
4. **Performance** : Optimize re-renders with React.memo and useMemo
5. **Testing** : Maintain high test coverage
6. **Documentation** : Document component props and usage
7. **Internationalization** : All texts must be translated
8. **Authorization** : Integrate IAM for security

### AI Development Guidelines

#### Essential Patterns for AI Code Generation

##### 1. Always Include IAM Authorization
```typescript
// ✅ CORRECT: Always include IAM for security-sensitive components
<ManagerButton
  id="unique-action-id"
  label="Action Label"
  iamActions={['resource:action']}
  urn={`urn:v1:eu:resource:${resourceId}`}
/>

// ❌ WRONG: Missing IAM authorization
<ManagerButton label="Delete" onClick={handleDelete} />
```

##### 2. Use Proper Component Imports
```typescript
// ✅ CORRECT: Import from the main package
import { ManagerButton, Datagrid, useDatagrid } from '@ovh-ux/manager-react-components';

// ❌ WRONG: Direct component imports
import ManagerButton from '@ovh-ux/manager-react-components/src/components/ManagerButton';
```

##### 3. Handle Loading States
```typescript
// ✅ CORRECT: Always handle loading states
const { data, isLoading } = useDatagrid({...});

<Datagrid 
  {...data} 
  isLoading={isLoading}
  noResultLabel="No resources found"
/>
```

##### 4. Use Proper Event Handlers
```typescript
// ✅ CORRECT: Proper event handler types
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
};

// ✅ CORRECT: Modal handlers
const handleModalClose = () => {
  setIsModalOpen(false);
};
```

##### 5. Implement Error Boundaries
```typescript
// ✅ CORRECT: Always wrap components in error boundaries
<ErrorBoundary fallback={<ErrorComponent />}>
  <YourComponent />
</ErrorBoundary>
```

#### Common Pitfalls to Avoid

##### 1. Missing Required Props
```typescript
// ❌ WRONG: Missing required props
<ManagerButton /> // Missing id and label

// ✅ CORRECT: All required props provided
<ManagerButton id="btn-id" label="Button Label" />
```

##### 2. Incorrect IAM URN Format
```typescript
// ❌ WRONG: Invalid URN format
urn="resource:123"

// ✅ CORRECT: Proper URN format
urn="urn:v1:eu:resource:123"
```

##### 3. Missing Translation Keys
```typescript
// ❌ WRONG: Hardcoded strings
<ManagerText>Delete Resource</ManagerText>

// ✅ CORRECT: Use translation keys
<ManagerText>{t('delete_resource')}</ManagerText>
```

##### 4. Improper Datagrid Column Definition
```typescript
// ❌ WRONG: Missing required column properties
const columns = [
  { header: 'Name' } // Missing accessorKey
];

// ✅ CORRECT: Complete column definition
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' }
];
```

##### 5. Missing Test IDs
```typescript
// ❌ WRONG: No test identifiers
<ManagerButton label="Save" />

// ✅ CORRECT: Include test IDs
<ManagerButton 
  id="save-button"
  label="Save"
  data-testid="save-button"
/>
```

#### Component-Specific Guidelines

##### ManagerButton
- Always provide unique `id` and `label`
- Use `iamActions` and `urn` for security-sensitive actions
- Set `displayTooltip={false}` only when tooltip is not needed

##### Modal
- Use `isOpen` state to control visibility
- Provide `onDismiss` handler for proper cleanup
- Use `step` prop for multi-step workflows
- Set appropriate `type` (information, critical, etc.)

##### Datagrid
- Always provide `totalItems` for proper pagination
- Use `useDatagrid` hook for state management
- Implement proper loading and error states
- Use `filters` prop for advanced filtering

##### ManagerText
- Use for text that requires IAM authorization
- Provide `iamActions` and `urn` for sensitive content
- Fallback to regular `OdsText` for non-sensitive content

#### Performance Considerations

##### 1. Memoization
```typescript
// ✅ CORRECT: Memoize expensive computations
const memoizedData = useMemo(() => 
  processData(rawData), [rawData]
);

// ✅ CORRECT: Memoize callbacks
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

##### 2. Conditional Rendering
```typescript
// ✅ CORRECT: Conditional rendering for performance
{isLoading ? (
  <Spinner />
) : (
  <DataComponent data={data} />
)}
```

##### 3. Proper Key Props
```typescript
// ✅ CORRECT: Use stable keys for lists
{items.map(item => (
  <ItemComponent key={item.id} item={item} />
))}
```

#### Testing Guidelines

##### 1. Test IDs
```typescript
// Always include test IDs for components
<ManagerButton 
  id="test-button"
  data-testid="test-button"
  label="Test"
/>
```

##### 2. Mock IAM
```typescript
// Mock IAM hooks in tests
jest.mock('@ovh-ux/manager-react-components', () => ({
  ...jest.requireActual('@ovh-ux/manager-react-components'),
  useAuthorizationIam: () => ({ isAuthorized: true })
}));
```

##### 3. Test Provider
```typescript
// Use TestProvider for component testing
import { TestProvider } from '@ovh-ux/manager-react-components';

render(
  <TestProvider>
    <YourComponent />
  </TestProvider>
);
```
