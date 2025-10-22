# Migration Notes: NAS-HA AngularJS → React

## Overview

This document outlines the migration of the NAS-HA module from AngularJS to React, following the strangler pattern for incremental migration.

## Migration Scope

### ✅ Completed Features

1. **Setup & Configuration**
   - ✅ Dependencies: react-hook-form, yup, @hookform/resolvers
   - ✅ TypeScript types: Nasha, Partition, Access, Snapshot, Task
   - ✅ Translation namespaces: dashboard, partitions, onboarding
   - ✅ i18next configuration

2. **API Layer & Hooks**
   - ✅ useNashaService: Service information
   - ✅ usePartitions: Partitions listing
   - ✅ usePartitionDetail: Individual partition details
   - ✅ useAccesses: Access management
   - ✅ useSnapshots: Snapshot management
   - ✅ useCreatePartition: Create partition mutation
   - ✅ useDeletePartition: Delete partition mutation
   - ✅ useUpdatePartition: Update partition mutation
   - ✅ useTasks: Task tracking with polling

3. **Pages & Components**
   - ✅ Onboarding: 3 guides (Getting Started, NFS, CIFS)
   - ✅ Dashboard: General Information tab
   - ✅ Dashboard: Partitions tab with datagrid
   - ✅ Partitions: Metrics and Space Meter
   - ✅ Modals: Create, Delete, EditSize, EditDescription, ZfsOptions
   - ✅ Task Tracker: Polling with auto-redirect
   - ✅ Order Page: Integration/redirection

4. **Utilities**
   - ✅ Format utilities: ZFS options, enums, data formatting
   - ✅ Translation migration from AngularJS module

### 🚧 Pending Features

1. **Partition Detail Pages**
   - ⏳ Partition detail layout with tabs
   - ⏳ General information tab
   - ⏳ Accesses tab with datagrid
   - ⏳ Snapshots tab with datagrid

2. **Access Management**
   - ⏳ Access listing datagrid
   - ⏳ Delete access modal
   - ⏳ Access type management

3. **Snapshot Management**
   - ⏳ Snapshot listing datagrid
   - ⏳ Delete snapshot modal
   - ⏳ Snapshot type management

## Architecture Changes

### AngularJS → React Mapping

| AngularJS Component | React Equivalent | Status |
|-------------------|------------------|--------|
| `NashaDashboardController` | `useNashaService` | ✅ |
| `NashaDashboardPartitionsController` | `usePartitions` | ✅ |
| `PartitionCreateController` | `useCreatePartition` | ✅ |
| `PartitionDeleteController` | `useDeletePartition` | ✅ |
| `PartitionEditSizeController` | `useUpdatePartition` | ✅ |
| `PartitionZfsOptionsController` | `useUpdatePartition` | ✅ |
| `nashaDashboard` | `Dashboard.page.tsx` | ✅ |
| `nashaDashboardPartitions` | `Partitions.page.tsx` | ✅ |
| `nashaPartitionCreate` | `CreatePartitionModal` | ✅ |
| `nashaPartitionDelete` | `DeletePartitionModal` | ✅ |
| `nashaPartitionEditSize` | `EditSizeModal` | ✅ |
| `nashaPartitionZfsOptions` | `ZfsOptionsModal` | ✅ |

### API Endpoints

All API endpoints remain unchanged:
- `/dedicated/nasha/:serviceName`
- `/dedicated/nasha/:serviceName/partitions`
- `/dedicated/nasha/:serviceName/partitions/:partitionName`
- `/dedicated/nasha/:serviceName/partitions/:partitionName/access`
- `/dedicated/nasha/:serviceName/partitions/:partitionName/snapshot`
- `/dedicated/nasha/:serviceName/task`

### URL Structure

URLs are preserved for backward compatibility:
- `/bmc-nasha` → Onboarding or Dashboard
- `/bmc-nasha/onboarding` → Onboarding page
- `/bmc-nasha/order` → Order page
- `/bmc-nasha/:serviceName` → Dashboard (general-information tab)
- `/bmc-nasha/:serviceName/partitions` → Partitions tab

## Translation Migration

### Namespaces Migrated

1. **dashboard** - Dashboard general information
2. **partitions** - Partitions management
3. **onboarding** - Onboarding guides

### Translation Keys

All translation keys follow the pattern `nasha_*` to maintain consistency with the original AngularJS module.

## Testing Strategy

### Unit Tests
- ✅ Hook tests for data fetching
- ✅ Component tests for UI components
- ✅ Utility function tests

### Integration Tests
- ✅ API integration tests
- ✅ Form validation tests
- ✅ Modal interaction tests

### E2E Tests (Pending)
- ⏳ User journey: Onboarding → Order
- ⏳ User journey: Dashboard → General Information
- ⏳ User journey: Dashboard → Partitions → Create Partition
- ⏳ User journey: Dashboard → Partitions → Edit Partition
- ⏳ User journey: Dashboard → Partitions → Delete Partition

## Performance Considerations

### Optimizations Implemented
- ✅ React Query for efficient data fetching
- ✅ Lazy loading for route components
- ✅ Memoization for expensive calculations
- ✅ Polling optimization for task tracking

### Bundle Size
- ✅ Tree shaking enabled
- ✅ Code splitting by routes
- ✅ Dynamic imports for modals

## Deployment Notes

### Environment Variables
- `VITE_API_BASE_URL`: API base URL
- `VITE_APP_NAME`: Application name
- `VITE_TRACKING_LEVEL`: Tracking level (1, 2, 3)

### Feature Flags
- `dedicated-nasha:eol-lv1-lv2`: EOL banner display
- `dedicated-nasha:monitoring`: Monitoring toggle

## Rollback Plan

In case of issues, the AngularJS module can be restored by:
1. Reverting the routing configuration
2. Disabling the React app
3. Re-enabling the AngularJS module

## Next Steps

1. Complete partition detail pages
2. Implement access management
3. Implement snapshot management
4. Add comprehensive E2E tests
5. Performance optimization
6. User acceptance testing

## Support

For issues or questions regarding this migration:
- Technical lead: [Name]
- Documentation: [Link to docs]
- Issue tracker: [Link to issues]

