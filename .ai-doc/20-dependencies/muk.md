---
title: Manager UI Kit (MUK)
last_update: 2025-01-27
tags: [muk, manager, ui-kit, components, ovhcloud, react, ods]
ai: true
---

> **📝 Note:** Cette documentation a été mise à jour le 2025-01-27 avec tous les composants disponibles dans le Storybook MUK.

# Manager UI Kit (MUK)

> **📦 Version:** `@ovh-ux/muk@^0.5.0`

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
    "@ovh-ux/muk": "^0.5.0"
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

### Complete Component List

**All 66 components from Storybook are available:**

- **Layout**: `BaseLayout`, `OnboardingLayout`, `GridLayout`, `RedirectionGuard`
- **Data**: `Datagrid`, `Table`
- **Form**: `Button`, `Checkbox`, `Combobox`, `Datepicker`, `FileUpload`, `FormField`, `Input`, `Password`, `PhoneNumber`, `Quantity`, `RadioGroup`, `Range`, `Select`, `Switch`, `Textarea`, `Timepicker`, `Toggle`, `TilesInputGroup`, `Filters`
- **UI**: `Accordion`, `ActionMenu`, `Badge`, `Badges`, `Breadcrumb`, `Card`, `Clipboard`, `Code`, `Divider`, `Drawer`, `Icon`, `Link`, `LinkCard`, `Medium`, `Message`, `Meter`, `Modal`, `Notifications`, `Pagination`, `Popover`, `ProgressBar`, `Skeleton`, `Spinner`, `Tabs`, `Tag`, `Tile`, `Tooltip`, `TreeView`, `Text`, `Price`, `Step`, `GuideMenu`, `ChangelogMenu`
- **Feedback**: `ActionBanner`, `Error`, `ErrorBoundary`, `ServiceStateBadge`, `TagsList`, `TagsTile`, `UpdateNameModal`, `DeleteModal`, `Order`

**⚠️ Components NOT available:**
- `Links` - Use HTML links with Tailwind
- `Subtitle` - Use HTML heading elements
- `Title` - Use HTML heading elements
- `TilesInput` - Use `TilesInputGroup` instead (TilesInput is not a separate component)

**⚠️ Naming Convention Alert:**
The Storybook displays some component names with spaces (e.g., "Progress Bar", "Action Banner"), but the actual import names use PascalCase (e.g., `ProgressBar`, `ActionBanner`). Always use PascalCase in code.

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
- `variant?`, `size?` - 🔄 Coming soon in future releases

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
| **TilesInputGroup** | `children` (TilesInput components) | Group multiple tiles |
| **Password** | `value`, `onChange`, `showStrength?`, `placeholder?` | Password input with strength indicator |
| **Range** | `value`, `onChange`, `min?`, `max?`, `step?`, `disabled?` | Range slider input |
| **Filters** | `filters`, `onFilterChange?`, `onReset?` | Filter controls |

### UI Components

