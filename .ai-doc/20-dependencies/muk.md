---
title: Manager UI Kit (MUK)
last_update: 2025-01-27
tags: [muk, manager, ui-kit, components, ovhcloud, react, ods]
ai: true
---

# Manager UI Kit (MUK)

> **📦 Version:** `@ovh-ux/muk@^0.1.1`

## 🧭 Purpose

The **Manager UI Kit (MUK)** is the official UI component library for OVHcloud Manager applications. It provides a unified entry point for all Manager components, hooks, and utilities, built on top of OVHcloud Design System (ODS) v19.2.1.

MUK eliminates dependency clutter, simplifies imports, and accelerates development with one consistent source of truth for all Manager applications.

## ⚙️ Context

MUK is designed for:
- **Unified component library** for all Manager µApps
- **ODS wrapper components** with Manager-specific enhancements
- **IAM integration** built into every component
- **Data fetching hooks** optimized for Manager APIs
- **Accessibility compliance** with WCAG standards
- **Performance optimization** with tree-shaking support

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Consistent UI/UX** across all applications
- **Rapid development** with pre-built components
- **Data management** with specialized hooks

## 🔗 References

- [Manager Core API](./manager-core-api.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [TanStack React Query](./tanstack-react-query.md)
- [ODS Components](./ods-components.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/muk": "^0.1.1"
  }
}
```

### CSS Import (REQUIRED)

```typescript
// REQUIRED: Import MUK styles
import '@ovh-ux/muk/dist/style.css';
```

### Basic Usage

```typescript
import { Button, Datagrid, OnboardingLayout } from '@ovh-ux/muk';

// Use components with IAM integration
<Button iamActions={['action:read']} urn="urn:resource">
  Click me
</Button>
```

## 🏗️ Architecture

### ODS Wrapper Pattern

MUK components are wrappers around ODS React components with Manager-specific enhancements:

```typescript
// MUK Button wraps ODS Button with IAM integration
import { Button as OdsButton } from '@ovhcloud/ods-react';

export const Button = ({ iamActions, urn, ...props }) => {
  const { isAuthorized } = useAuthorizationIam(iamActions, urn);
  
  if (isAuthorized) {
    return <OdsButton {...props} />;
  }
  
  return <OdsButton {...props} disabled />;
};
```

### Component Categories

#### Layout Components
- **BaseLayout**: Main application layout with header, breadcrumb, tabs
- **OnboardingLayout**: Onboarding pages with CTA buttons
- **GridLayout**: Grid-based layouts

#### Data Components
- **Datagrid**: Advanced data table (TanStack Table v8)
- **Filters**: Filtering system
- **useDataApi**: Primary data fetching hook

#### Form Components
- **Button**: Enhanced button with IAM
- **Checkbox**: Checkbox with IAM support
- **Combobox**: Searchable dropdown
- **Datepicker**: Date selection
- **FileUpload**: File upload component
- **FormField**: Form field wrapper
- **Input**: Text input with validation
- **PhoneNumber**: Phone number input
- **Quantity**: Number input with controls
- **RadioGroup**: Radio button group
- **Select**: Dropdown selection
- **Switch**: Toggle switch
- **Textarea**: Multi-line text input
- **Timepicker**: Time selection
- **Toggle**: Toggle component

#### UI Components
- **Accordion**: Collapsible content
- **Badge**: Status badges
- **Breadcrumb**: Navigation breadcrumbs
- **Clipboard**: Copy to clipboard
- **Drawer**: Slide-out panel
- **Link**: Enhanced links
- **LinkCard**: Card with link
- **Message**: User messages
- **Modal**: Modal dialogs
- **Notifications**: Toast notifications
- **Popover**: Floating content
- **Progress**: Progress indicators
- **Tabs**: Tab navigation
- **Tile**: Content tiles
- **Tooltip**: Hover tooltips
- **TreeView**: Hierarchical data

#### Feedback Components
- **ActionBanner**: Action prompts
- **Error**: Error displays
- **ErrorBoundary**: Error catching
- **ServiceStateBadge**: Service status
- **TagsList**: Tag management
- **TagsTile**: Tag display

## 🎯 Key Components

### OnboardingLayout

Complete onboarding page layout with image, title, description, and action buttons.

```typescript
import { OnboardingLayout } from '@ovh-ux/muk';

