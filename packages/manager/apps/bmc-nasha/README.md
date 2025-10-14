# bmc-nasha — OVHcloud Manager Application

> Universe: **Baremetal / Dedicated**

## Overview

This application is a single-page React app integrated into the OVHcloud Manager ecosystem.  
It is fully **flavor-driven**, meaning routing, tracking, and API configuration are centralized in [`src/App.constants.ts`](src/App.constants.ts).  
The same codebase supports multiple product universes (PCI, Hub, Web, Zimbra) by changing only constants.

---

## ⚙ Configuration

### `src/App.constants.ts`

Single source of truth for app identity, API strategy, feature flags, and tracking. Tokens like `app-gen-test` and `Hub` are filled by the generator.

```ts
export const appName = 'bmc-nasha';

export const APP_FEATURES = {
  // API strategies
  listingApi: 'v6' as ListingApi,      // 'v6Iceberg' | 'v2' | 'v6'
  dashboardApi: 'v6' as DashboardApi, // 'v6' | 'v2'

  // Flavor + routing
  isPci: 'false',
  routeFlavor: 'generic' as const,         // 'pci' | 'generic' | 'platformParam'
  basePrefix: '',                                  // optional shell prefix
  serviceParam: 'id',                    // service route param (no ':' in final URL)
  platformParam: 'id',                    // platform route param
  appSlug: appName,                                // for PCI, use short slug (e.g. "billing")

  // Tracking
  tracking: {
    level2ByRegion: {
      EU: { level2: '0' },
      CA: { level2: '0' },
      US: { level2: '0' },
    },
    universe: 'Baremetal',
    subUniverse: 'Dedicated',
    appNameForTracking: appName,
  },
} as const;
```

Changing these values updates:
- **Root route** computation (see Routing below)
- **Tracking constants** (`LEVEL2`, `UNIVERSE`, `SUB_UNIVERSE`, `APP_NAME`)
- **API strategy** for onboarding and listing

---

## 📍 Routing

Route helpers and constants live in [`src/routes/Routes.utils.ts`](src/routes/Routes.utils.ts).  
The **root path** is computed from `APP_FEATURES.routeFlavor` (optional `basePrefix` is prepended):

- **'pci'** → `/[basePrefix]/pci/projects/:projectId/{appSlug}`
- **'generic'** (default) → `/[basePrefix]/{appSlug}`

High-level routes (relative to the root) are exposed via `urls`:
```ts
export const urls = {
  root: getRoot(),                    // flavor-aware root
  dashboard: `dashboard/:serviceName?`,
  onboarding: 'onboarding',
} as const;
```

**Dashboard subroutes** are centralized to avoid circular imports:
```ts
export const subRoutes = {
  overview: '',           // default tab
  settings: 'settings',
  ...(isPci ? { quota: 'quota' } : {}),
} as const;
```

The route tree is defined in [`src/routes/Routes.tsx`](src/routes/Routes.tsx) using `React.lazy` and integrates the Manager `ErrorBoundary` (with `redirectionApp` from `Routes.utils.ts`).

---

## 📊 Tracking Constants

Defined in [`src/Tracking.constants.ts`](src/Tracking.constants.ts) and **resolved from `App.constants.ts`**:

```ts
export const LEVEL2 = {
  EU: { config: { level2: APP_FEATURES.tracking.level2ByRegion.EU.level2 } },
  CA: { config: { level2: APP_FEATURES.tracking.level2ByRegion.CA.level2 } },
  US: { config: { level2: APP_FEATURES.tracking.level2ByRegion.US.level2 } },
} as const;

export const UNIVERSE = APP_FEATURES.tracking.universe;
export const SUB_UNIVERSE = APP_FEATURES.tracking.subUniverse;
export const APP_NAME = APP_FEATURES.tracking.appNameForTracking ?? appName;
```

These values are injected into the shell from `src/index.tsx`.

---

## 🔌 API Layer (Facade)

**Where:** `src/data/api/commons` and `src/data/api/hooks`

- `Client.api.ts` — typed facade over `@ovh-ux/manager-core-api` (v2/v6, Iceberg helpers)
- `Client.utils.ts` — route interpolation & normalization (e.g., `resolveListingRoute()`)
- `useResources.ts` — hook facade that selects the right listing strategy based on `APP_FEATURES.listingApi`

