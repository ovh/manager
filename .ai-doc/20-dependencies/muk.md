---
title: Manager UI Kit (MUK)
last_update: 2025-01-27
tags: [muk, manager, ui-kit, components, ovhcloud, react, ods]
ai: true
---

# Manager UI Kit (MUK)

> **📦 Version:** `@ovh-ux/muk@^0.4.0`

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

## 🔗 References

- [Manager Core API](./manager-core-api.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [TanStack React Query](./tanstack-react-query.md)
- [ODS Components](./ods-components.md)

## 📘 Quick Start

### Installation

```json
{
  "dependencies": {
    "@ovh-ux/muk": "^0.4.0"
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

<Button iamActions={['action:read']} urn="urn:resource">
  Click me
</Button>
```

## 🏗️ Architecture

MUK components are wrappers around ODS React components with Manager-specific enhancements (IAM integration, Manager-specific logic).

**Pattern:** All components accept standard ODS props + IAM props (`iamActions`, `urn`, `displayTooltip?`, `tooltipPosition?`).

## 📦 Component Reference

### Layout Components (Priority)

#### BaseLayout
Main application layout with header, breadcrumb, tabs.

```typescript
import { BaseLayout } from '@ovh-ux/muk';

<BaseLayout
  header={{ title: 'App', description: 'Description' }}
  breadcrumb={<Breadcrumb items={items} />}
  tabs={<Tabs items={tabs} />}
>
  <div>Content</div>
</BaseLayout>
```

**Props:** `breadcrumb?`, `header?`, `message?`, `description?`, `subtitle?`, `backLink?`, `tabs?`, `children?`

#### OnboardingLayout
Complete onboarding page with image, title, description, action buttons.

```typescript
import { OnboardingLayout } from '@ovh-ux/muk';

<OnboardingLayout
  title="Welcome"
  description="Get started"
  img={{ src: '/image.png', alt: 'Alt' }}
  orderButtonLabel="Order Now"
  onOrderButtonClick={() => {}}
  orderIam={{ urn: 'urn:resource', iamActions: ['action:create'] }}
  moreInfoHref="/docs"
  moreInfoButtonLabel="Learn More"
>
  <div>Content</div>
</OnboardingLayout>
```

**Props:** `title`, `description?`, `img?`, `orderButtonLabel?`, `orderHref?`, `onOrderButtonClick?`, `isActionDisabled?`, `orderIam?`, `moreInfoHref?`, `moreInfoButtonLabel?`, `moreInfoButtonIcon?`, `isMoreInfoButtonDisabled?`, `hideHeadingSection?`, `children?`

#### RedirectionGuard
Guard that redirects when condition is met.

```typescript
import { RedirectionGuard } from '@ovh-ux/muk';

<RedirectionGuard when={!hasAccess} to="/forbidden" fallback={<div>Loading...</div>}>
  <ProtectedContent />
</RedirectionGuard>
```

#### GridLayout
Grid-based layout system. Props: `columns?`, `gap?`, `className?`, `children`

### Data Components (Priority)

#### Datagrid
Advanced data table with TanStack Table v8.

```typescript
import { Datagrid, useDataApi } from '@ovh-ux/muk';

const columns = [
  { accessorKey: 'name', header: 'Name', isSortable: true, isSearchable: true, isFilterable: true },
  { accessorKey: 'status', header: 'Status', meta: { type: 'badge' } }
];

function DataTable() {
  const { data, isLoading, totalCount, sorting, filters, search } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services'],
    columns
  });

  return (
    <Datagrid
      columns={columns}
      data={data}
      totalCount={totalCount}
      isLoading={isLoading}
      sorting={sorting}
      filters={filters}
      search={search}
    />
  );
}
```

**Key Props:**
- `columns: DatagridColumn<T>[]` - Column definitions with `accessorKey`, `header`, `isSortable?`, `isSearchable?`, `isFilterable?`, `filterOptions?`, `meta?`
- `data: T[]` - Data array
- `totalCount?: number` - Total items (NOT `totalItems`)
- `isLoading?: boolean`
- `sorting?`, `filters?`, `search?` - From `useDataApi` hook
- `expandable?`, `rowSelection?`, `columnVisibility?`, `topbar?`, `onFetchNextPage?`, `renderSubComponent?`

**Column Definition:**
```typescript
interface DatagridColumn<T> extends ColumnDef<T> {
  accessorKey: string;
  header: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  filterOptions?: Option[];
  enableHiding?: boolean;
  meta?: { type?: ColumnMetaType; className?: string };
}
```

### Form Components

**All form components support IAM props:** `iamActions?`, `urn?`, `displayTooltip?`, `tooltipPosition?`

| Component | Key Props | Usage Pattern |
|-----------|-----------|---------------|
| **Button** | `variant?`, `size?`, `disabled?`, `onClick?` + IAM | Standard button with IAM |
| **Checkbox** | `checked`, `onChange`, `disabled?` + IAM | Checkbox with IAM |
| **Combobox** | `options`, `value`, `onChange`, `placeholder?`, `searchable?`, `multiple?` | Searchable dropdown |
| **Datepicker** | `value`, `onChange`, `format?`, `minDate?`, `maxDate?` | Date selection |
| **FileUpload** | `onFileSelect`, `accept?`, `maxSize?`, `multiple?`, `disabled?` | File upload |
| **FormField** | `label`, `required?`, `error?`, `help?` | Form field wrapper |
| **Input** | `value`, `onChange`, `type?`, `placeholder?`, `disabled?`, `error?` | Text input |
| **PhoneNumber** | `value`, `onChange`, `country?`, `placeholder?` | Phone input |
| **Quantity** | `value`, `onChange`, `min?`, `max?`, `step?` | Number input with controls |
| **RadioGroup** | `value`, `onChange`, `options`, `disabled?` | Radio buttons |
| **Select** | `value`, `onChange`, `options`, `placeholder?`, `searchable?` | Dropdown |
| **Switch** | `checked`, `onChange`, `size?` | Toggle switch |
| **Textarea** | `value`, `onChange`, `rows?`, `maxLength?`, `disabled?` | Multi-line text |
| **Timepicker** | `value`, `onChange`, `format?` | Time selection |
| **Toggle** | `checked`, `onChange`, `size?` | Toggle component |
| **TilesInput** | `name`, `value`, `onChange`, `options: Array<{label, value, disabled?}>` | Tile-based choice |
| **TilesInputGroup** | `children` (TilesInput components) | Group multiple tiles |

### UI Components

| Component | Key Props | Usage Pattern |
|-----------|-----------|---------------|
| **Accordion** | `children` (AccordionItem) | Collapsible content |
| **Badge** | `color?`, `size?`, `variant?` | Status badges |
| **Breadcrumb** | `items: Array<{label, href?}>` | Navigation breadcrumbs |
| **Clipboard** | `text`, `onCopy?`, `tooltip?` | Copy to clipboard |
| **Drawer** | `open`, `onOpenChange`, `side?`, `size?` | Slide-out panel |
| **Link** | `href`, `external?` + IAM | Enhanced links |
| **LinkCard** | `href`, `title`, `description?`, `image?` + IAM | Card with link |
| **Message** | `type`, `title?`, `description?`, `closable?`, `onClose?` | User messages |
| **Modal** | `open`, `onOpenChange`, `title?`, `size?` | Modal dialogs |
| **Notifications** | `notifications`, `onRemove`, `position?`, `duration?` | Toast notifications |
| **Popover** | `children` (PopoverTrigger, PopoverContent) | Floating content |
| **Progress** | `value`, `max?`, `size?`, `variant?`, `showValue?` | Progress indicators |
| **Tabs** | `value`, `onValueChange`, `items: Array<{value, label, content}>` | Tab navigation |
| **Tile** | `title`, `description?`, `image?`, `href?` + IAM | Content tiles |
| **Tooltip** | `content`, `position?`, `delay?` | Hover tooltips |
| **TreeView** | `data`, `onNodeSelect?`, `onNodeToggle?`, `expandable?`, `selectable?` | Hierarchical data |
| **Text** | `preset?` (ODS preset) + IAM | Text with IAM support |
| **Price** | `value`, `currency`, `subsidiary?` (OvhSubsidiary), `intervalUnit?` (IntervalUnitType) | Price display |
| **Step** | `current`, `total`, `label?` | Step indicator |
| **GuideMenu** | `items: Array<{label, href}>` | Contextual guide menu |
| **ChangelogMenu** | `entries: Array<{date, title, description}>` | Changelog entries |

### Feedback Components

| Component | Key Props | Usage Pattern |
|-----------|-----------|---------------|
| **ActionBanner** | `type`, `title?`, `description?`, `actionLabel?`, `onAction?`, `dismissible?`, `onDismiss?` | Action prompts |
| **Error** | `title?`, `message?`, `details?`, `onRetry?`, `onDismiss?` | Error displays |
| **ErrorBoundary** | `fallback?`, `onError?`, `children` | Error catching |
| **ServiceStateBadge** | `status`, `size?`, `showIcon?` | Service status |
| **TagsList** | `tags`, `onAdd?`, `onRemove?`, `onEdit?`, `editable?`, `addLabel?` | Tag management |
| **TagsTile** | `tags`, `maxDisplay?`, `onTagClick?`, `showCount?` | Tag display |
| **UpdateNameModal** | `open`, `onOpenChange`, `defaultValue`, `onSubmit` | Update resource name |
| **DeleteModal** | `open`, `onOpenChange`, `title`, `description?`, `onConfirm` | Deletion confirmation |

## 🔧 Hooks

### useDataApi (Priority)
Primary data fetching hook with pagination, sorting, filtering.

```typescript
import { useDataApi } from '@ovh-ux/muk';

const {
  data,           // TData[]
  isLoading,
  error,
  hasNextPage,
  fetchNextPage,
  totalCount,
  flattenData,
  sorting,        // { sorting, setSorting, manualSorting }
  filters,        // { filters, add, remove }
  search          // { onSearch, searchInput, setSearchInput }
} = useDataApi({
  route: '/api/services',
  version: 'v2' | 'v6',  // REQUIRED
  cacheKey: ['services'], // REQUIRED
  pageSize?: number,
  defaultSorting?: SortingState,
  columns?: DatagridColumn<TData>[],
  enabled?: boolean,
  refetchInterval?: number,
  fetchAll?: boolean,
  disableCache?: boolean,
  fetchDataFn?: (route: string) => Promise<{ data: TData[] }>
});
```

### Utility Hooks

| Hook | Returns | Usage |
|------|---------|-------|
| **useAuthorizationIam** | `{ isAuthorized, isLoading }` | IAM authorization check |
| **useDatagridSearchParams** | `{ searchParams, setSearchParams }` | Search params for datagrid |
| **useColumnFilters** | `{ filters, add, remove }` | Column filtering |
| **useBreadcrumb** | `breadcrumbItems` | Breadcrumb management |
| **useBytes** | `{ formatBytes, parseBytes }` | Byte formatting |
| **useCatalogPrice** | `{ formatPrice, getCurrency }` | Price formatting |
| **useMe** | `{ user, isLoading }` | User information |
| **useRegion** | `{ region, setRegion }` | Region information |

## 🎨 IAM Integration

**All MUK components support IAM props:**
- `iamActions?: string[]` - Required IAM actions
- `urn?: string` - Resource URN
- `displayTooltip?: boolean` - Show tooltip when unauthorized
- `tooltipPosition?: TOOLTIP_POSITION` - Tooltip position

**Pattern:**
```typescript
<Component
  iamActions={['service:read', 'service:write']}
  urn="urn:v1:eu:service:123"
  displayTooltip={true}
>
  Content
</Component>
```

Components automatically disable/hide when unauthorized.

## 📝 Advanced Usage Examples

### Complete Application Setup

```typescript
import '@ovh-ux/muk/dist/style.css';
import { BaseLayout, Datagrid, useDataApi } from '@ovh-ux/muk';

function App() {
  const { data, isLoading } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services']
  });

  return (
    <BaseLayout header={{ title: 'Services' }} breadcrumb={<Breadcrumb items={items} />}>
      <Datagrid columns={columns} data={data} totalCount={totalCount} isLoading={isLoading} />
    </BaseLayout>
  );
}
```

### Data Table with Filters

```typescript
import { Datagrid, useDataApi, useColumnFilters } from '@ovh-ux/muk';

function ServicesTable() {
  const { filters, add, remove } = useColumnFilters();
  const { data, isLoading, totalCount, sorting, filters: apiFilters, search } = useDataApi({
    route: '/api/services',
    version: 'v2',
    cacheKey: ['services'],
    columns: [
      { accessorKey: 'name', header: 'Name', isSortable: true, isFilterable: true },
      { accessorKey: 'status', header: 'Status', meta: { type: 'badge' }, filterOptions: [...] }
    ]
  });

  return (
    <Datagrid
      columns={columns}
      data={data}
      totalCount={totalCount}
      isLoading={isLoading}
      sorting={sorting}
      filters={{ filters: apiFilters.filters, add: apiFilters.add, remove: apiFilters.remove }}
      search={search}
    />
  );
}
```

## ⚠️ Critical Warnings

### ❌ Common Mistakes

```typescript
// ❌ Missing CSS import
import { Button } from '@ovh-ux/muk';
// ✅ import '@ovh-ux/muk/dist/style.css';

// ❌ Non-existent components
import { Title, Subtitle } from '@ovh-ux/muk';
// ✅ Use: <Text preset={TEXT_PRESET.heading1}>Title</Text>

// ❌ Wrong Datagrid prop
<Datagrid totalItems={100} /> // ❌
<Datagrid totalCount={100} /> // ✅

// ❌ Missing IAM
<Button>Edit</Button> // ❌
<Button iamActions={['edit']} urn="urn:resource">Edit</Button> // ✅
```

### ✅ Best Practices

```typescript
// ✅ Complete setup
import '@ovh-ux/muk/dist/style.css';
import { Button, Datagrid } from '@ovh-ux/muk';

// ✅ IAM integration
<Button iamActions={['service:edit']} urn="urn:v1:eu:service:123" displayTooltip={true}>
  Edit
</Button>

// ✅ Data fetching
const { data, isLoading } = useDataApi({
  route: '/api/services',
  version: 'v2',
  cacheKey: ['services']
});

// ✅ Tree-shaking
import { Button, Datagrid } from '@ovh-ux/muk'; // ✅
import * as MUK from '@ovh-ux/muk'; // ❌
```

## 🚀 Performance

- **Tree-shaking**: Import specific components
- **Cache keys**: Include dependencies in `cacheKey` for `useDataApi`
- **Loading states**: Always handle `isLoading` from hooks

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@ovh-ux/muk';

test('renders button with IAM', () => {
  render(<Button iamActions={['read']} urn="urn:test">Test</Button>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## 📚 TypeScript

All components have full TypeScript support. Import types:

```typescript
import type {
  ButtonProps,
  DatagridProps,
  OnboardingLayoutProps,
  BaseLayoutProps,
  UseDataApiOptions,
  UseDataApiResult
} from '@ovh-ux/muk';
```

---

## 🤖 AI Development Guidelines

### Essential Rules

1. **Always import CSS**: `import '@ovh-ux/muk/dist/style.css'`
2. **Use real component names**: Button, Datagrid, OnboardingLayout (not Title, Subtitle)
3. **Include IAM props**: Always add `iamActions` and `urn` for security
4. **Use correct Datagrid props**: `totalCount` not `totalItems`
5. **Import specific components**: Don't use `import *`
6. **Use useDataApi for data**: Primary hook for data fetching
7. **Handle loading states**: Always check `isLoading`

### Quick Reference Checklist

- [ ] CSS import added
- [ ] Correct component names used
- [ ] IAM props included where needed
- [ ] Loading states handled
- [ ] Datagrid uses `totalCount` (not `totalItems`)
- [ ] Tree-shaking (specific imports)

---

## ⚖️ The MUK's Moral

- **Unified development** ensures consistency across all Manager applications
- **IAM integration** provides security by default
- **ODS foundation** guarantees design system compliance
- **Performance optimization** ensures fast, scalable applications

**👉 Good MUK usage is invisible to users but essential for Manager application success.**
