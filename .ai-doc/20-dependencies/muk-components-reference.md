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