**Examples**

Listing (one page via Iceberg v6 / v2 / plain v6 — chosen by `APP_FEATURES.listingApi`):
```ts
import { getListingPage } from '@/data/api/commons/Client.api';

const { data, totalCount, status } = await getListingPage<MyType>({
  page: 1,
  pageSize: 50,
  sortBy: 'creationDate',
  sortDesc: true,
  // optional: route override, filters, cursor (for v2), etc.
});
```

Onboarding (with mock fallback when `API_DATA_MODE === 'mock'`):
```ts
import { getOnboardingConfig } from '@/data/api/commons/Client.api';

const config = await getOnboardingConfig();
```

If you need to work directly with Iceberg helpers:
```ts
import { fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
```

---

## 🚀 Development

From the root:

```bash
# Install dependencies
yarn workspace @ovh-ux/manager-bmc-nasha-app install

# Start dev server (Vite)
yarn workspace @ovh-ux/manager-bmc-nasha-app start

# Build for production
yarn workspace @ovh-ux/manager-bmc-nasha-app build

# Lint
yarn workspace @ovh-ux/manager-bmc-nasha-app lint:modern
yarn workspace @ovh-ux/manager-bmc-nasha-app lint:modern:fix

# Test
yarn workspace @ovh-ux/manager-bmc-nasha-app test
yarn workspace @ovh-ux/manager-bmc-nasha-app test:coverage
```

The app uses **hash-based routing**. Open the dev server URL printed by Vite (default `http://localhost:5173/`) and navigate under:
```
#/[flavor-aware root from Routes.utils.ts]
```
For example (PCI flavor):
```
#/pci/projects/:projectId/app-gen-test
```

---

## 📚 Useful Links

- Manager React Shell Client: https://github.com/ovh/manager
- React Router Docs: https://reactrouter.com/
- Iceberg API Guide: https://github.com/ovh/manager-core-api
- OVHcloud Public API Explorer: https://api.ovh.com/

---

**Generated with ❤️ by OVHcloud Manager App Generator**

---

## App Features

1. Introduction

The Nasha application is a high-availability Network Attached Storage (NAS) solution designed for OVHcloud customers. It provides centralized management of storage space based on the OpenZFS file system, offering advanced partitioning, snapshot backup, and access control features.

Target Users: OVHcloud customers who need reliable shared storage for their dedicated servers, VPS, Public Cloud instances, or other OVHcloud services.

Main Purpose: Provide an intuitive web interface for configuring and administering NAS-HA storage spaces with enterprise-grade features like snapshots, access control, and ZFS optimization.
2. Screens
2.1 Services Catalog Screen

Screen Purpose: Display and manage all NAS-HA services owned by the user.

Layout Overview:

    Header: Application title and navigation
    Main Content: Data table with services list
    Top Bar: Action buttons (Order new service)
    Footer: Pagination and additional controls

UI Elements and Controls:

    Service Table:
        Columns: Service ID, Custom Name, Datacenter Location, Disk Type, Zpool Capacity, Zpool Size, Partition Creation Capability, Monitoring Status
        Sortable columns with ascending/descending options
        Filterable content with search functionality
        Customizable column visibility
    Order Button: "Order a HA-NAS" button (top-right)
    Service Links: Clickable service names leading to individual dashboards
    Column Customization: Show/hide columns toggle
    Pagination: Page navigation controls

Navigation and Flows:

    Entry: Automatic redirection from homepage if user has services
    Actions: Click service name → Service Dashboard
    Actions: Click "Order a HA-NAS" → Ordering Screen
    Exit: Back to main OVHcloud interface

2.2 Onboarding Screen

Screen Purpose: Guide new users who don't have any NAS-HA services.

Layout Overview:

    Header: Application title
    Main Content: Product illustration and description
    Guide Section: Usage guides and documentation links
    Action Area: Primary call-to-action button

UI Elements and Controls:

    Product Illustration: Large image showing NAS-HA concept
    Title: "NAS-HA" heading
    Description: Text explaining the product benefits
    Order Button: Large "Order a HA-NAS" button (primary action)
    Guide Cards:
        "Getting started with a HA-NAS solution"
        "Mount your NAS via an NFS share"
        "Mounting a NAS solution on Windows Server via CIFS"
    External Links: Links to documentation and guides