| Component | Key Props | Usage Pattern |
|-----------|-----------|---------------|
| **Accordion** | `children` (AccordionItem) | Collapsible content |
| **ActionMenu** | `items`, `trigger?`, `placement?` | Action menu dropdown |
| **Badge** | `color?`, `size?`, `variant?` | Status badges |
| **Badges** | `badges`, `maxDisplay?`, `onBadgeClick?` | Multiple badges display |
| **Breadcrumb** | `items: Array<{label, href?}>` | Navigation breadcrumbs |
| **Card** | `title?`, `description?`, `image?`, `href?`, `actions?` + IAM | Content card |
| **Clipboard** | `text`, `onCopy?`, `tooltip?` | Copy to clipboard |
| **Code** | `code`, `language?`, `showLineNumbers?` | Code display |
| **Divider** | `orientation?`, `spacing?` | Visual separator |
| **Drawer** | `open`, `onOpenChange`, `side?`, `size?` | Slide-out panel |
| **Icon** | `name`, `size?`, `color?` | Icon display |
| **Link** | `href`, `external?` + IAM | Enhanced links |
| **LinkCard** | `href`, `title`, `description?`, `image?` + IAM | Card with link |
| **Medium** | `src`, `alt?`, `type?` | Media display (image/video) |
| **Message** | `type`, `title?`, `description?`, `closable?`, `onClose?` | User messages |
| **Meter** | `value` (required, default: 0), `min` (required, default: 0), `max` (required, default: 100), `low?`, `high?`, `optimum?` | Progress meter indicator with thresholds and optimal values |
| **Modal** | `open`, `onOpenChange`, `title?`, `size?` | Modal dialogs |
| **Notifications** | `notifications`, `onRemove`, `position?`, `duration?` | Toast notifications |
| **Pagination** | `current`, `total`, `pageSize?`, `onPageChange?` | Pagination controls |
| **Popover** | `children` (PopoverTrigger, PopoverContent) | Floating content |
| **ProgressBar** | `value` (required, default: 0), `max` (required, default: 100) | Progress bar indicator (extends native HTML progress attributes) |
| **Skeleton** | `variant?`, `width?`, `height?`, `count?` | Loading skeleton |
| **Spinner** | `size?`, `variant?` | Loading spinner |
| **Table** | `columns`, `data`, `sortable?`, `selectable?` | Data table |
| **Tabs** | `value`, `onValueChange`, `items: Array<{value, label, content}>` | Tab navigation (✅ Available) |
| **Tag** | `label`, `color?`, `size?`, `onRemove?` | Single tag |
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
| **Order** | `items`, `onSubmit?`, `summary?` | Order configuration and summary |

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

### Meter with Thresholds and Optimal Values

```typescript
import { Meter } from '@ovh-ux/muk';

function UsageMeter() {
  return (
    <>
      {/* Simple meter */}
      <Meter value={50} />
      
      {/* Meter with thresholds */}
      <Meter low={40} value={35} /> {/* Value under low threshold */}
      <Meter high={80} low={40} value={60} /> {/* Value between thresholds */}
      <Meter high={80} value={90} /> {/* Value above high threshold */}
      
      {/* Meter with optimal value */}
      <Meter 
        high={80} 
        low={40} 
        optimum={30} 
        value={20} 
      /> {/* Low optimum and low value */}
    </>
  );
}
```

**Meter Props:**
- `value` (required, default: 0) - Current value of the meter
- `min` (required, default: 0) - Lower numeric bound of the measured range
- `max` (required, default: 100) - Upper numeric bound of the measured range
- `low` (optional) - Upper numeric bound of the low end of the measured range
- `high` (optional) - Lower numeric bound of the high end of the measured range
- `optimum` (optional) - Optimal numeric value. Combined with low and high, changes the coloring behaviour

### ProgressBar Usage

```typescript
import { ProgressBar } from '@ovh-ux/muk';

function ProgressExample() {
  return (
    <>
      {/* Default progress bar */}
      <ProgressBar />
      
      {/* Progress bar with value */}
      <ProgressBar value={50} />
      
      {/* Progress bar with custom max */}
      <ProgressBar max={500} value={50} />
    </>
  );
}
```

**ProgressBar Props:**
- `value` (required, default: 0) - Current value of the progress bar
- `max` (required, default: 100) - Maximum value of the progress bar
- Extends all native HTML [`<progress>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#attributes)

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

MUK v0.5.0 includes full testing support for React apps. Configure Vitest in your app:

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

```typescript
// vitest.setup.ts
import '@ovh-ux/muk/dist/style.css';
import { vi } from 'vitest';

// Mock MUK components if needed
vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    // Add specific mocks if needed
  };
});
```

### Testing Example

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@ovh-ux/muk';

test('renders button with IAM', () => {
  render(<Button iamActions={['read']} urn="urn:test">Test</Button>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## 📚 TypeScript

All components have full TypeScript support. Import types and enums:

```typescript
import type {
  ButtonProps,
  DatagridProps,
  OnboardingLayoutProps,
  BaseLayoutProps,
  UseDataApiOptions,
  UseDataApiResult
} from '@ovh-ux/muk';

