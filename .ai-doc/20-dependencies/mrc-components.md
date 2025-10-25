---
title: Manager React Components (MRC) Library
last_update: 2025-01-27
tags: [components, react, ui, library, ovhcloud, manager]
ai: true
---

# Manager React Components (MRC) Library

> **📦 Version:** `@ovh-ux/manager-react-components@^2.39.0`

## 🧭 Purpose

The **Manager React Components (MRC)** library is the centralized React component system for the OVHcloud Manager ecosystem. It provides a collection of reusable components, custom hooks, and utilities that standardize the user interface and interactions across all Manager applications.

This library ensures visual and functional consistency by building upon the **ODS Design System (OVHcloud Design System)** while adding Manager-specific functionality.

## ⚙️ Context

MRC is built on the following foundations:

- **React 18+** : Base framework for components
- **ODS Components v18.6.2** : Base components from the OVHcloud design system
- **Tailwind CSS** : Utility-first styling system
- **TypeScript** : Static typing for robustness
- **React Query** : Server state management and caching
- **React i18next** : Internationalization
- **Zustand** : Lightweight client state management

The library is distributed via npm under the name `@ovh-ux/manager-react-components` and is used by all Manager µApps.

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

##### ManagerButton
**Description** : Button component with IAM integration and tooltips

**Import** :
```typescript
import { ManagerButton } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ManagerButtonProps {
  id: string;                    // Required: unique identifier
  label: string;                 // Required: button label
  iamActions?: string[];         // Optional: IAM actions for authorization
  urn?: string;                  // Optional: resource URN for IAM
  displayTooltip?: boolean;      // Optional: show tooltip when unauthorized - Default: true
  isIamTrigger?: boolean;        // Optional: trigger IAM check - Default: true
  children?: React.ReactNode;    // Optional: button content
  // Inherits all OdsButton props
}
```

**Example** :
```typescript
<ManagerButton
  id="create-instance"
  label="Create Instance"
  iamActions={['instance:create']}
  urn="urn:v1:eu:instance:123"
  onClick={handleCreate}
/>
```

##### ManagerText
**Description** : Text component with IAM authorization management

**Import** :
```typescript
import { ManagerText } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ManagerTextProps {
  iamActions?: string[];         // Optional: IAM actions for authorization
  urn?: string;                  // Optional: resource URN for IAM
  children?: React.ReactNode;    // Optional: text content
  // Inherits all OdsText props
}
```

**Example** :
```typescript
<ManagerText iamActions={['resource:read']} urn={resourceUrn}>
  Sensitive information
</ManagerText>
```

##### ManagerLink
**Description** : Link component with IAM authorization and navigation

**Import** :
```typescript
import { ManagerLink } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ManagerLinkProps {
  iamActions?: string[];         // Optional: IAM actions for authorization
  urn?: string;                  // Optional: resource URN for IAM
  isDisplayTooltip?: boolean;    // Optional: show tooltip when unauthorized
  isIamCheckDisabled?: boolean;  // Optional: disable IAM check
  isDisabled?: boolean;          // Optional: disable the link
  children?: React.ReactNode;    // Optional: link content
  // Inherits all OdsLink props
}
```

**Example** :
```typescript
<ManagerLink
  href="/resource/123"
  iamActions={['resource:read']}
  urn="urn:v1:eu:resource:123"
>
  View Resource
</ManagerLink>
```

##### Modal
**Description** : Modal component with loading states and steps

**Import** :
```typescript
import { Modal } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ModalProps {
  heading?: string;              // Optional: modal title
  step?: {                       // Optional: step indicator
    current?: number;            // Current step displayed on the modal
    total?: number;             // Total number of steps in the modal
  };
  type?: ODS_MODAL_COLOR;        // Optional: modal type - Default: ODS_MODAL_COLOR.information
  isLoading?: boolean;           // Optional: loading state - Default: false
  primaryLabel?: string;         // Optional: primary button label
  isPrimaryButtonLoading?: boolean; // Optional: loading state for primary button
  isPrimaryButtonDisabled?: boolean; // Optional: disabled state for primary button
  onPrimaryButtonClick?: () => void; // Optional: primary button action
  primaryButtonTestId?: string;  // Optional: test id of primary button
  secondaryLabel?: string;       // Optional: secondary button label
  isSecondaryButtonDisabled?: boolean; // Optional: disabled state for secondary button
  isSecondaryButtonLoading?: boolean; // Optional: loading state for secondary button
  onSecondaryButtonClick?: () => void; // Optional: secondary button action
  secondaryButtonTestId?: string; // Optional: test id of secondary button
  onDismiss?: () => void;        // Optional: dismiss handler
  isOpen?: boolean;              // Optional: modal open state - Default: true
  children?: React.ReactNode;    // Optional: modal content
}
```