Navigation and Flows:

    Entry: Automatic redirection if user has no services
    Actions: Click "Order a HA-NAS" → Ordering Screen
    Actions: Click guide links → External documentation
    Exit: Back to main OVHcloud interface

2.3 Service Dashboard Screen

Screen Purpose: Main control center for a specific NAS-HA service.

Layout Overview:

    Header: Service name, edit button, guides menu, changelog button
    Tabs: General Information, Partitions
    Main Content: Service metrics and information tiles
    Alert Banner: End-of-life warnings (if applicable)

UI Elements and Controls:

    Service Header:
        Service name (editable with pen icon)
        Service ID display
        Edit name button (pen icon)
        Guides menu dropdown
        Changelog button
    Alert Banner: End-of-life service warnings
    Tab Navigation:
        "General Information" tab
        "Partitions" tab
    Information Tiles:
        Service details (name, ID, datacenter, disk type)
        Usage metrics (space usage, monitoring status)
        Service information (creation date, expiration, renewal options)
    Action Buttons: Create partition, manage service

Navigation and Flows:

    Entry: Click service from catalog
    Actions: Click "Partitions" tab → Partitions Management
    Actions: Click edit name → Name Edit Modal
    Actions: Click guides → External documentation
    Exit: Back to Services Catalog

2.4 Partitions Management Screen

Screen Purpose: Manage storage partitions for the selected service.

Layout Overview:

    Header: Partitions title and create button
    Metrics Section: Usage statistics and monitoring controls
    Partitions Table: List of existing partitions
    Action Buttons: Create, edit, delete partitions

UI Elements and Controls:

    Metrics Section:
        Space usage meter (visual progress bar)
        Total allocated size display
        Monitoring toggle switch
        Renewal link
    Partitions Table:
        Columns: Partition Name, Protocol, Size, Description
        Action buttons per row: View/Edit, Manage Access, Manage Snapshots, Configure ZFS, Delete
    Create Button: "Create a partition" button (disabled if no space available)
    Monitoring Controls: Toggle for usage notifications

Navigation and Flows:

    Entry: From Service Dashboard → Partitions tab
    Actions: Click partition name → Partition Details
    Actions: Click "Create a partition" → Partition Creation Form
    Actions: Click action buttons → Specific management screens
    Exit: Back to Service Dashboard

2.5 Partition Details Screen

Screen Purpose: Detailed management of a specific partition.

Layout Overview:

    Header: Partition name and service ID
    Tabs: General Information, Snapshots, Accesses
    Main Content: Partition-specific information and controls

UI Elements and Controls:

    Partition Header:
        Partition name (large heading)
        Service ID display
    Tab Navigation:
        "General Information" tab
        "Snapshots" tab
        "Accesses" tab
    Information Display: Partition details, size, protocol, description
    Action Buttons: Edit size, configure ZFS, delete partition

Navigation and Flows:

    Entry: Click partition name from Partitions Management
    Actions: Click tabs → Specific management screens
    Actions: Click action buttons → Configuration modals
    Exit: Back to Partitions Management

2.6 Partition Access Management Screen

Screen Purpose: Configure access controls (ACL) for a partition.

Layout Overview:

    Header: "Manage access control list (ACL)" title
    Description: Information about IP restrictions
    Access List: Table of authorized IPs
    Add Form: Form to add new access rules

UI Elements and Controls:

    Description Text: Information about OVHcloud IP restrictions
    Access List Table:
        Columns: IP Address, Type, Description
        Action buttons: Edit, Delete
    Add Access Form:
        IP address input field
        Type dropdown (Read, Read/Write)
        Description text area
        Submit/Cancel buttons
    Hide Form Button: Collapse the add form

Navigation and Flows:

    Entry: From Partition Details → Accesses tab
    Actions: Add new access → Form submission
    Actions: Edit/Delete access → Confirmation dialogs
    Exit: Back to Partition Details

2.7 Partition Snapshots Screen

Screen Purpose: Manage snapshot policies and manual snapshots.

Layout Overview:

    Header: "Manage snapshot policies" title
    Description: Information about snapshot usage
    Snapshots List: Table of existing snapshots
    Policy Configuration: Automatic snapshot settings
    Manual Snapshot Form: Create manual snapshots

