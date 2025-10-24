---
title: Manager UI Kit (MUK)
last_update: 2025-01-27
tags: [muk, ui-kit, components, ovhcloud, manager, react, typescript]
ai: true
---

# Manager UI Kit (MUK)

> **📦 Version:** `@ovh-ux/muk@^1.x`

## 🧭 Purpose

The **Manager UI Kit (MUK)** is the unified component library for OVHcloud Manager applications. It serves as the **SINGLE SOURCE OF TRUTH** for all UI components and styles, replacing both `@ovhcloud/ods-components` and `@ovh-ux/manager-react-components`.

⚠️ **CRITICAL**: MUK is the SSOT - do not import from legacy ODS or MRC when MUK components are available.

## ⚙️ Context

MUK is designed for:
- **Unified UI components** replacing legacy ODS + MRC
- **Data fetching hooks** with TanStack Query integration
- **Advanced data grids** with TanStack Table
- **Form components** with validation
- **Layout components** for page structure
- **TypeScript support** with full type definitions

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Consistent UI** across all applications
- **Data management** with standardized hooks
- **Component reusability** and maintainability

## 🔗 References

- [Manager React Components](./manager-react-components.md) (being replaced)
- [Legacy ODS Components](./ods-components.md) (being replaced)
- [TanStack React Query](./tanstack-react-query.md)
- [TanStack Table](https://tanstack.com/table)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/muk": "^1.x"
  }
}
```

### CSS Import (Required)

```typescript
// Always import MUK styles
import '@ovh-ux/muk/dist/style.css';
```

### TypeScript Setup

```typescript
// MUK provides full TypeScript support
import { Button, Datagrid, useV6 } from '@ovh-ux/muk';
```

## Data Fetching Hooks

### useV6 Hook

```typescript
import { useV6 } from '@ovh-ux/muk';

function ServiceDetails({ serviceId }: { serviceId: string }) {
  const { data, isLoading, error } = useV6(`/service/${serviceId}`);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.name}</div>;
}
```

### useIceberg Hook

```typescript
import { useIceberg } from '@ovh-ux/muk';

function ServicesList() {
  const { data, totalCount, isLoading } = useIceberg('/services', {
    page: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDesc: false
  });
  
  return (
    <div>
      <p>Total: {totalCount}</p>
      {data?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
```

### useInfiniteQuery Hook

```typescript
import { useInfiniteQuery } from '@ovh-ux/muk';

function InfiniteServicesList() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['services'],
    queryFn: ({ pageParam = 0 }) => fetchServices(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
  
  return (
    <div>
      {data?.pages.map(page => 
        page.items.map(service => <div key={service.id}>{service.name}</div>)
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}
```

## Core Components

### Layout Components

#### BaseLayout

```typescript
import { BaseLayout } from '@ovh-ux/muk';

function MyPage() {
  return (
    <BaseLayout
      header={{ title: 'My Services' }}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Services' }
      ]}
    >
      <div>Page content</div>
    </BaseLayout>
  );
}
```

#### OnboardingLayout

```typescript
import { OnboardingLayout } from '@ovh-ux/muk';

function OnboardingPage() {
  return (
    <OnboardingLayout
      title="Welcome to OVHcloud"
      description="Get started with your services"
    >
      <div>Onboarding content</div>
    </OnboardingLayout>
  );
}
```

### Data Components

#### Datagrid

```typescript
import { Datagrid } from '@ovh-ux/muk';

function ServicesTable() {
  const columns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions' }
  ];
  
  const data = [
    { id: '1', name: 'Service 1', status: 'active' },
    { id: '2', name: 'Service 2', status: 'inactive' }
  ];
  
  return (
    <Datagrid
      columns={columns}
      data={data}
      totalItems={data.length}
      onSort={(sortBy, sortDesc) => console.log(sortBy, sortDesc)}
    />
  );
}
```

#### Filters

```typescript
import { Filters } from '@ovh-ux/muk';

function ServicesFilters() {
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];
  
  return (
    <Filters
      config={filterConfig}
      onFilter={(filters) => console.log(filters)}
    />
  );
}
```

### Form Components

#### FormField

```typescript
import { FormField, Input, Button } from '@ovh-ux/muk';

function CreateServiceForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  return (
    <form>
      <FormField label="Service Name" required>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </FormField>
      
      <FormField label="Description">
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </FormField>
      
      <Button type="submit">Create Service</Button>
    </form>
  );
}
```

#### Select Component

```typescript
import { Select } from '@ovh-ux/muk';

function RegionSelector() {
  const regions = [
    { value: 'eu', label: 'Europe' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ];
  
  return (
    <Select
      options={regions}
      value="eu"
      onChange={(value) => console.log(value)}
    />
  );
}
```

### UI Components

#### Button

```typescript
import { Button } from '@ovh-ux/muk';

function ActionButtons() {
  return (
    <div>
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="ghost">Ghost Action</Button>
    </div>
  );
}
```

#### Modal

```typescript
import { Modal, Button } from '@ovh-ux/muk';

function ConfirmModal({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2>Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <div>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
}
```

#### Message

```typescript
import { Message } from '@ovh-ux/muk';

function StatusMessages() {
  return (
    <div>
      <Message type="success">Operation completed successfully</Message>
      <Message type="error">An error occurred</Message>
      <Message type="warning">Please review your settings</Message>
      <Message type="info">New features available</Message>
    </div>
  );
}
```

## Complete Examples

### 1. List Page with Datagrid + Filters

```typescript
import { BaseLayout, Datagrid, Filters, Button } from '@ovh-ux/muk';
import { useIceberg } from '@ovh-ux/muk';

function ServicesPage() {
  const { data, totalCount, isLoading } = useIceberg('/services', {
    page: 1,
    pageSize: 20
  });
  
  const columns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions' }
  ];
  
  return (
    <BaseLayout header={{ title: 'Services' }}>
      <Filters config={filterConfig} onFilter={handleFilter} />
      <Datagrid
        columns={columns}
        data={data}
        totalItems={totalCount}
        isLoading={isLoading}
        onSort={handleSort}
      />
      <Button>Create Service</Button>
    </BaseLayout>
  );
}
```

### 2. Create Form with Validation

```typescript
import { Modal, FormField, Input, Select, Button } from '@ovh-ux/muk';

function CreateServiceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    plan: ''
  });
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Submit logic
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormField label="Service Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormField>
        
        <FormField label="Region" required>
          <Select
            value={formData.region}
            onChange={(value) => setFormData({ ...formData, region: value })}
            options={regionOptions}
          />
        </FormField>
        
        <div>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
}
```

### 3. Infinite Scroll List

```typescript
import { useInfiniteQuery } from '@ovh-ux/muk';