**Example** :
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

##### Badge
**Description** : Status and information badges with loading state

**Import** :
```typescript
import { Badge } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface BadgeProps {
  isLoading?: boolean;           // Optional: loading state - Default: false
  'data-testid'?: string;        // Optional: test identifier
  // Inherits all OdsBadge props
}
```

**Example** :
```typescript
<Badge color="success" isLoading={isLoading}>
  Active
</Badge>
```

##### Clipboard
**Description** : Copy-to-clipboard functionality

**Import** :
```typescript
import { Clipboard } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
// Inherits all OdsClipboard props
```

**Example** :
```typescript
<Clipboard value="text-to-copy" />
```

#### Data Components

##### Datagrid
**Description** : Advanced data table with sorting, filters, pagination, and row selection

**Import** :
```typescript
import { Datagrid } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface DatagridProps<T> {
  columns: DatagridColumn<T>[];  // Required: column definitions
  items: T[];                    // Required: data items
  totalItems: number;            // Required: total item count
  pagination?: PaginationState;  // Optional: pagination state
  sorting?: ColumnSort;          // Optional: sorting state
  onPaginationChange?: (pagination: PaginationState) => void; // Optional: pagination change handler
  onSortChange?: any;            // Optional: sort change handler
  className?: string;            // Optional: CSS class
  contentAlignLeft?: boolean;    // Optional: align content left - Default: true
  hasNextPage?: boolean;         // Optional: has more pages
  onFetchNextPage?: any;         // Optional: load more handler
  onFetchAllPages?: React.MouseEventHandler<HTMLOdsButtonElement>; // Optional: load all handler
  manualSorting?: boolean;       // Optional: manual sorting - Default: true
  manualPagination?: boolean;    // Optional: manual pagination - Default: true
  noResultLabel?: string;        // Optional: no results message
  isLoading?: boolean;           // Optional: loading state - Default: false
  numberOfLoadingRows?: number;  // Optional: loading rows count
  filters?: FilterProps;         // Optional: filter configuration
  search?: SearchProps;          // Optional: search configuration
  columnVisibility?: string[];  // Optional: visible columns
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>; // Optional: column visibility change handler
  topbar?: React.ReactNode;      // Optional: topbar content
  renderSubComponent?: (row: Row<T>, headerRefs?: React.MutableRefObject<Record<string, HTMLTableCellElement>>) => JSX.Element; // Optional: sub-component renderer
  getRowCanExpand?: (row: Row<T>) => boolean; // Optional: row expansion predicate
  hideHeader?: boolean;          // Optional: hide header - Default: false
  resetExpandedRowsOnItemsChange?: boolean; // Optional: reset expanded rows on data change
  tableLayoutFixed?: boolean;    // Optional: fixed table layout
  resourceType?: string;         // Optional: resource type for tags
  rowSelection?: RowSelectionProps<T>; // Optional: row selection configuration
  getRowId?: (originalRow: T, index: number) => string; // Optional: custom row ID
}
```

**Example** :
```typescript
<Datagrid
  columns={columns}
  items={data}
  totalItems={totalCount}
  pagination={pagination}
  sorting={sorting}
  onPaginationChange={setPagination}
  onSortChange={setSorting}
  isLoading={isLoading}
  filters={filterProps}
  search={searchProps}
/>
```

##### DatagridColumn
**Description** : Column definition for Datagrid

**Props** :
```typescript
interface DatagridColumn<T> {
  id: string;                    // Required: unique column identifier
  cell: (props: T) => JSX.Element; // Required: cell renderer function
  label: string;                 // Required: column header label
  isSortable?: boolean;          // Optional: sortable column - Default: true
  comparator?: FilterComparator[]; // Optional: filter comparators
  type?: DatagridColumnTypes;    // Optional: column type for filtering
  isFilterable?: boolean;        // Optional: filterable column
  isSearchable?: boolean;        // Optional: searchable column
  size?: number;                 // Optional: column size
  filterOptions?: Option[];     // Optional: filter options
  enableHiding?: boolean;        // Optional: allow hiding - Default: true
}
```

##### ServiceStateBadge
**Description** : Service state badges

**Import** :
```typescript
import { ServiceStateBadge } from '@ovh-ux/manager-react-components';
```