UI Elements and Controls:

    Description Text: Information about snapshot storage usage
    Snapshots Table:
        Columns: Type, Name, Options
        Action buttons: Delete (for manual snapshots)
    Automatic Snapshots Section:
        Frequency checkboxes (Hourly, Daily, Weekly, etc.)
        Submit/Reset buttons
    Manual Snapshot Form:
        Name input field
        Create button
    Warning Messages: Storage space usage warnings

Navigation and Flows:

    Entry: From Partition Details → Snapshots tab
    Actions: Configure automatic snapshots → Policy update
    Actions: Create manual snapshot → Snapshot creation
    Actions: Delete snapshot → Confirmation dialog
    Exit: Back to Partition Details

2.8 Service Ordering Screen

Screen Purpose: Order new NAS-HA services through OVHcloud ordering system.

Layout Overview:

    Header: OVHcloud ordering interface
    Main Content: Embedded ordering widget
    Navigation: Back to Nasha application

UI Elements and Controls:

    Ordering Widget: Embedded OVHcloud ordering interface
    Configuration Options: Capacity, location, disk type selection
    Cart: Shopping cart with selected options
    Navigation Bar: Back to Nasha application
    Progress Indicators: Ordering steps and validation

Navigation and Flows:

    Entry: Click "Order a HA-NAS" from any screen
    Actions: Configure service parameters → Cart validation
    Actions: Complete order → Return to Nasha
    Actions: Cancel order → Return to previous screen
    Exit: Back to Nasha application

2.9 Task Tracking Screen

Screen Purpose: Monitor ongoing operations and task progress.

Layout Overview:

    Header: Task tracking information
    Progress Section: Visual progress indicators
    Task Details: Current operation status
    Action Buttons: Cancel, refresh status

UI Elements and Controls:

    Progress Bar: Visual indication of task completion
    Status Text: Current operation description
    Task Information: Operation details and estimated time
    Cancel Button: Stop ongoing operation
    Refresh Button: Update task status

Navigation and Flows:

    Entry: Automatic display during operations
    Actions: Cancel operation → Confirmation dialog
    Actions: Wait for completion → Return to previous screen
    Exit: Automatic return when task completes

3. Features
3.1 Services Catalog Management

Functional Description: Central hub for viewing and managing all NAS-HA services with advanced filtering and sorting capabilities.

Access Conditions / Triggers:

    Automatic access upon login if user has NAS-HA services
    Accessible via main navigation menu

Usage Scenarios:

    User logs into Nasha application
    System displays services in sortable table
    User can filter, sort, and customize column display
    User clicks service name to access dashboard
    User can order new services via prominent button

Functional Dependencies:

    Requires at least one NAS-HA service
    Precedes access to service dashboards
    Linked to ordering functionality

Business Rules:

    Display all user's NAS-HA services
    Customizable column visibility
    Sortable by any column
    Filterable content
    Always show order button for new services

API Calls Used:

    Retrieve services list: Gets all user's NAS-HA services
        Purpose: Display services in catalog table
        Visible impact: Populates the services table
        HTTP Method: GET
        Endpoint: /dedicated/nasha

3.2 Service Dashboard

Functional Description: Comprehensive control center providing service overview, metrics, and access to all management features.

Access Conditions / Triggers:

    Accessible by clicking service name from catalog
    Requires active NAS-HA service

Usage Scenarios:

    User selects service from catalog
    Dashboard displays service information and metrics
    User can view general information or manage partitions
    User can edit service name or access guides
    User navigates to specific management areas

Functional Dependencies:

    Requires active NAS-HA service
    Precedes all partition management features
    Linked to billing and service information

Business Rules:

    Display service name (custom or default ID)
    Show real-time usage metrics
    Provide access to all management features
    Display service status and monitoring information

API Calls Used:

    Service information: Gets complete service details
        Purpose: Display service information and metrics
        Visible impact: Shows service details in dashboard
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}
    Service billing info: Gets billing and renewal information
        Purpose: Display service dates and renewal options
        Visible impact: Shows creation/expiration dates
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/serviceInfos

3.3 Partition Management

Functional Description: Complete lifecycle management of storage partitions including creation, configuration, and deletion.

Access Conditions / Triggers:

    Accessible from service dashboard
    Requires NAS-HA service with available space

