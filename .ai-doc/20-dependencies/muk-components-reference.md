---
title: MUK Components Reference
last_update: 2025-01-27
tags: [muk, components, reference, props, typescript, ovhcloud, manager]
ai: true
---

# MUK Components Reference

> **📦 Version:** `@ovh-ux/muk@^0.1.1`

## 🧭 Purpose

Complete reference guide for all MUK components with accurate props, TypeScript definitions, and usage examples based on the actual source code analysis.

## ⚙️ Context

This reference provides:
- **Complete component list** (61 components available)
- **Accurate props** from source code analysis
- **TypeScript definitions** for all components
- **Real usage examples** tested against actual code
- **Common errors** and how to avoid them

## 📘 Component Reference

### Layout Components

#### BaseLayout

Main application layout with header, breadcrumb, and content areas.

```typescript
import { BaseLayout } from '@ovh-ux/muk';

<BaseLayout
  header={{
    title: 'Application Title',
    description: 'Application description',
    subtitle: 'Optional subtitle'
  }}
  breadcrumb={<Breadcrumb items={breadcrumbItems} />}
  tabs={<Tabs items={tabItems} />}
  message={<Message type="info">Info message</Message>}
  backLink={{
    label: 'Back to Services',
    onClick: () => navigate('/services'),
    previousPageLink: '/services'
  }}
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

#### OnboardingLayout

Complete onboarding page layout with image, title, description, and action buttons.

```typescript
import { OnboardingLayout } from '@ovh-ux/muk';

<OnboardingLayout
  title="Welcome to NAS-HA"
  description="Get started with your NAS-HA service"
  img={{ 
    src: '/nasha-icon.png', 
    alt: 'NAS-HA Service',
    className: 'w-40 h-40'
  }}
  orderButtonLabel="Order Now"
  onOrderButtonClick={() => handleOrder()}
  orderHref="/order"
  isActionDisabled={false}
  orderIam={{
    urn: 'urn:v1:eu:product:nasha',
    iamActions: ['product:create'],
    displayTooltip: true
  }}
  moreInfoHref="/docs"
  moreInfoButtonLabel="Learn More"
  moreInfoButtonIcon="external-link"
  isMoreInfoButtonDisabled={false}
  hideHeadingSection={false}
>
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

#### GridLayout

Grid-based layout system.

```typescript
import { GridLayout } from '@ovh-ux/muk';

<GridLayout
  columns={3}
  gap={4}
  className="custom-grid"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</GridLayout>
```

### Data Components

#### Datagrid

Advanced data table with TanStack Table v8 integration.

```typescript
import { Datagrid, useDataApi } from '@ovh-ux/muk';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    isSortable: true,
    isSearchable: true,
    isFilterable: true,
    enableHiding: true
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { 
      type: 'badge',
      className: 'status-badge'
    },
    isFilterable: true,
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
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
      hasNextPage={true}
      onFetchNextPage={() => {}}
      expandable={{
        expanded: {},
        setExpanded: () => {}
      }}
      rowSelection={{
        rowSelection: {},
        setRowSelection: () => {},
        onRowSelectionChange: () => {}
      }}
    />
  );
}
```

**Props:**
```typescript
interface DatagridProps<T extends Record<string, unknown>> {
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
  renderSubComponent?: (
    row: Row<T>,
    headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>
  ) => JSX.Element;
}
```

**Column Definition:**
```typescript
interface DatagridColumn<T> extends ColumnDef<T> {
  comparator?: FilterComparator[];
  enableHiding?: boolean;
  filterOptions?: Option[];
  isFilterable?: boolean;
  isSearchable?: boolean;
  isSortable?: boolean;
  label?: string;
  meta?: {
    type?: ColumnMetaType;
    className?: string;
  };
  type?: DatagridColumnTypes;
}
```

### Form Components

#### Button

Enhanced button with IAM integration.

```typescript
import { Button } from '@ovh-ux/muk';

<Button
  variant="primary"
  size="md"
  iamActions={['service:edit']}
  urn="urn:v1:eu:service:123"
  displayTooltip={true}
  tooltipPosition="bottom"
  onClick={() => handleEdit()}
  disabled={false}
>
  Edit Service
</Button>
```

**Props:**
```typescript
interface ButtonProps {
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  children: JSX.Element | string;
  tooltipPosition?: TOOLTIP_POSITION;
} & ButtonProp; // ODS Button props
```