// Enums are now exported (v0.5.0+)
import {
  BADGE_COLOR,
  BADGE_SIZE,
  BADGE_VARIANT,
  BREADCRUMB_SIZE,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  MODAL_COLOR,
  MODAL_SIZE
} from '@ovh-ux/muk';
```

### Available Enums (v0.5.0+)

- **Badge**: `BADGE_COLOR`, `BADGE_SIZE`, `BADGE_VARIANT`
- **Breadcrumb**: `BREADCRUMB_SIZE`
- **Button**: `BUTTON_VARIANT`, `BUTTON_SIZE`
- **Modal**: `MODAL_COLOR`, `MODAL_SIZE`

### Datagrid TypeScript Interface

```typescript
interface DatagridProps<T> {
  columns: DatagridColumn<T>[];
  data: T[];
  totalCount: number;  // NOT totalItems
  pageIndex?: number;  // NOT pagination.pageIndex
  pageSize?: number;   // NOT pagination.pageSize
  sorting?: ColumnSort;
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  onSortChange?: (updater: Updater<SortingState>) => void;
  isLoading?: boolean;
  variant?: string;    // 🔄 Coming soon
  size?: string;       // 🔄 Coming soon
}
```

### Button Variants

- `default` - Standard button
- `ghost` - Transparent background
- `outline` - Border only
- ❌ NOT: `primary`, `secondary`

**Enums:**
```typescript
import { BUTTON_VARIANT, BUTTON_SIZE } from '@ovh-ux/muk';
```

## 📡 Tracking API

```typescript
trackClick({ actions: ['action-name'] })  // ✅ Correct
trackClick('action-name')                 // ❌ Wrong
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
8. **Use PascalCase for component names**: `ProgressBar` not `Progress Bar` (⚠️ Storybook uses spaces, but code uses PascalCase)

### Quick Reference Checklist

- [ ] CSS import added
- [ ] Correct component names used (PascalCase)
- [ ] IAM props included where needed
- [ ] Loading states handled
- [ ] Datagrid uses `totalCount` (not `totalItems`)
- [ ] Tree-shaking (specific imports)
- [ ] Component names follow PascalCase convention

### Component Naming Convention

**✅ Correct (PascalCase):**
- `ActionBanner` (not "Action Banner")
- `BaseLayout` (not "Base Layout")
- `ProgressBar` (not "Progress Bar")
- `FileUpload` (not "File Upload")
- `PhoneNumber` (not "Phone Number")

**⚠️ Note:** The Storybook may display component names with spaces for readability, but the actual import names use PascalCase. Always use PascalCase in code.

---

## ⚖️ The MUK's Moral

- **Unified development** ensures consistency across all Manager applications
- **IAM integration** provides security by default
- **ODS foundation** guarantees design system compliance
- **Performance optimization** ensures fast, scalable applications

**👉 Good MUK usage is invisible to users but essential for Manager application success.**

---

## 🔄 Migration Guide: OUI (AngularJS) → MUK (React)

When migrating from AngularJS OUI components to React MUK components, use this guide:

### Full Page Layouts

| OUI Pattern | Detection | MUK Equivalent | Implementation |
|-------------|-----------|----------------|----------------|
| `manager-list-layout` | In routing resolve | `BaseLayout` + `Datagrid` | Full page with header + data grid |
| `manager-on-boarding-layout` | Component in routing | `BaseLayout` + custom layout | Centered content with guides grid |