function InfiniteServicesList() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['services'],
    queryFn: ({ pageParam = 0 }) => fetchServices({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
  
  return (
    <div>
      {data?.pages.map((page, pageIndex) => 
        page.items.map((service, itemIndex) => (
          <div key={`${pageIndex}-${itemIndex}`}>
            {service.name}
          </div>
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## Migration Guide

### From Legacy ODS Components

```typescript
// ❌ OLD (Legacy ODS)
import { OsdsButton, OsdsInput, OsdsModal } from '@ovhcloud/ods-components/react';

// ✅ NEW (MUK)
import { Button, Input, Modal } from '@ovh-ux/muk';
```

### From Manager React Components

```typescript
// ❌ OLD (MRC)
import { Datagrid, BaseLayout, Filters } from '@ovh-ux/manager-react-components';

// ✅ NEW (MUK)
import { Datagrid, BaseLayout, Filters } from '@ovh-ux/muk';
```

### CSS Migration

```typescript
// ❌ OLD
import '@ovhcloud/ods-components/dist/style.css'; // Legacy ODS
import '@ovh-ux/manager-react-components/dist/style.css';

// ✅ NEW
import '@ovh-ux/muk/dist/style.css';
```

## Best Practices

### 1. Always Use MUK First

```typescript
// ✅ CORRECT: Use MUK components
import { Button, Modal, Datagrid } from '@ovh-ux/muk';

// ❌ WRONG: Don't use legacy ODS/MRC when MUK is available
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { Datagrid } from '@ovh-ux/manager-react-components';
```

### 2. Data Fetching

```typescript
// ✅ CORRECT: Use MUK data hooks
import { useV6, useIceberg } from '@ovh-ux/muk';

// ❌ WRONG: Don't use raw API calls
import { v6 } from '@ovh-ux/manager-core-api';
```

### 3. TypeScript Support

```typescript
// ✅ CORRECT: Use MUK types
import { ButtonProps, DatagridProps } from '@ovh-ux/muk';

// ❌ WRONG: Don't recreate types
interface ButtonProps { ... }
```

## Common Pitfalls

### ❌ Wrong: Using Legacy ODS/MRC When MUK Exists

```typescript
// Don't do this
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { Datagrid } from '@ovh-ux/manager-react-components';
```

### ✅ Correct: Use MUK Components

```typescript
// Do this instead
import { Button, Datagrid } from '@ovh-ux/muk';
```

### ❌ Wrong: Missing CSS Import

```typescript
// Don't forget the CSS
import '@ovh-ux/muk/dist/style.css';
```

### ❌ Wrong: Using Raw API Calls

```typescript
// Don't do this
const { data } = useQuery({
  queryKey: ['service'],
  queryFn: () => v6.get('/service')
});
```

### ✅ Correct: Use MUK Data Hooks

```typescript
// Do this instead
const { data } = useV6('/service');
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **ALWAYS use MUK first**: Import from `@ovh-ux/muk` before considering legacy ODS/MRC
2. **NEVER import from legacy ODS/MRC**: When MUK components are available
3. **ALWAYS include CSS**: Import `@ovh-ux/muk/dist/style.css`
4. **Use MUK data hooks**: Prefer `useV6`, `useIceberg` over raw API calls
5. **Follow TypeScript patterns**: Use MUK's built-in types
6. **Check component availability**: Verify MUK has the component before using alternatives
7. **Document exceptions**: When using non-MUK components, explain why

### Component Priority Checklist

- [ ] Check if MUK component exists
- [ ] Use MUK component if available
- [ ] Only use legacy ODS/MRC if MUK component missing
- [ ] Document why non-MUK component is used
- [ ] Include proper CSS imports
- [ ] Use MUK data hooks for API calls

### MUK vs Alternatives

| Component | MUK | Legacy ODS | Legacy MRC |
|-----------|-----|-----|-----|
| Button | ✅ `Button` | ❌ `OsdsButton` | ❌ N/A |
| Datagrid | ✅ `Datagrid` | ❌ N/A | ❌ `Datagrid` |
| Modal | ✅ `Modal` | ❌ `OsdsModal` | ❌ N/A |
| Data hooks | ✅ `useV6`, `useIceberg` | ❌ N/A | ❌ N/A |

---

## ⚖️ The MUK's Moral

- **Unified components** ensure consistent UI across all Manager applications
- **Single source of truth** prevents component fragmentation
- **Modern patterns** with TypeScript and React 18+ support
- **Data integration** with standardized hooks and TanStack Query

**👉 Good MUK usage is invisible to users but essential for maintainable applications.**