Usage Scenarios:

    User accesses partitions tab from service dashboard
    User views existing partitions and usage metrics
    User creates new partition with size and protocol configuration
    User manages individual partitions (access, snapshots, ZFS options)
    User can delete partitions when no longer needed

Functional Dependencies:

    Requires active NAS-HA service
    Linked to access management and snapshot features
    Precedes ZFS configuration

Business Rules:

    Verify available space before partition creation
    Mandatory partition name and size configuration
    Support for NFS and CIFS protocols
    IP address access control
    ZFS options configurable per partition

API Calls Used:

    Partition list: Gets all service partitions
        Purpose: Display partitions in management table
        Visible impact: Shows partition list with details
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/partition
    Create partition: Creates new partition
        Purpose: Add new storage partition
        Visible impact: Adds partition to list
        HTTP Method: POST
        Endpoint: /dedicated/nasha/{serviceName}/partition
    Delete partition: Removes partition
        Purpose: Delete partition and free space
        Visible impact: Removes partition from list
        HTTP Method: DELETE
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}

3.4 Access Control Management

Functional Description: Configure IP-based access controls for partition security and access management.

Access Conditions / Triggers:

    Accessible from partition details
    Requires existing partition

Usage Scenarios:

    User selects partition from partitions list
    User navigates to access management tab
    User views current access rules
    User adds new IP addresses or IP ranges
    User configures access types (read-only, read/write)

Functional Dependencies:

    Requires existing partition
    Linked to partition protocol configuration
    Precedes effective partition usage

Business Rules:

    Only OVHcloud IP addresses authorized by default
    Support for individual IPs and IP ranges
    Mandatory description for each access rule
    Access types: read-only or read/write

API Calls Used:

    Access list: Gets partition access rules
        Purpose: Display authorized access list
        Visible impact: Shows access rules in table
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/access
    Add access: Creates new access rule
        Purpose: Authorize new IP address
        Visible impact: Adds access rule to list
        HTTP Method: POST
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/access
    Delete access: Removes access rule
        Purpose: Revoke IP access authorization
        Visible impact: Removes access from list
        HTTP Method: DELETE
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/access/{accessId}

3.5 Snapshot Management

Functional Description: Create and manage partition snapshots for data backup and restoration with automatic and manual options.

Access Conditions / Triggers:

    Accessible from partition details
    Requires existing partition

Usage Scenarios:

    User selects partition from partitions list
    User navigates to snapshots tab
    User configures automatic snapshot policies
    User creates manual snapshots with custom names
    User manages existing snapshots (view, delete)

Functional Dependencies:

    Requires existing partition
    Linked to available storage space
    Precedes data restoration operations

Business Rules:

    Automatic snapshots configurable by frequency
    Manual snapshots with custom naming
    Limitation on number of manual snapshots
    Storage space usage for snapshots
    Naming rules for manual snapshots

API Calls Used:

    Snapshot list: Gets partition snapshots
        Purpose: Display existing snapshots
        Visible impact: Shows snapshots in table
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/customSnapshot
    Create snapshot: Creates manual snapshot
        Purpose: Create backup point
        Visible impact: Adds snapshot to list
        HTTP Method: POST
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/customSnapshot
    Configure automatic snapshots: Sets snapshot policies
        Purpose: Enable/disable automatic snapshots
        Visible impact: Updates snapshot policies
        HTTP Method: POST/DELETE
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/snapshot

3.6 ZFS Configuration

Functional Description: Configure advanced ZFS file system options for performance optimization and reliability tuning.

Access Conditions / Triggers:

    Accessible from partition management
    Requires existing partition

Usage Scenarios:

    User selects partition from partitions list
    User clicks "Configure usage (ZFS)" option
    User views current ZFS configuration
    User modifies parameters according to needs
    User validates and applies changes

Functional Dependencies:

    Requires existing partition
    Linked to file system performance
    Precedes performance optimization

Business Rules:

    Synchronization options (standard, always, disabled)
    Configurable record size
    Timestamp options (atime) configurable
    Default parameters applicable
    Value validation according to ZFS constraints