#### Navigation Components

##### Breadcrumb
**Description** : Breadcrumb navigation component

**Import** :
```typescript
import { Breadcrumb } from '@ovh-ux/manager-react-components';
```

##### Drawer
**Description** : Collapsible side drawers

**Import** :
```typescript
import { Drawer, DrawerCollapsible } from '@ovh-ux/manager-react-components';
```

##### RedirectionGuard
**Description** : Route redirection guard

**Import** :
```typescript
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
```

##### ActionBanner
**Description** : Action banner component for contextual messages

**Import** :
```typescript
import { ActionBanner } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ActionBannerProps {
  message: string;                // Required: banner message
  cta: string;                   // Required: call-to-action text
  variant?: ODS_MESSAGE_VARIANT;  // Optional: message variant
  color?: ODS_MESSAGE_COLOR;     // Optional: message color
  onClick?: () => void;          // Optional: click handler
  href?: string;                 // Optional: link URL
  className?: string;             // Optional: CSS class
  isDismissible?: boolean;        // Optional: dismissible banner
}
```

**Example** :
```typescript
<ActionBanner
  message="New feature available!"
  cta="Learn more"
  onClick={handleLearnMore}
  isDismissible={true}
/>
```

##### RedirectionGuard
**Description** : Route redirection guard component

**Import** :
```typescript
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface RedirectionGuardProps {
  children: React.ReactNode;      // Required: child components
  condition: boolean;            // Required: redirection condition
  isLoading: boolean;            // Required: loading state
  route: string;                 // Required: target route
  isError?: boolean;             // Optional: error state
  errorComponent?: React.ReactNode; // Optional: error component
}
```

**Example** :
```typescript
<RedirectionGuard
  condition={!isAuthenticated}
  isLoading={isLoading}
  route="/login"
>
  <ProtectedContent />
</RedirectionGuard>
```

##### Step
**Description** : Step component for stepper workflows

**Import** :
```typescript
import { StepComponent } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface TStepProps {
  id?: string;                    // Optional: step identifier
  title?: string | JSX.Element;   // Optional: step title
  subtitle?: string | JSX.Element;  // Optional: step subtitle
  isOpen: boolean;               // Required: step open state
  isChecked: boolean;            // Required: step completion state
  isLocked: boolean;             // Required: step locked state
  order: number;                 // Required: step order
  next?: {                       // Optional: next action
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
    isLoading?: boolean;
  };
  edit?: {                       // Optional: edit action
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
  };
  skip?: {                       // Optional: skip action
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
    hint?: string;
  };
  children?: JSX.Element | JSX.Element[]; // Optional: step content
}
```

**Example** :
```typescript
<StepComponent
  id="step-1"
  title="Configure Instance"
  isOpen={true}
  isChecked={false}
  isLocked={false}
  order={1}
  next={{
    action: handleNext,
    label: "Next"
  }}
>
  <ConfigurationForm />
</StepComponent>
```

##### Tabs
**Description** : Tabs container component

**Import** :
```typescript
import { TabsComponent } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface TProps<Item> {
  id?: string;                    // Optional: tabs identifier
  items?: Item[];                 // Optional: tab items
  itemKey?: (item: Item) => string; // Optional: item key function
  titleElement?: (item: Item, isSelected?: boolean) => JSX.Element | string; // Optional: title renderer
  contentElement?: (item: Item) => JSX.Element; // Optional: content renderer
  mobileBreakPoint?: number;      // Optional: mobile breakpoint
  className?: string;             // Optional: CSS class
  onChange?: (item: Item) => void; // Optional: change handler
}
```

**Example** :
```typescript
<TabsComponent
  items={tabs}
  itemKey={(item) => item.id}
  titleElement={(item) => item.title}
  contentElement={(item) => <div>{item.content}</div>}
  onChange={handleTabChange}
/>
```

##### TilesInput
**Description** : Tiles input component for selection

**Import** :
```typescript
import { TilesInputComponent } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface TProps<T, S = void, G = void> {
  id?: string;                    // Optional: input identifier
  items: T[];                     // Required: items to display
  value: S;                       // Required: selected value
  onInput: (value: S) => void;    // Required: input handler
  label: string;                  // Required: input label
  tileClass?: string;             // Optional: tile CSS class
  stack?: boolean;                // Optional: stack layout
  group?: {                       // Optional: grouping configuration
    by: (item: T) => G;
    label: (group: G, items: T[]) => JSX.Element | string;
    value?: G;
    showAllTab: boolean;
    onChange?: (group: G) => void;
  };
}
```