<OnboardingLayout
  title="Welcome to NAS-HA"
  description="Get started with your NAS-HA service"
  img={{ src: '/path/to/image.png', alt: 'NAS-HA' }}
  orderButtonLabel="Order Now"
  onOrderButtonClick={() => handleOrder()}
  orderIam={{
    urn: 'urn:resource',
    iamActions: ['action:create']
  }}
  moreInfoHref="/docs"
  moreInfoButtonLabel="Learn More"
>
  {/* Tutorial tiles */}
  <div>Tutorial content</div>
</OnboardingLayout>
```

**Props:**
```typescript
interface OnboardingLayoutProps {
  title: string;
  description?: ReactNode;
  img?: ComponentProps<'img'>;
  orderButtonLabel?: string;
  orderHref?: string;
  onOrderButtonClick?: () => void;
  isActionDisabled?: boolean;
  orderIam?: {
    urn: string;
    iamActions: string[];
    displayTooltip?: boolean;
  };
  moreInfoHref?: string;
  moreInfoButtonLabel?: string;
  moreInfoButtonIcon?: ICON_NAME;
  isMoreInfoButtonDisabled?: boolean;
  hideHeadingSection?: boolean;
  children?: ReactNode;
}
```

### BaseLayout

Main application layout with header, breadcrumb, and content areas.

```typescript
import { BaseLayout } from '@ovh-ux/muk';

<BaseLayout
  header={{
    title: 'My Application',
    description: 'Application description'
  }}
  breadcrumb={<Breadcrumb items={breadcrumbItems} />}
  tabs={<Tabs items={tabItems} />}
>
  <div>Main content</div>
</BaseLayout>
```

**Props:**
```typescript
interface BaseLayoutProps {
  breadcrumb?: ReactElement;
  header?: HeaderProps;
  message?: ReactElement;
  description?: string;
  subtitle?: string;
  backLink?: {
    label: string;
    onClick?: () => void;
    previousPageLink?: string;
  };
  tabs?: ReactElement;
  children?: ReactNode;
}
```

### Datagrid

Advanced data table with sorting, filtering, search, and pagination.

```typescript
import { Datagrid, useDataApi } from '@ovh-ux/muk';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    isSortable: true,
    isSearchable: true,
    isFilterable: true
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { type: 'badge' }
  }
];

function DataTable() {
  const { data, isLoading, totalCount } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services']
  });

  return (
    <Datagrid
      columns={columns}
      data={data}
      totalCount={totalCount}
      isLoading={isLoading}
    />
  );
}
```

**Props:**
```typescript
interface DatagridProps<T> {
  columns: readonly DatagridColumn<T>[];
  data: T[];
  totalCount?: number;
  isLoading?: boolean;
  hasNextPage?: boolean;
  autoScroll?: boolean;
  containerHeight?: number;
  contentAlignLeft?: boolean;
  expandable?: ExpandedProps;
  filters?: FilterProps;
  rowSelection?: RowSelectionProps<T>;
  search?: SearchProps;
  sorting?: SortingProps;
  columnVisibility?: ColumnVisibilityProps;
  topbar?: ReactNode;
  onFetchAllPages?: () => void;
  onFetchNextPage?: () => void;
  renderSubComponent?: (row: Row<T>) => JSX.Element;
}
```

## 🔧 Hooks

### useDataApi

Primary data fetching hook with pagination, sorting, and filtering.

```typescript
import { useDataApi } from '@ovh-ux/muk';