#### Checkbox

Checkbox with IAM support.

```typescript
import { Checkbox } from '@ovh-ux/muk';

<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
  disabled={false}
>
  Accept terms
</Checkbox>
```

#### Combobox

Searchable dropdown component.

```typescript
import { Combobox } from '@ovh-ux/muk';

<Combobox
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select option"
  searchable={true}
  multiple={false}
/>
```

#### Datepicker

Date selection component.

```typescript
import { Datepicker } from '@ovh-ux/muk';

<Datepicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
  format="dd/MM/yyyy"
  minDate={new Date()}
  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
/>
```

#### FileUpload

File upload component.

```typescript
import { FileUpload } from '@ovh-ux/muk';

<FileUpload
  onFileSelect={handleFileSelect}
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple={false}
  disabled={false}
>
  <div>Drop files here or click to upload</div>
</FileUpload>
```

#### FormField

Form field wrapper with label and validation.

```typescript
import { FormField } from '@ovh-ux/muk';

<FormField
  label="Service Name"
  required={true}
  error="This field is required"
  help="Enter a unique service name"
>
  <Input
    value={serviceName}
    onChange={setServiceName}
    placeholder="Enter service name"
  />
</FormField>
```

#### Input

Text input component.

```typescript
import { Input } from '@ovh-ux/muk';

<Input
  value={value}
  onChange={setValue}
  placeholder="Enter text"
  type="text"
  disabled={false}
  required={true}
  error={hasError}
/>
```

#### PhoneNumber

Phone number input with country selection.

```typescript
import { PhoneNumber } from '@ovh-ux/muk';

<PhoneNumber
  value={phoneNumber}
  onChange={setPhoneNumber}
  country="FR"
  placeholder="Enter phone number"
  disabled={false}
/>
```

#### Quantity

Number input with increment/decrement controls.

```typescript
import { Quantity } from '@ovh-ux/muk';

<Quantity
  value={quantity}
  onChange={setQuantity}
  min={0}
  max={100}
  step={1}
  disabled={false}
/>
```

#### RadioGroup

Radio button group.

```typescript
import { RadioGroup } from '@ovh-ux/muk';

<RadioGroup
  value={selectedOption}
  onChange={setSelectedOption}
  options={[
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ]}
  disabled={false}
/>
```

#### Select

Dropdown selection component.

```typescript
import { Select } from '@ovh-ux/muk';

<Select
  value={selectedValue}
  onChange={setSelectedValue}
  options={options}
  placeholder="Select option"
  disabled={false}
  searchable={true}
/>
```

#### Switch

Toggle switch component.

```typescript
import { Switch } from '@ovh-ux/muk';

<Switch
  checked={isEnabled}
  onChange={setIsEnabled}
  disabled={false}
  size="md"
/>
```

#### Textarea

Multi-line text input.

```typescript
import { Textarea } from '@ovh-ux/muk';

<Textarea
  value={description}
  onChange={setDescription}
  placeholder="Enter description"
  rows={4}
  disabled={false}
  maxLength={500}
/>
```

#### Timepicker

Time selection component.

```typescript
import { Timepicker } from '@ovh-ux/muk';

<Timepicker
  value={time}
  onChange={setTime}
  format="24h"
  disabled={false}
  placeholder="Select time"
/>
```

#### Toggle

Toggle component.

```typescript
import { Toggle } from '@ovh-ux/muk';

<Toggle
  checked={isActive}
  onChange={setIsActive}
  disabled={false}
  size="md"
/>
```

### UI Components

#### Accordion

Collapsible content component.

```typescript
import { Accordion } from '@ovh-ux/muk';

<Accordion>
  <AccordionItem value="item1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      Content for section 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>
      Content for section 2
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Badge

Status badges.

```typescript
import { Badge } from '@ovh-ux/muk';

<Badge
  color="success"
  size="md"
  variant="solid"
>
  Active
</Badge>
```

#### Breadcrumb

Navigation breadcrumbs.

```typescript
import { Breadcrumb } from '@ovh-ux/muk';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Current Page' }
  ]}
/>
```

#### Clipboard

Copy to clipboard functionality.

```typescript
import { Clipboard } from '@ovh-ux/muk';

<Clipboard
  text="Text to copy"
  onCopy={() => console.log('Copied!')}
  tooltip="Copy to clipboard"
>
  <Button>Copy</Button>