**Example** :
```typescript
<TilesInputComponent
  items={flavors}
  value={selectedFlavor}
  onInput={setSelectedFlavor}
  label="Choose Flavor"
  group={{
    by: (flavor) => flavor.category,
    label: (category, items) => `${category} (${items.length})`,
    showAllTab: true
  }}
/>
```

##### ActionMenu
**Description** : Action menu component with IAM integration

**Import** :
```typescript
import { ActionMenu } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ActionMenuProps {
  items: ActionMenuItem[];        // Required: menu items
  isCompact?: boolean;           // Optional: compact mode
  icon?: ODS_ICON_NAME;          // Optional: menu icon
  variant?: ODS_BUTTON_VARIANT;  // Optional: button variant
  id: string;                    // Required: menu identifier
  isDisabled?: boolean;          // Optional: disabled state
  isLoading?: boolean;           // Optional: loading state
  popoverPosition?: ODS_POPOVER_POSITION; // Optional: popover position
  label?: string;                // Optional: menu label
}

interface ActionMenuItem {
  id: number;                    // Required: item identifier
  rel?: string;                  // Optional: link relation
  href?: string;                 // Optional: link URL
  download?: string;             // Optional: download attribute
  target?: string;               // Optional: link target
  onClick?: () => void;          // Optional: click handler
  label: string;                 // Required: item label
  variant?: ODS_BUTTON_VARIANT;  // Optional: button variant
  iamActions?: string[];         // Optional: IAM actions
  urn?: string;                  // Optional: resource URN
  className?: string;             // Optional: CSS class
  isDisabled?: boolean;          // Optional: disabled state
  isLoading?: boolean;           // Optional: loading state
  color?: ODS_BUTTON_COLOR;      // Optional: button color
  'data-testid'?: string;        // Optional: test identifier
}
```

**Example** :
```typescript
<ActionMenu
  id="instance-actions"
  items={[
    {
      id: 1,
      label: "Start",
      onClick: handleStart,
      iamActions: ['instance:start'],
      urn: 'urn:v1:eu:instance:123'
    },
    {
      id: 2,
      label: "Stop",
      onClick: handleStop,
      iamActions: ['instance:stop'],
      urn: 'urn:v1:eu:instance:123'
    }
  ]}
  icon={ODS_ICON_NAME.more}
/>
```

##### GuideButton
**Description** : Guide button component (deprecated in MRC v3)

**Import** :
```typescript
import { GuideButton } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface GuideButtonProps {
  items: GuideItem[];            // Required: guide items
  isLoading?: boolean;          // Optional: loading state
}

interface GuideItem {
  id: number;                   // Required: item identifier
  href: string;                 // Required: guide URL
  download?: string;             // Optional: download attribute
  target?: string;               // Optional: link target
  rel?: string;                  // Optional: link relation
  label: string;                 // Required: item label
  onClick?: () => void;          // Optional: click handler
}
```

**Example** :
```typescript
<GuideButton
  items={[
    {
      id: 1,
      href: '/guide/getting-started',
      label: 'Getting Started'
    },
    {
      id: 2,
      href: '/guide/advanced',
      label: 'Advanced Configuration'
    }
  ]}
/>
```

##### ChangelogButton
**Description** : Changelog button component for navigation menus

**Import** :
```typescript
import { ChangelogButton } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ChangelogButtonProps {
  links: ChangelogLinks;          // Required: changelog links configuration
  chapters?: string[];           // Optional: chapters to display
  prefixes?: string[];           // Optional: prefixes to filter
}

interface ChangelogLinks {
  changelog: string;             // Required: changelog URL
  roadmap: string;               // Required: roadmap URL
  'feature-request': string;     // Required: feature request URL
}
```

**Example** :
```typescript
<ChangelogButton
  links={{
    changelog: '/changelog',
    roadmap: '/roadmap',
    'feature-request': '/feature-request'
  }}
  chapters={['new', 'improved', 'fixed']}
  prefixes={['v2.39', 'v2.40']}
/>
```

#### Content Components

##### ManagerTile
**Description** : Manager-specific tile component

**Import** :
```typescript
import { ManagerTile } from '@ovh-ux/manager-react-components';
```

##### DashboardTile
**Description** : Dashboard tile component

**Import** :
```typescript
import { DashboardTile } from '@ovh-ux/manager-react-components';
```

##### Price
**Description** : Price display component

**Import** :
```typescript
import { Price } from '@ovh-ux/manager-react-components';
```