### Component Mapping

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<oui-datagrid>` | `<oui-datagrid>` tag | `Datagrid` | Props differ, see Datagrid section |
| `<oui-button>` | `<oui-button>` tag | `Button` | Map variants: primary → default, secondary → ghost |
| `<oui-action-menu>` | `<oui-action-menu>` tag | `ActionMenu` | ✅ Available |
| `<oui-field>` | `<oui-field>` tag | `FormField` | ✅ Available |
| `<oui-input>` | `<oui-input>` tag | `Input` | ✅ Available |
| `<oui-select>` | `<oui-select>` tag | `Select` | ✅ Available |
| `<oui-checkbox>` | `<oui-checkbox>` tag | `Checkbox` | ✅ Available |
| `<oui-modal>` | `<oui-modal>` tag | `Modal` | ✅ Available |
| `<oui-message>` | `<oui-message>` tag | `Message` | ✅ Available |
| `<oui-banner>` | `<oui-banner>` tag | `ActionBanner` | ✅ Available |
| `<oui-spinner>` | `<oui-spinner>` tag | `Spinner` | ✅ Available |
| `<oui-breadcrumb>` | `<oui-breadcrumb>` tag | `Breadcrumb` | ✅ Available |

### Attribute Mapping (OUI → MUK)

| OUI Attribute | MUK Prop | Conversion Example |
|---------------|----------|-------------------|
| `data-variant="primary"` | `variant="default"` | primary → default |
| `data-variant="secondary"` | `variant="ghost"` | secondary → ghost |
| `data-variant="link"` | `variant="outline"` or link styling | link → outline or custom |
| `data-size="l"` | `size="lg"` | l → lg |
| `data-size="s"` | `size="sm"` | s → sm |
| `data-icon-left="icon"` | Custom icon component | Use icon library (Lucide, etc.) |
| `data-icon-right="icon"` | Custom icon component | Place icon after text |
| `data-disabled="true"` | `disabled={true}` | Boolean prop |
| `data-on-click="fn()"` | `onClick={fn}` | Event handler |
| `data-aria-label="text"` | `aria-label="text"` | ARIA attribute |

### Feature Detection Patterns

Use these patterns to detect features in AngularJS templates:

```typescript
// Search functionality
/<input.*ng-model=".*search.*"/i
→ Add Input component with search functionality

// Filter button
/button.*filter|filtrer/i
→ Add Button with onClick={handleFilter}

// Column customization
/customize-columns|column-visibility|gear.*icon/i
→ Add Button with settings icon

// Pagination
/<oui-pagination|pagination-control/i
→ Datagrid handles pagination automatically

// Page size selector
/items-per-page|page-size-selector/i
→ Add Select for page size in Datagrid

// Topbar CTA in routing resolve
/topbarOptions.*cta/
→ Add Button in BaseLayout header.actions

// Changelog button
/<changelog-button/
→ Add Button with link to changelog

// Guides menu
/<oui-guide-menu/
→ Add GuideMenu component
```

### Migration Examples

#### manager-list-layout

**AngularJS Pattern:**
```javascript
// In routing.js
{
  component: 'managerListLayout',
  resolve: {
    columnConfig: () => [/* columns */],
    topbarOptions: {
      cta: {
        type: 'button',
        text: 'Order',
        click: () => {}
      },
      actions: [
        { text: 'Roadmap', click: () => {} }
      ]
    }
  }
}
```

**React MUK Pattern:**
```typescript
<BaseLayout
  header={{
    title: t('title'),
    actions: (
      <>
        <Button onClick={handleOrder}>{t('order')}</Button>
        <Button onClick={handleRoadmap}>{t('roadmap')}</Button>
      </>
    )
  }}
>
  <div className="flex gap-2 mb-4">
    <Input placeholder={t('search')} />
    <Button variant="outline">{t('filter')}</Button>
  </div>
  <Datagrid columns={columns} data={data} />
</BaseLayout>
```

#### Dashboard with Header

**AngularJS Pattern:**
```html
<header class="oui-header">
  <div class="d-flex justify-content-between">
    <div class="d-flex">
      <h1 data-ng-bind="$ctrl.name"></h1>
      <button class="btn btn-icon">
        <span class="oui-icon oui-icon-pen_concept"></span>
      </button>
    </div>
    <div class="d-flex gap-1">
      <changelog-button></changelog-button>
      <oui-guide-menu></oui-guide-menu>
    </div>
  </div>
</header>
```

**React MUK Pattern:**
```typescript
<BaseLayout
  header={{
    title: (
      <div className="flex items-center gap-2">
        <h1>{name}</h1>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <PencilIcon />
        </Button>
      </div>
    ),
    actions: (
      <>
        <Button variant="outline" onClick={handleChangelog}>
          Roadmap & Changelog
        </Button>
        <GuideMenu items={guides} />
      </>
    )
  }}
>
  {/* Page content */}
</BaseLayout>
```

## 📋 Version 0.5.0 Changelog

### ✅ Added
- **Testing support**: Full Vitest configuration support for React apps
- **Exported enums**: Badge, Breadcrumb, Button, and Modal enums are now exported

### 🔄 Coming Soon
- **Datagrid variant and size**: Additional styling options for Datagrid component
- **Storybook fixes**: Various fixes and improvements in Storybook