API Calls Used:

    ZFS options: Gets current ZFS configuration
        Purpose: Display current ZFS settings
        Visible impact: Shows current parameters
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/zfsOptions
    Update ZFS options: Modifies ZFS configuration
        Purpose: Apply new ZFS settings
        Visible impact: Updates partition performance
        HTTP Method: PUT
        Endpoint: /dedicated/nasha/{serviceName}/partition/{partitionName}/zfsOptions

3.7 Service Ordering

Functional Description: Order new NAS-HA services through integrated OVHcloud ordering system with full configuration options.

Access Conditions / Triggers:

    Accessible from onboarding or catalog screens
    Requires active OVHcloud account with payment methods

Usage Scenarios:

    User clicks "Order a HA-NAS" button
    System redirects to ordering interface
    User configures service parameters (capacity, location, disk type)
    User validates cart and completes order
    User returns to Nasha application

Functional Dependencies:

    Requires valid OVHcloud account
    Linked to billing and payment system
    Precedes access to new service dashboard

Business Rules:

    Mandatory storage capacity configuration
    Datacenter location selection
    Disk type choice (SSD or HDD)
    Payment method validation
    Order confirmation with commitment

API Calls Used:

    Ordering integration: Uses OVHcloud ordering system
        Purpose: Complete service ordering process
        Visible impact: Full ordering interface with cart
        Relation: Precedes new service availability

3.8 Task and Operations Management

Functional Description: Monitor and track ongoing operations with real-time progress updates and status management.

Access Conditions / Triggers:

    Automatically displayed during operations
    Accessible via operation notifications

Usage Scenarios:

    User initiates operation (create, modify, delete)
    System displays task tracking interface
    User monitors operation progress
    System shows completion or error status
    User returns to previous interface

Functional Dependencies:

    Linked to all modification operations
    Precedes operation finalization
    Necessary for long-running operations

Business Rules:

    Real-time operation tracking
    Progress and status display
    Error and failure management
    Automatic return to interface

API Calls Used:

    Active tasks: Gets ongoing operations
        Purpose: Display current operations
        Visible impact: Shows operation progress
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/task
    Task status: Gets specific task information
        Purpose: Update operation progress
        Visible impact: Updates progress indicators
        HTTP Method: GET
        Endpoint: /dedicated/nasha/{serviceName}/task/{taskId}

4. Navigation Map
4.1 Main Navigation Flow

Homepage
├── Services Catalog (if user has services)
│   ├── Service Dashboard
│   │   ├── General Information
│   │   └── Partitions Management
│   │       ├── Partition Details
│   │       │   ├── General Information
│   │       │   ├── Access Management
│   │       │   └── Snapshot Management
│   │       ├── Create Partition
│   │       ├── Edit Partition
│   │       └── Delete Partition
│   └── Order New Service
└── Onboarding (if user has no services)
    ├── Product Information
    ├── Usage Guides
    └── Order New Service

4.2 Screen Relationships

    Services Catalog ↔ Service Dashboard: Direct navigation via service selection
    Service Dashboard ↔ Partitions Management: Tab-based navigation
    Partitions Management ↔ Partition Details: Click partition name
    Partition Details ↔ Access/Snapshot Management: Tab-based navigation
    Any Screen ↔ Service Ordering: Via "Order a HA-NAS" button
    Any Screen ↔ Task Tracking: Automatic during operations

4.3 Navigation Patterns

    Tab Navigation: Used for main sections (General Information, Partitions)
    Breadcrumb Navigation: Shows current location in hierarchy
    Modal Navigation: Used for forms and confirmations
    Automatic Redirection: Based on user service ownership
    External Links: For documentation and guides

5. States and Conditions
5.1 Service States

    Active: Service is operational and accessible
    Pending: Service is being provisioned
    Suspended: Service is temporarily unavailable
    Expired: Service has reached end of billing period
    End-of-Life: Service is scheduled for discontinuation

5.2 Partition States

    Available: Partition is ready for use
    Creating: Partition is being created
    Modifying: Partition configuration is being updated
    Deleting: Partition is being removed

5.3 Task States

    Pending: Operation is queued
    In Progress: Operation is being executed
    Completed: Operation finished successfully
    Failed: Operation encountered an error
    Cancelled: Operation was stopped by user

5.4 State Transitions

    Service: Pending → Active → (Suspended/Expired/End-of-Life)
    Partition: Creating → Available → (Modifying/Deleting)
    Task: Pending → In Progress → (Completed/Failed/Cancelled)