##### FormattedDate
**Description** : Formatted date display

**Import** :
```typescript
import { FormattedDate } from '@ovh-ux/manager-react-components';
```

#### Template Components

##### BaseLayout
**Description** : Base page layout template

**Import** :
```typescript
import { BaseLayout } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface BaseLayoutProps {
  breadcrumb?: React.ReactElement; // Optional: breadcrumb component
  header?: HeadersProps;          // Optional: header props
  message?: React.ReactElement;   // Optional: message component
  description?: string | React.ReactElement; // Optional: description
  subtitle?: string;              // Optional: subtitle
  subDescription?: string;         // Optional: sub-description
  backLinkLabel?: string;         // Optional: back link label
  hrefPrevious?: string;          // Optional: previous page href
  tabs?: React.ReactElement;      // Optional: tabs component
  onClickReturn?: () => void;     // Optional: return handler
  children?: React.ReactNode;      // Optional: layout content
}
```

##### ErrorBoundary
**Description** : Error boundary component

**Import** :
```typescript
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
```

**Props** :
```typescript
interface ErrorBoundaryProps {
  redirectionApp: string;         // Required: application name to redirect
  isPreloaderHide?: boolean;      // Optional: trigger preloader hiding
  isRouteShellSync?: boolean;     // Optional: trigger routes sync between shell and app
}
```

##### ErrorBanner
**Description** : Error banner component

**Import** :
```typescript
import { ErrorBanner } from '@ovh-ux/manager-react-components';
```

#### Specialized Components

##### Notifications
**Description** : Notification system

**Import** :
```typescript
import { Notifications } from '@ovh-ux/manager-react-components';
```

##### Region
**Description** : Region selector component

**Import** :
```typescript
import { Region } from '@ovh-ux/manager-react-components';
```

##### Order
**Description** : Order components

**Import** :
```typescript
import { Order, OrderConfiguration, OrderSummary } from '@ovh-ux/manager-react-components';
```

##### PciMaintenanceBanner
**Description** : PCI maintenance banner

**Import** :
```typescript
import { PciMaintenanceBanner } from '@ovh-ux/manager-react-components';
```

### Custom Hooks

#### Data Management

##### useMe
**Description** : Hook to get current user information

**Import** :
```typescript
import { useMe } from '@ovh-ux/manager-react-components';
```

**Returns** :
```typescript
{
  me: {
    ovhSubsidiary: string;
    currency: {
      code: string;
    };
  };
}
```

**Example** :
```typescript
const { me } = useMe();
console.log(me.ovhSubsidiary); // "FR"
```

##### useProjectRegions
**Description** : Hook to get project regions (deprecated in MRC v3)

**Import** :
```typescript
import { useProjectRegions } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- projectId: string - Project identifier

**Returns** :
```typescript
UseQueryResult<TRegion[], Error>
```

**Example** :
```typescript
const { data: regions, isLoading } = useProjectRegions(projectId);
```

##### useProjectUrl
**Description** : Hook to get project URL (deprecated in MRC v3)

**Import** :
```typescript
import { useProjectUrl } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- appName: string - Application name

**Returns** :
```typescript
string
```

**Example** :
```typescript
const projectUrl = useProjectUrl('pci-project');
```

##### useCatalogPrice
**Description** : Hook for catalog price formatting