const {
  data,
  isLoading,
  error,
  hasNextPage,
  fetchNextPage,
  totalCount,
  flattenData,
  sorting,
  filters,
  search
} = useDataApi({
  route: '/api/services',
  version: 'v2',
  cacheKey: ['services'],
  pageSize: 20,
  defaultSorting: [{ id: 'name', desc: false }]
});
```

**Options:**
```typescript
interface UseDataApiOptions<TData> {
  route?: string;
  version: 'v2' | 'v6';
  iceberg?: boolean;
  cacheKey: string | string[];
  enabled?: boolean;
  refetchInterval?: number;
  pageSize?: number;
  defaultSorting?: SortingState;
  fetchAll?: boolean;
  disableCache?: boolean;
  columns?: DatagridColumn<TData>[];
  fetchDataFn?: (route: string) => Promise<{ data: TData[] }>;
}
```

**Returns:**
```typescript
interface UseDataApiResult<TData> {
  data: TData[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  totalCount?: number;
  flattenData: TData[];
  pageIndex?: number;
  sorting?: {
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    manualSorting: boolean;
  };
  filters?: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: Filter) => void;
  };
  search?: {
    onSearch: (search: string | undefined) => void;
    searchInput: string;
    setSearchInput: Dispatch<SetStateAction<string>>;
  };
}
```

### Other Hooks

```typescript
// IAM & Permissions
import { useAuthorizationIam } from '@ovh-ux/muk';

// Data utilities
import { useDatagridSearchParams, useColumnFilters } from '@ovh-ux/muk';

// UI utilities
import { useBreadcrumb, useBytes, useCatalogPrice } from '@ovh-ux/muk';

// Date utilities
import { useDateFormatter, useDateRange } from '@ovh-ux/muk';

// User & Region
import { useMe, useRegion } from '@ovh-ux/muk';
```

## 🎨 IAM Integration

All MUK components support IAM (Identity and Access Management) integration:

```typescript
// Button with IAM
<Button
  iamActions={['service:read', 'service:write']}
  urn="urn:v1:eu:service:123"
  displayTooltip={true}
>
  Edit Service
</Button>

// Text with IAM
<Text
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
>
  Sensitive Information
</Text>

// Any component with IAM
<Component
  iamActions={string[]}
  urn={string}
  displayTooltip?: boolean
  tooltipPosition?: TOOLTIP_POSITION
>
  Content
</Component>
```

## 📝 Advanced Usage

### Complete Application Setup

```typescript
// App.tsx
import '@ovh-ux/muk/dist/style.css';
import { BaseLayout, Datagrid, useDataApi } from '@ovh-ux/muk';

function App() {
  const { data, isLoading } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services']
  });

  return (
    <BaseLayout
      header={{ title: 'Services' }}
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
    >
      <Datagrid
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}
```

### Onboarding Page

```typescript
// OnboardingPage.tsx
import { OnboardingLayout } from '@ovh-ux/muk';