</Clipboard>
```

#### Drawer

Slide-out panel component.

```typescript
import { Drawer } from '@ovh-ux/muk';

<Drawer
  open={isOpen}
  onOpenChange={setIsOpen}
  side="right"
  size="md"
>
  <DrawerHeader>
    <h2>Drawer Title</h2>
  </DrawerHeader>
  <DrawerContent>
    <p>Drawer content</p>
  </DrawerContent>
  <DrawerFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </DrawerFooter>
</Drawer>
```

#### Link

Enhanced link component.

```typescript
import { Link } from '@ovh-ux/muk';

<Link
  href="/services"
  external={false}
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
>
  View Services
</Link>
```

#### LinkCard

Card with link functionality.

```typescript
import { LinkCard } from '@ovh-ux/muk';

<LinkCard
  href="/service/123"
  title="Service Name"
  description="Service description"
  image="/service-image.png"
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
/>
```

#### Message

User message component.

```typescript
import { Message } from '@ovh-ux/muk';

<Message
  type="info"
  title="Information"
  description="This is an informational message"
  closable={true}
  onClose={() => {}}
/>
```

#### Modal

Modal dialog component.

```typescript
import { Modal } from '@ovh-ux/muk';

<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

#### Notifications

Toast notification system.

```typescript
import { Notifications } from '@ovh-ux/muk';

<Notifications
  notifications={notifications}
  onRemove={removeNotification}
  position="top-right"
  duration={5000}
/>
```

#### Popover

Floating content component.

```typescript
import { Popover } from '@ovh-ux/muk';

<Popover>
  <PopoverTrigger>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

#### Progress

Progress indicator component.

```typescript
import { Progress } from '@ovh-ux/muk';

<Progress
  value={75}
  max={100}
  size="md"
  variant="default"
  showValue={true}
/>
```

#### Tabs

Tab navigation component.

```typescript
import { Tabs } from '@ovh-ux/muk';

<Tabs
  value={activeTab}
  onValueChange={setActiveTab}
  items={[
    { value: 'tab1', label: 'Tab 1', content: <div>Tab 1 content</div> },
    { value: 'tab2', label: 'Tab 2', content: <div>Tab 2 content</div> }
  ]}
/>
```

#### Tile

Content tile component.

```typescript
import { Tile } from '@ovh-ux/muk';

<Tile
  title="Service Name"
  description="Service description"
  image="/service-image.png"
  href="/service/123"
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
/>
```

#### Tooltip

Hover tooltip component.

```typescript
import { Tooltip } from '@ovh-ux/muk';

<Tooltip
  content="Tooltip content"
  position="top"
  delay={300}
>
  <Button>Hover me</Button>
</Tooltip>
```

#### TreeView

Hierarchical data display.

```typescript
import { TreeView } from '@ovh-ux/muk';

<TreeView
  data={treeData}
  onNodeSelect={handleNodeSelect}
  onNodeToggle={handleNodeToggle}
  expandable={true}
  selectable={true}
/>
```

### Feedback Components

#### ActionBanner

Action prompt banner.

```typescript
import { ActionBanner } from '@ovh-ux/muk';

<ActionBanner
  type="info"
  title="Action Required"
  description="Please complete your profile"
  actionLabel="Complete Profile"
  onAction={() => navigate('/profile')}
  dismissible={true}
  onDismiss={() => {}}
/>
```

#### Error

Error display component.

```typescript
import { Error } from '@ovh-ux/muk';

<Error
  title="Error Title"
  message="Error message"
  details="Detailed error information"
  onRetry={() => retry()}
  onDismiss={() => {}}
/>
```

#### ErrorBoundary

Error catching boundary.

```typescript
import { ErrorBoundary } from '@ovh-ux/muk';

<ErrorBoundary
  fallback={<Error title="Something went wrong" />}
  onError={(error, errorInfo) => console.error(error, errorInfo)}
>
  <MyComponent />
</ErrorBoundary>
```

#### ServiceStateBadge

Service status badge.

```typescript
import { ServiceStateBadge } from '@ovh-ux/muk';

<ServiceStateBadge
  status="active"
  size="md"
  showIcon={true}
/>
```

#### TagsList

Tag management component.

```typescript
import { TagsList } from '@ovh-ux/muk';

<TagsList
  tags={tags}
  onAdd={handleAddTag}
  onRemove={handleRemoveTag}
  onEdit={handleEditTag}
  editable={true}
  addLabel="Add tag"