**Import** :
```typescript
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- maximumFractionDigits?: number - Maximum fraction digits
- options?: CatalogPriceOptions - Price formatting options

**Returns** :
```typescript
{
  getTextPrice: (priceInCents: number) => string;
  getFormattedCatalogPrice: (price: number) => string;
  getFormattedHourlyCatalogPrice: (price: number) => string;
  getFormattedMonthlyCatalogPrice: (price: number) => string;
}
```

**Example** :
```typescript
const { getFormattedCatalogPrice } = useCatalogPrice(2);
const formattedPrice = getFormattedCatalogPrice(1000); // "€10.00"
```

#### Datagrid Hooks

##### useDatagrid
**Description** : Hook for datagrid state management

**Import** :
```typescript
import { useDatagrid } from '@ovh-ux/manager-react-components';
```

##### useIcebergV2
**Description** : Hook for Iceberg V2 API integration

**Import** :
```typescript
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
```

**Parameters** :
```typescript
interface IcebergV2HookParams<T> {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
  shouldFetchAll?: boolean;
  columns?: DatagridColumn<T>[];
  route: string;
  pageSize?: number;
  disableCache?: boolean;
}
```

**Returns** :
```typescript
{
  flattenData: T[];
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort>>;
  sorting: ColumnSort;
  filters: {
    filters: IcebergFilter[];
    add: (filter: IcebergFilter) => void;
    remove: (filter: IcebergFilter) => void;
  };
  search: {
    onSearch: (search: string) => void;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  };
  // Plus all UseInfiniteQueryResult properties
}
```

**Example** :
```typescript
const { flattenData, sorting, setSorting, filters, search } = useResourcesIcebergV2({
  queryKey: ['instances'],
  route: '/cloud/project/projectId/instance',
  pageSize: 10,
  columns: instanceColumns
});
```

##### useIcebergV6
**Description** : Hook for Iceberg V6 API integration

**Import** :
```typescript
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
```

**Parameters** :
```typescript
interface IcebergV6Hook<T> {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  shouldFetchAll?: boolean;
  columns?: DatagridColumn<T>[];
  route: string;
  pageSize?: number;
  disableCache?: boolean;
}
```

**Returns** :
```typescript
{
  sorting: ColumnSort;
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort>>;
  filters: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: Filter) => void;
  };
  search: {
    onSearch: (search: string) => void;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  };
  data: {
    data: InfiniteData<IcebergFetchResultV6<T>>;
    pageIndex: number;
    totalCount: number;
    flattenData: T[];
  };
  hasNextPage: boolean;
  fetchNextPage: () => Promise<any>;
  // Plus all UseInfiniteQueryResult properties
}
```

**Example** :
```typescript
const { data, hasNextPage, fetchNextPage, sorting, setSorting } = useResourcesIcebergV6({
  queryKey: ['instances'],
  route: '/cloud/project/projectId/instance',
  pageSize: 10,
  columns: instanceColumns
});
```

##### useResourcesV6
**Description** : Hook for V6 API resources with client-side filtering and sorting

**Import** :
```typescript
import { useResourcesV6 } from '@ovh-ux/manager-react-components';
```

**Parameters** :
```typescript
interface ResourcesV6Params<T> {
  queryKey: string[];
  queryFn?: (route: string) => Promise<FetchResultV6<T>>;
  refetchInterval?: (query: Query<FetchResultV6<T>>) => number | false;
  columns: DatagridColumn<T>[];
  defaultSorting?: ColumnSort;
  route: string;
  pageSize?: number;
}
```

**Returns** :
```typescript
{
  data: FetchResultV6<T>;
  sorting: ColumnSort | undefined;
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort | undefined>>;
  pageIndex: number;
  totalCount: number;
  flattenData: T[];
  isError: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
  status: QueryStatus;
  filters: {
    filters: Filter[];
    add: (filter: Filter) => void;
    remove: (filter: Filter) => void;
  };
  search: {
    onSearch: (search: string | undefined) => void;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  };
}
```

**Example** :
```typescript
const { data, isLoading, sorting, setSorting, filters, search } = useResourcesV6({
  queryKey: ['instances'],
  route: '/cloud/project/projectId/instance',
  columns: instanceColumns,
  pageSize: 10
});
```

#### Authorization Management

##### useAuthorizationIam
**Description** : Hook for IAM authorization checks

**Import** :
```typescript
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- actions: string[] - IAM actions to check
- urn: string - Resource URN
- isTrigger?: boolean - Trigger IAM check

**Returns** :
```typescript
{
  isAuthorized: boolean;
  data: IamCheckResponse;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  status: 'pending' | 'error' | 'success';
  // Plus all UseQueryResult properties
}
```

**Example** :
```typescript
const { isAuthorized, isLoading } = useAuthorizationIam(
  ['instance:create'],
  'urn:v1:eu:instance:123',
  true
);
```

##### useGetResourceTags
**Description** : Hook to get resource tags

**Import** :
```typescript
import { useGetResourceTags } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- resourceType?: string - Resource type
- enabled?: boolean - Enable the query

**Returns** :
```typescript
{
  tags: Tag[];
  isError: boolean;
  isLoading: boolean;
}
```

**Example** :
```typescript
const { tags, isLoading } = useGetResourceTags({
  resourceType: 'instance',
  enabled: true
});
```

#### Date and Time

##### useFormatDate
**Description** : Hook for date formatting with date-fns

**Import** :
```typescript
import { useFormatDate } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- invalidDateDisplayLabel?: string - Label for invalid dates

**Returns** :
```typescript
({ date, format }: FormatDateOptions) => string
```