export default function OnboardingPage() {
  return (
    <OnboardingLayout
      title="Welcome to NAS-HA"
      description="Get started with your NAS-HA service"
      img={{ src: '/nasha-icon.png', alt: 'NAS-HA' }}
      orderButtonLabel="Order NAS-HA"
      onOrderButtonClick={() => window.open('/order')}
      orderIam={{
        urn: 'urn:v1:eu:product:nasha',
        iamActions: ['product:create']
      }}
      moreInfoHref="/docs"
      moreInfoButtonLabel="Documentation"
    >
      {/* Tutorial tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Tile>Getting Started</Tile>
        <Tile>NFS Configuration</Tile>
        <Tile>CIFS Configuration</Tile>
      </div>
    </OnboardingLayout>
  );
}
```

### Data Table with Filters

```typescript
// ServicesTable.tsx
import { Datagrid, useDataApi, useColumnFilters } from '@ovh-ux/muk';

export default function ServicesTable() {
  const { filters, add, remove } = useColumnFilters();
  
  const { data, isLoading, totalCount } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services'],
    columns: [
      {
        accessorKey: 'name',
        header: 'Name',
        isSortable: true,
        isSearchable: true,
        isFilterable: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { type: 'badge' },
        isFilterable: true,
        filterOptions: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      }
    ]
  });

  return (
    <Datagrid
      columns={columns}
      data={data}
      totalCount={totalCount}
      isLoading={isLoading}
      filters={{ filters, add, remove }}
    />
  );
}
```

## ⚠️ Critical Warnings

### ❌ Common Mistakes

```typescript
// ❌ WRONG: Missing CSS import
import { Button } from '@ovh-ux/muk';
// Missing: import '@ovh-ux/muk/dist/style.css';

// ❌ WRONG: Using non-existent components
import { Title, Subtitle } from '@ovh-ux/muk';
// Use: <Text preset={TEXT_PRESET.heading1}>Title</Text>

// ❌ WRONG: Incorrect Datagrid props
<Datagrid totalItems={100} /> // totalItems doesn't exist
<Datagrid totalCount={100} /> // ✅ CORRECT

// ❌ WRONG: Missing IAM props
<Button>Edit</Button> // No IAM protection
<Button iamActions={['edit']} urn="urn:resource">Edit</Button> // ✅ CORRECT
```

### ✅ Best Practices

```typescript
// ✅ CORRECT: Complete setup
import '@ovh-ux/muk/dist/style.css';
import { Button, Datagrid, useDataApi } from '@ovh-ux/muk';

// ✅ CORRECT: IAM integration
<Button
  iamActions={['service:edit']}
  urn="urn:v1:eu:service:123"
  displayTooltip={true}
>
  Edit Service
</Button>

// ✅ CORRECT: Data fetching
const { data, isLoading } = useDataApi({
  route: '/api/services',
  version: 'v2',
  cacheKey: ['services']
});

// ✅ CORRECT: Datagrid usage
<Datagrid
  columns={columns}
  data={data}
  totalCount={totalCount}
  isLoading={isLoading}
/>
```

## 🚀 Performance Optimization

### Tree Shaking

```typescript
// ✅ CORRECT: Import only what you need
import { Button, Datagrid } from '@ovh-ux/muk';

// ❌ WRONG: Import everything
import * as MUK from '@ovh-ux/muk';
```

### Data Fetching Optimization

```typescript
// ✅ CORRECT: Use appropriate cache keys
const { data } = useDataApi({
  cacheKey: ['services', filters, sorting], // Include dependencies
  refetchInterval: 30000, // 30 seconds
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

## 🧪 Testing

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@ovh-ux/muk';

test('renders button with IAM', () => {
  render(
    <Button iamActions={['read']} urn="urn:test">
      Test Button
    </Button>
  );
  
  expect(screen.getByText('Test Button')).toBeInTheDocument();
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useDataApi } from '@ovh-ux/muk';

test('fetches data correctly', async () => {
  const { result } = renderHook(() =>
    useDataApi({
      route: '/api/test',
      version: 'v2',
      cacheKey: ['test']
    })
  );

  expect(result.current.isLoading).toBe(true);
});
```

## 📚 TypeScript Support

### Component Props

```typescript
import { ButtonProps, DatagridProps, OnboardingLayoutProps } from '@ovh-ux/muk';

// All components have full TypeScript support
const buttonProps: ButtonProps = {
  iamActions: ['read'],
  urn: 'urn:test',
  children: 'Click me'
};
```

### Hook Types

```typescript
import { UseDataApiOptions, UseDataApiResult } from '@ovh-ux/muk';

const options: UseDataApiOptions<Service> = {
  route: '/api/services',
  version: 'v2',
  cacheKey: ['services']
};

const result: UseDataApiResult<Service> = useDataApi(options);
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always import CSS**: `import '@ovh-ux/muk/dist/style.css'`
2. **Use real component names**: Button, Datagrid, OnboardingLayout (not Title, Subtitle)
3. **Include IAM props**: Always add `iamActions` and `urn` for security
4. **Use correct Datagrid props**: `totalCount` not `totalItems`
5. **Import specific components**: Don't use `import *`
6. **Use useDataApi for data**: Primary hook for data fetching
7. **Follow ODS patterns**: MUK wraps ODS components
8. **Handle loading states**: Always check `isLoading`

### Component Usage Checklist

- [ ] CSS import added
- [ ] Correct component names used
- [ ] IAM props included where needed
- [ ] Props match TypeScript definitions
- [ ] Loading states handled
- [ ] Error handling implemented
- [ ] Performance optimized

### Data Fetching Checklist

- [ ] useDataApi hook used
- [ ] Cache keys properly configured
- [ ] Version specified (v2/v6)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Pagination configured
- [ ] Sorting/filtering enabled

---

## ⚖️ The MUK's Moral

- **Unified development** ensures consistency across all Manager applications
- **IAM integration** provides security by default
- **ODS foundation** guarantees design system compliance
- **Performance optimization** ensures fast, scalable applications

**👉 Good MUK usage is invisible to users but essential for Manager application success.**