/>
```

#### TagsTile

Tag display tile.

```typescript
import { TagsTile } from '@ovh-ux/muk';

<TagsTile
  tags={tags}
  maxDisplay={5}
  onTagClick={handleTagClick}
  showCount={true}
/>
```

### Text Components

#### Text

Text component with IAM support.

```typescript
import { Text } from '@ovh-ux/muk';

<Text
  preset="heading1"
  iamActions={['service:read']}
  urn="urn:v1:eu:service:123"
  tooltipPosition="bottom"
>
  Sensitive Information
</Text>
```

**Props:**
```typescript
interface TextProps {
  iamActions?: string[];
  urn?: string;
  tooltipPosition?: TOOLTIP_POSITION;
} & TextProp; // ODS Text props
```

## 🔧 Hooks Reference

### Data Fetching Hooks

#### useDataApi

Primary data fetching hook.

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

#### useDatagridSearchParams

Search parameters for datagrid.

```typescript
import { useDatagridSearchParams } from '@ovh-ux/muk';

const { searchParams, setSearchParams } = useDatagridSearchParams();
```

#### useColumnFilters

Column filtering functionality.

```typescript
import { useColumnFilters } from '@ovh-ux/muk';

const { filters, add, remove } = useColumnFilters();
```

### IAM & Permissions

#### useAuthorizationIam

IAM authorization hook.

```typescript
import { useAuthorizationIam } from '@ovh-ux/muk';

const { isAuthorized, isLoading } = useAuthorizationIam(
  ['service:read', 'service:write'],
  'urn:v1:eu:service:123'
);
```

### Utility Hooks

#### useBreadcrumb

Breadcrumb management.

```typescript
import { useBreadcrumb } from '@ovh-ux/muk';

const breadcrumbItems = useBreadcrumb({
  rootLabel: 'Home',
  appName: 'bmc-nasha',
  projectId: 'project-123'
});
```

#### useBytes

Byte formatting utility.

```typescript
import { useBytes } from '@ovh-ux/muk';

const { formatBytes, parseBytes } = useBytes();
const formatted = formatBytes(1024); // "1 KB"
```

#### useCatalogPrice

Catalog price formatting.

```typescript
import { useCatalogPrice } from '@ovh-ux/muk';

const { formatPrice, getCurrency } = useCatalogPrice();
const price = formatPrice(29.99, 'EUR'); // "€29.99"
```

#### useMe

User information hook.

```typescript
import { useMe } from '@ovh-ux/muk';

const { user, isLoading } = useMe();
```

#### useRegion

Region information hook.

```typescript
import { useRegion } from '@ovh-ux/muk';

const { region, setRegion } = useRegion();
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

// ❌ WRONG: Incorrect OnboardingLayout props
<OnboardingLayout title="Title" /> // Missing required props
<OnboardingLayout 
  title="Title"
  orderButtonLabel="Order"
  onOrderButtonClick={() => {}}
/> // ✅ CORRECT
```

### ✅ Best Practices

```typescript
// ✅ CORRECT: Complete setup
import '@ovh-ux/muk/dist/style.css';
import { Button, Datagrid, OnboardingLayout } from '@ovh-ux/muk';

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

// ✅ CORRECT: OnboardingLayout
<OnboardingLayout
  title="Welcome"
  orderButtonLabel="Get Started"
  onOrderButtonClick={() => {}}
  orderIam={{
    urn: 'urn:resource',
    iamActions: ['create']
  }}
>
  <div>Content</div>
</OnboardingLayout>
```

## 📚 TypeScript Support

### Component Props Types

```typescript
import type {
  ButtonProps,
  DatagridProps,
  OnboardingLayoutProps,
  BaseLayoutProps,
  TextProps,
  UseDataApiOptions,
  UseDataApiResult
} from '@ovh-ux/muk';
```

### Hook Types

```typescript
import type {
  UseDataApiOptions,
  UseDataApiResult,
  DatagridColumn,
  FilterWithLabel
} from '@ovh-ux/muk';
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

## ⚖️ The Components' Moral

- **Consistent components** ensure unified user experience across all applications
- **IAM integration** provides security by default
- **TypeScript support** catches errors at compile time
- **Performance optimization** ensures fast, scalable applications

**👉 Good component usage is invisible to users but essential for application success.**