**Example** :
```typescript
const formatDate = useFormatDate({ invalidDateDisplayLabel: 'N/A' });
const formatted = formatDate({ date: new Date(), format: 'dd/MM/yyyy' });
```

##### useFormattedDate
**Description** : Hook for formatted date display (deprecated)

**Import** :
```typescript
import { useFormattedDate } from '@ovh-ux/manager-react-components';
```

**Parameters** :
```typescript
interface FormattedDateProps {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
}
```

**Returns** :
```typescript
string
```

**Example** :
```typescript
const formattedDate = useFormattedDate({
  dateString: '2023-01-01',
  format: DateFormat.display
});
```

##### useDateFnsLocale
**Description** : Hook to get date-fns locale

**Import** :
```typescript
import { useDateFnsLocale } from '@ovh-ux/manager-react-components';
```

**Returns** :
```typescript
any
```

**Example** :
```typescript
const locale = useDateFnsLocale();
```

#### Region Management

##### useTranslatedMicroRegions
**Description** : Hook for translated micro-regions

**Import** :
```typescript
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
```

##### getMacroRegion
**Description** : Function to get macro region

**Import** :
```typescript
import { getMacroRegion } from '@ovh-ux/manager-react-components';
```

##### isLocalZone
**Description** : Function to check if zone is local

**Import** :
```typescript
import { isLocalZone } from '@ovh-ux/manager-react-components';
```

#### PCI (Public Cloud Infrastructure)

##### useProductMaintenance
**Description** : Hook for product maintenance information

**Import** :
```typescript
import { useProductMaintenance } from '@ovh-ux/manager-react-components';
```

#### Feature Availability

##### useFeatureAvailability
**Description** : Hook for feature availability checks

**Import** :
```typescript
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
```

**Parameters** :
- featureList: string[] - List of features to check
- options?: DefinedInitialDataOptions - Query options

**Returns** :
```typescript
UseQueryResult<Record<[...T][number], boolean>, ApiError>
```

**Example** :
```typescript
const { data, isLoading } = useFeatureAvailability(['billing', 'webooo']);
const isBillingAvailable = data?.billing;
```

#### Utilities

##### useBytes
**Description** : Hook for byte formatting

**Import** :
```typescript
import { useBytes } from '@ovh-ux/manager-react-components';
```

**Returns** :
```typescript
{
  formatBytes: (bytes: number, decimals?: number, format?: 1000 | 1024) => string | 0;
}
```

**Example** :
```typescript
const { formatBytes } = useBytes();
const formatted = formatBytes(1024); // "1 KB"
```

##### useNotifications
**Description** : Hook for notification management

**Import** :
```typescript
import { useNotifications } from '@ovh-ux/manager-react-components';
```

**Returns** :
```typescript
{
  addSuccess: (content: ReactNode, dismissable?: boolean) => void;
  addError: (content: ReactNode, dismissable?: boolean) => void;
  addWarning: (content: ReactNode, dismissable?: boolean) => void;
  addInfo: (content: ReactNode, dismissable?: boolean) => void;
  clearNotification: (uid: number) => void;
  clearNotifications: () => void;
  notifications: Notification[];
}
```

**Example** :
```typescript
const { addSuccess, addError } = useNotifications();

const handleSuccess = () => {
  addSuccess('Operation completed successfully');
};

const handleError = () => {
  addError('Operation failed. Please try again.');
};
```

##### useBreadcrumb
**Description** : Hook for breadcrumb management

**Import** :
```typescript
import { useBreadcrumb } from '@ovh-ux/manager-react-components';
```

### Utilities and Types

#### Utility Functions

##### uniqBy
**Description** : Utility function to get unique items by callback

**Import** :
```typescript
import { uniqBy } from '@ovh-ux/manager-react-components';
```

**Signature** :
```typescript
function uniqBy<I, U>(arr: I[], cb: (item: I) => U): any[]
```

**Example** :
```typescript
const uniqueItems = uniqBy(items, item => item.id);
```

##### hashCode
**Description** : Utility function to generate hash code

**Import** :
```typescript
import { hashCode } from '@ovh-ux/manager-react-components';
```

**Signature** :
```typescript
function hashCode(param: any): number
```

**Example** :
```typescript
const hash = hashCode('some string');
```

##### handleClick
**Description** : Utility function for click and keyboard event handling

**Import** :
```typescript
import { handleClick } from '@ovh-ux/manager-react-components';
```

**Signature** :
```typescript
function handleClick(fn: (ev: Event) => void): {
  onClick: MouseEventHandler<Element>;
  onKeyDown: (event: KeyboardEvent) => void;
}
```