6. Error Handling and Messages
6.1 Error Messages

    General Error: "An error occurred: {{message}}"
    Validation Errors: Field-specific validation messages
    Network Errors: Connection and timeout messages
    Permission Errors: Access denied messages
    Resource Errors: Insufficient space or quota messages

6.2 Success Messages

    Operation Success: "Operation completed successfully"
    Configuration Updated: "Settings have been saved"
    Service Created: "Service has been created successfully"
    Partition Created: "Partition has been created"
    Access Added: "Access rule has been added"
    Snapshot Created: "Snapshot has been created"

6.3 Validation Rules

Partition Creation:

    Name: Required, alphanumeric characters, hyphens, underscores only
    Size: Required, minimum 1GB, maximum available space
    Protocol: Required, NFS or CIFS selection
    Description: Optional, maximum 255 characters

Access Management:

    IP Address: Required, valid IP format or CIDR notation
    Type: Required, Read or Read/Write selection
    Description: Required, maximum 255 characters

Snapshot Management:

    Manual Snapshot Name: Required, alphanumeric characters, hyphens, underscores only
    Frequency Selection: At least one frequency must be selected for automatic snapshots

ZFS Configuration:

    Record Size: Valid ZFS record size values
    Sync Options: Standard, Always, or Disabled
    Atime: On or Off

6.4 Warning Messages

    End-of-Life Services: "Your service will reach its end of life on [date]"
    Storage Space: "You are approaching your storage limit"
    Snapshot Space: "Snapshots are using additional storage space"
    Access Restrictions: "Only OVHcloud IP addresses are authorized"

7. User Roles and Permissions
7.1 User Roles

Standard User:

    View all owned NAS-HA services
    Manage partitions and configurations
    Create and delete partitions
    Configure access controls
    Manage snapshots
    Order new services

Administrator:

    All standard user permissions
    Access to billing information
    Service renewal capabilities
    Advanced configuration options

7.2 Screen Access

All Users:

    Services Catalog
    Service Dashboard
    Partition Management
    Access Control Management
    Snapshot Management
    ZFS Configuration
    Service Ordering
    Task Tracking

Administrators Only:

    Billing information
    Service renewal options
    Advanced monitoring settings

7.3 Feature Permissions

Service Management:

    View services: All users
    Edit service name: All users
    Access billing: Administrators only

Partition Management:

    Create partitions: All users
    Delete partitions: All users
    Configure ZFS: All users

Access Control:

    Manage IP access: All users
    Configure protocols: All users

Snapshot Management:

    Create snapshots: All users
    Configure policies: All users
    Delete snapshots: All users

8. Shared Components
8.1 Header Component

Content: Application title, service name, navigation controls Purpose: Provide consistent navigation and branding Interactions:

    Service name editing (pen icon)
    Guides menu dropdown
    Changelog button
    Tab navigation

8.2 Alert Banner Component

Content: Warning messages for end-of-life services Purpose: Notify users of important service information Interactions:

    Dismissible alerts
    External links to migration guides
    Service-specific information

8.3 Data Table Component

Content: Sortable, filterable data tables Purpose: Display structured data with interaction capabilities Interactions:

    Column sorting (ascending/descending)
    Content filtering
    Row selection
    Action buttons per row

8.4 Form Components

Content: Input fields, dropdowns, text areas Purpose: Data entry and configuration Interactions:

    Real-time validation
    Required field indicators
    Submit/cancel actions
    Field-specific help text

8.5 Modal Components

Content: Overlay dialogs for forms and confirmations Purpose: Focused user interactions Interactions:

    Form submission
    Confirmation dialogs
    Cancel actions
    External link handling

8.6 Progress Tracking Component

Content: Visual progress indicators and status text Purpose: Show operation progress and status Interactions:

    Real-time updates
    Cancel operations
    Status refresh
    Automatic completion handling

8.7 Metrics Display Component

Content: Usage statistics and monitoring information Purpose: Provide service and partition metrics Interactions:

    Visual progress bars
    Toggle switches for monitoring
    Renewal links
    Real-time updates

This comprehensive documentation serves as a complete functional specification for rebuilding the Nasha application in any technology stack, providing detailed information about screens, features, navigation, states, error handling, user roles, and shared components.
