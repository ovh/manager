---
title: MUK Components Reference
last_update: 2025-01-27
tags: [muk, components, reference, available, exports]
ai: true
---

# MUK Components Reference

## Available Components

### Core Components
- `BaseLayout` - ✅ Available
- `Button` - ✅ Available (variants: default, ghost, outline)
- `Datagrid` - ✅ Available
- `DatagridColumn` - ✅ Available (type)

### NOT Available
- `Spinner` - ❌ Use CSS spinner instead
- `Links` - ❌ Use HTML links with Tailwind
- `Subtitle` - ❌ Use HTML heading elements
- `Title` - ❌ Use HTML heading elements
- `useDataGrid` - ❌ Use useState for pagination/sorting

## OUI to MUK Component Detection Guide

When analyzing AngularJS templates, use this guide to map OUI components to MUK:

### Full Page Layouts

| OUI Pattern | Detection | MUK Equivalent | Implementation |
|-------------|-----------|----------------|----------------|
| `manager-list-layout` | In routing resolve | `BaseLayout` + `Datagrid` | Full page with header + data grid |
| `manager-on-boarding-layout` | Component in routing | `BaseLayout` + custom layout | Centered content with guides grid |

### Data Display Components

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<oui-datagrid>` | `<oui-datagrid>` tag | `Datagrid` | Props differ, see below |
| `<oui-datagrid-column>` | Inside `<oui-datagrid>` | `DatagridColumn` type | Column configuration |
| `<oui-tile>` | `<oui-tile>` tag | Custom `div` + Tailwind | No direct MUK equivalent |
| `<oui-tile-definition>` | Inside `<oui-tile>` | `<dl>/<dt>/<dd>` | Definition list HTML |

### Navigation Components

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<header class="oui-header">` | `<header>` with class | `BaseLayout` header prop | Pass as header prop |
| `<oui-header-tabs>` | `<oui-header-tabs>` tag | Custom tabs or MUK Tabs | Check if MUK Tabs available |
| `<oui-breadcrumb>` | `<oui-breadcrumb>` tag | Custom breadcrumb | HTML nav with Tailwind |

### Action Components

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<oui-button>` | `<oui-button>` tag | `Button` | ✅ Map variants (see below) |
| `<oui-action-menu>` | `<oui-action-menu>` tag | MUK `ActionMenu` or `DropdownMenu` | Check availability |
| `<changelog-button>` | `<changelog-button>` tag | Custom `Button` | Link to changelog URL |
| `<oui-guide-menu>` | `<oui-guide-menu>` tag | `DropdownMenu` | Custom dropdown with guides |

### Form Components

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<oui-field>` | `<oui-field>` tag | `FormField` | ✅ Available |
| `<oui-input>` | `<oui-input>` tag | `Input` | ✅ Available |
| `<oui-select>` | `<oui-select>` tag | `Select` | ✅ Available |
| `<oui-checkbox>` | `<oui-checkbox>` tag | `Checkbox` | ✅ Available |
| `<oui-radio>` | `<oui-radio>` tag | `Radio` | Check availability |

### Feedback Components

| OUI Component | Template Pattern | MUK Equivalent | Notes |
|---------------|------------------|----------------|-------|
| `<oui-modal>` | `<oui-modal>` tag | `Modal` | ✅ Available |
| `<oui-message>` | `<oui-message>` tag | `Message` | ✅ Available |
| `<oui-banner>` | `<oui-banner>` tag | `Banner` | Check availability |
| `<oui-spinner>` | `<oui-spinner>` tag | CSS spinner | ❌ MUK has no Spinner |

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
→ Add DropdownMenu with guide links
```

### Special Layouts Detection

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
        <DropdownMenu>
          <DropdownMenuTrigger>Guides</DropdownMenuTrigger>
          <DropdownMenuContent>
            {guides.map(/* ... */)}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }}
>
  {/* Page content */}
</BaseLayout>
```

## Datagrid Props (TanStack Table based)

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
}
```

## Button Variants
- `default` - Standard button
- `ghost` - Transparent background
- `outline` - Border only
❌ NOT: `primary`, `secondary`

## Tracking API

```typescript
trackClick({ actions: ['action-name'] })  // ✅ Correct
trackClick('action-name')                 // ❌ Wrong
```

## Common MUK Mistakes

### ❌ Wrong: Using non-existent components
```typescript
import { Spinner, Links, Title } from '@ovh-ux/muk';
```

### ✅ Correct: Use HTML + Tailwind
```typescript
// Instead of Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>

// Instead of Links
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map(item => (
    <a href={item.href} className="border rounded-lg p-6">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </a>
  ))}
</div>

// Instead of Title/Subtitle
<h1 className="text-3xl font-bold mb-4">{title}</h1>
<p className="text-lg text-gray-600 mb-6">{subtitle}</p>
```

### ❌ Wrong: Incorrect Datagrid props
```typescript
<Datagrid
  totalItems={data.totalCount}  // ❌ Wrong prop name
  pagination={pagination}        // ❌ Wrong prop structure
/>
```

### ✅ Correct: Use correct Datagrid props
```typescript
<Datagrid
  totalCount={data.totalCount}   // ✅ Correct
  pageIndex={pagination.pageIndex}
  pageSize={pagination.pageSize}
  sorting={sorting}
  onPaginationChange={setPagination}
  onSortChange={setSorting}
/>
```

### ❌ Wrong: Incorrect Button variants
```typescript
<Button variant="primary">Click me</Button>  // ❌ Not available
```

### ✅ Correct: Use available variants
```typescript
<Button variant="default">Click me</Button>  // ✅ Available
<Button variant="ghost">Click me</Button>    // ✅ Available
<Button variant="outline">Click me</Button>  // ✅ Available
```