**Example** :
```typescript
const clickHandlers = handleClick((ev) => {
  console.log('Clicked or pressed Enter/Space');
});
```

#### Enum Types

##### OvhSubsidiary
**Description** : Enum for OVH subsidiaries

**Import** :
```typescript
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
```

**Values** :
```typescript
enum OvhSubsidiary {
  ASIA = "ASIA",
  AU = "AU",
  CA = "CA",
  CZ = "CZ",
  DE = "DE",
  ES = "ES",
  FI = "FI",
  FR = "FR",
  GB = "GB",
  IE = "IE",
  IN = "IN",
  IT = "IT",
  LT = "LT",
  MA = "MA",
  NL = "NL",
  PL = "PL",
  PT = "PT",
  QC = "QC",
  SG = "SG",
  SN = "SN",
  TN = "TN",
  US = "US",
  WE = "WE",
  WS = "WS",
  EU = "EU",
  DEFAULT = "DEFAULT"
}
```

##### CurrencyCode
**Description** : Enum for currency codes

**Import** :
```typescript
import { CurrencyCode } from '@ovh-ux/manager-react-components';
```

**Values** :
```typescript
enum CurrencyCode {
  AUD = "AUD",
  CAD = "CAD",
  CZK = "CZK",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR",
  MAD = "MAD",
  PLN = "PLN",
  SGD = "SGD",
  USD = "USD",
  TND = "TND",
  XOF = "XOF",
  LTL = "LTL",
  NA = "N/A",
  points = "points"
}
```

##### IntervalUnitType
**Description** : Enum for interval unit types

**Import** :
```typescript
import { IntervalUnitType } from '@ovh-ux/manager-react-components';
```

**Values** :
```typescript
enum IntervalUnitType {
  day = "day",
  month = "month",
  year = "year",
  none = "none"
}
```

##### NotificationType
**Description** : Enum for notification types

**Import** :
```typescript
import { NotificationType } from '@ovh-ux/manager-react-components';
```

**Values** :
```typescript
enum NotificationType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning"
}
```

##### DateFormat
**Description** : Enum for date formats (deprecated)

**Import** :
```typescript
import { DateFormat } from '@ovh-ux/manager-react-components';
```

**Values** :
```typescript
enum DateFormat {
  compact = "compact",        // dd/MM/YYYY
  display = "display",       // dd abbreviated month YYYY
  fullDisplay = "fullDisplay" // dd month YYYY
}
```

#### Type Definitions

##### TRegion
**Description** : Type for region information (deprecated in MRC v3)

**Import** :
```typescript
import { TRegion } from '@ovh-ux/manager-react-components';
```

**Definition** :
```typescript
type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
  ipCountries: string[];
  services: TRegionService[];
}
```

##### Tag
**Description** : Type for tag information

**Import** :
```typescript
import { Tag } from '@ovh-ux/manager-react-components';
```

**Definition** :
```typescript
type Tag = {
  key: string;
  values: string[];
}
```

##### IMe
**Description** : Type for user information

**Import** :
```typescript
import { IMe } from '@ovh-ux/manager-react-components';
```

**Definition** :
```typescript
interface IMe {
  ovhSubsidiary: string;
  currency: {
    code: string;
  };
}
```

#### useNotifications Hook
```typescript
// Notification system for user feedback
import { useNotifications } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const { addSuccess, addError, addWarning, addInfo } = useNotifications();

  const handleOperation = async () => {
    try {
      await apiCall();
      addSuccess('Operation completed successfully');
    } catch (error) {
      addError('Operation failed. Please try again.');
    }
  };

  return (
    <button onClick={handleOperation}>
      Perform Operation
    </button>
  );
}
```

**Available Methods:**
- `addSuccess(message: string)` - Display success notification
- `addError(message: string)` - Display error notification  
- `addWarning(message: string)` - Display warning notification
- `addInfo(message: string)` - Display info notification

**⚠️ Important:** Always use `useNotifications` instead of `console.log` or `console.error` for user feedback.

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
  Button, 
  Modal, 
  Text,
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

// ✅ CORRECT: Import ODS components from the React package
import { Button, Modal, Text } from '@ovhcloud/ods-components/react';

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
- Fallback to regular `Text` from ODS for non-sensitive content

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

// For ODS components, use dataTestId prop
<Button 
  color="primary"
  dataTestId="test-button"
  onClick={handleClick}
>
  Test
</Button>
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
