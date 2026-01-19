# Perfect Parity Examples

> @ai-purpose: Reference examples showing PERFECT iso-functional migrations and VIOLATIONS to avoid

## Purpose

This document provides complete before/after examples that demonstrate:
1. **Perfect parity** - What a correct migration looks like
2. **Parity violations** - Common mistakes that break functionality
3. **Parity checklists** - What to verify for each pattern

---

## Example 1: Route with Resolve → React Query

### AngularJS Source (BEFORE)

```javascript
// packages/manager/modules/nasha/src/dashboard/nasha-dashboard.routing.js

angular.module('ovhManagerNasha').config(/* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard', {
    url: '/:serviceName',
    component: 'nashaDashboard',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
      nasha: /* @ngInject */ (OvhApiDedicatedNasha, serviceName, prepareNasha) => {
        const aapi = OvhApiDedicatedNasha.Aapi();
        return aapi.get({ serviceName }).$promise.then(prepareNasha);
      },
      partitions: /* @ngInject */ (OvhApiDedicatedNasha, serviceName) =>
        OvhApiDedicatedNasha.Partition()
          .v6()
          .query({ serviceName })
          .$promise.then((partitionIds) =>
            Promise.all(
              partitionIds.map((partitionName) =>
                OvhApiDedicatedNasha.Partition()
                  .v6()
                  .get({ serviceName, partitionName }).$promise
              )
            )
          ),
    },
  });
});
```

### React Migration (AFTER - PERFECT)

```typescript
// packages/manager/apps/bmc-nasha/src/pages/Dashboard/Dashboard.page.tsx

import { useParams } from 'react-router-dom';
import { useNashaDetail } from '@/data/api/hooks/useNashaDetail';
import { useNashaPartitions } from '@/data/api/hooks/useNashaPartitions';
import { Loading, ErrorBanner } from '@ovh-ux/muk';

export function DashboardPage() {
  // ✅ PARITY: serviceName from URL params (same as $transition$.params().serviceName)
  const { serviceName } = useParams<{ serviceName: string }>();

  // ✅ PARITY: nasha data with AAPI (same as OvhApiDedicatedNasha.Aapi().get())
  const { data: nasha, isLoading: isLoadingNasha, error: nashaError } = useNashaDetail(serviceName!);

  // ✅ PARITY: partitions list (same as OvhApiDedicatedNasha.Partition().v6().query())
  const { data: partitions, isLoading: isLoadingPartitions, error: partitionsError } = useNashaPartitions(serviceName!);

  // ✅ PARITY: Loading state (implicit in AngularJS resolve - route waits for data)
  if (isLoadingNasha || isLoadingPartitions) {
    return <Loading />;
  }

  // ✅ PARITY: Error handling (AngularJS would show error page on resolve failure)
  if (nashaError || partitionsError) {
    return <ErrorBanner error={nashaError || partitionsError} />;
  }

  return (
    <Dashboard nasha={nasha} partitions={partitions} />
  );
}
```

```typescript
// packages/manager/apps/bmc-nasha/src/data/api/hooks/useNashaDetail.ts

import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePrepareNasha } from './usePrepareNasha';

// ✅ PARITY: Same data transformation as prepareNasha in AngularJS
export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();

  return useQuery({
    queryKey: ['nasha', serviceName],
    queryFn: async () => {
      // ✅ PARITY: AAPI endpoint (same as OvhApiDedicatedNasha.Aapi().get())
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      // ✅ PARITY: Data transformation (same as .then(prepareNasha))
      return prepareNasha(data);
    },
    enabled: !!serviceName,
  });
}
```

### Parity Checklist for This Pattern

| Check | AngularJS | React | Status |
|-------|-----------|-------|--------|
| URL parameter extraction | `$transition$.params().serviceName` | `useParams()` | ✅ |
| API endpoint | `OvhApiDedicatedNasha.Aapi().get()` | `aapi.get('/dedicated/nasha/...')` | ✅ |
| Data transformation | `prepareNasha` function | `usePrepareNasha` hook | ✅ |
| Loading state | Implicit (resolve blocks render) | Explicit `isLoading` check | ✅ |
| Error handling | Implicit (resolve rejection) | Explicit `error` check | ✅ |
| Sub-resource loading | Parallel Promise.all | Separate useQuery hook | ✅ |

---

## Example 2: Form Submission with API Call

### AngularJS Source (BEFORE)

```javascript
// packages/manager/modules/nasha/src/partition/add/partition-add.controller.js

angular.module('ovhManagerNasha').controller('NashaPartitionAddController', class {
  /* @ngInject */
  constructor($state, OvhApiDedicatedNasha, Alerter, $translate) {
    this.$state = $state;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.model = {
      partitionName: '',
      size: 10,
      protocol: 'NFS',
    };
    this.isSubmitting = false;
  }

  submit() {
    this.isSubmitting = true;
    this.OvhApiDedicatedNasha.Partition()
      .v6()
      .save(
        { serviceName: this.serviceName },
        {
          partitionName: this.model.partitionName,
          size: this.model.size,
          protocol: this.model.protocol,
        }
      )
      .$promise.then(() => {
        this.Alerter.success(
          this.$translate.instant('nasha_partition_add_success'),
          'nasha_alerts'
        );
        this.$state.go('nasha.dashboard', { serviceName: this.serviceName });
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('nasha_partition_add_error', { message: error.data?.message }),
          'nasha_alerts'
        );
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
});
```

### React Migration (AFTER - PERFECT)

```typescript
// packages/manager/apps/bmc-nasha/src/pages/Partitions/modals/AddPartitionModal.tsx

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsModal, OdsButton, OdsFormField, OdsInput, OdsSelect } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/muk';
import { useCreatePartition } from '@/data/api/hooks/useCreatePartition';

// ✅ PARITY: Same validation rules as AngularJS form
const schema = z.object({
  partitionName: z.string().min(1, 'Partition name is required'),
  size: z.number().min(10, 'Minimum size is 10 GB'),
  protocol: z.enum(['NFS', 'CIFS', 'NFS_CIFS']),
});

type FormData = z.infer<typeof schema>;

interface AddPartitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPartitionModal({ isOpen, onClose }: AddPartitionModalProps) {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('nasha');
  const { addSuccess, addError } = useNotifications();

  // ✅ PARITY: Same default values as $onInit model
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      partitionName: '',
      size: 10,
      protocol: 'NFS',
    },
  });

  // ✅ PARITY: Same API call as OvhApiDedicatedNasha.Partition().v6().save()
  const createPartition = useCreatePartition(serviceName!);

  const onSubmit = async (data: FormData) => {
    try {
      await createPartition.mutateAsync(data);
      // ✅ PARITY: Same success message as Alerter.success()
      addSuccess(t('nasha_partition_add_success'));
      onClose();
      // ✅ PARITY: Same navigation as $state.go('nasha.dashboard')
      navigate(`/nasha/${serviceName}`);
    } catch (error) {
      // ✅ PARITY: Same error message pattern as Alerter.error()
      addError(t('nasha_partition_add_error', { message: error.message }));
    }
  };

  return (
    <OdsModal isOpen={isOpen} onClose={onClose}>
      <OdsModal.Header>{t('nasha_partition_add_title')}</OdsModal.Header>
      <OdsModal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ✅ PARITY: Same form fields as AngularJS template */}
          <Controller
            name="partitionName"
            control={control}
            render={({ field }) => (
              <OdsFormField label={t('nasha_partition_name')} error={errors.partitionName?.message}>
                <OdsInput {...field} hasError={!!errors.partitionName} />
              </OdsFormField>
            )}
          />

          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <OdsFormField label={t('nasha_partition_size')} error={errors.size?.message}>
                <OdsInput type="number" {...field} hasError={!!errors.size} />
              </OdsFormField>
            )}
          />

          <Controller
            name="protocol"
            control={control}
            render={({ field }) => (
              <OdsFormField label={t('nasha_partition_protocol')}>
                <OdsSelect {...field}>
                  <option value="NFS">NFS</option>
                  <option value="CIFS">CIFS</option>
                  <option value="NFS_CIFS">NFS + CIFS</option>
                </OdsSelect>
              </OdsFormField>
            )}
          />
        </form>
      </OdsModal.Body>
      <OdsModal.Footer>
        <OdsButton variant="ghost" onClick={onClose}>
          {t('common_cancel')}
        </OdsButton>
        {/* ✅ PARITY: Same loading state as isSubmitting */}
        <OdsButton
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={createPartition.isPending}
          isDisabled={!isValid}
        >
          {t('common_confirm')}
        </OdsButton>
      </OdsModal.Footer>
    </OdsModal>
  );
}
```

```typescript
// packages/manager/apps/bmc-nasha/src/data/api/hooks/useCreatePartition.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

interface CreatePartitionPayload {
  partitionName: string;
  size: number;
  protocol: 'NFS' | 'CIFS' | 'NFS_CIFS';
}

// ✅ PARITY: Same API endpoint as OvhApiDedicatedNasha.Partition().v6().save()
export function useCreatePartition(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePartitionPayload) => {
      const { data } = await v6.post(`/dedicated/nasha/${serviceName}/partition`, payload);
      return data;
    },
    onSuccess: () => {
      // ✅ PARITY: Refresh partitions list (AngularJS did this via resolve on navigate)
      queryClient.invalidateQueries({ queryKey: ['nasha', serviceName, 'partitions'] });
    },
  });
}
```

### Parity Checklist for This Pattern

| Check | AngularJS | React | Status |
|-------|-----------|-------|--------|
| Default form values | `$onInit model` | `defaultValues` in useForm | ✅ |
| Form validation | Template-driven | Zod schema | ✅ |
| API endpoint | `.v6().save()` | `v6.post()` | ✅ |
| Success notification | `Alerter.success()` | `addSuccess()` | ✅ |
| Error notification | `Alerter.error()` | `addError()` | ✅ |
| Navigation after success | `$state.go()` | `navigate()` | ✅ |
| Loading state | `isSubmitting` | `isPending` | ✅ |
| Submit disabled state | Template binding | `isDisabled={!isValid}` | ✅ |

---

## Example 3: Datagrid with Actions

### AngularJS Source (BEFORE)

```html
<!-- packages/manager/modules/nasha/src/partitions/partitions.html -->

<oui-datagrid
  rows="$ctrl.partitions"
  page-size="25"
  on-page-change="$ctrl.onPageChange(page)"
>
  <oui-column
    property="partitionName"
    title="{{:: 'nasha_partition_name' | translate }}"
    sortable
  ></oui-column>

  <oui-column
    property="size"
    title="{{:: 'nasha_partition_size' | translate }}"
    sortable
  >
    <span data-ng-bind="$row.size | bytes"></span>
  </oui-column>

  <oui-column
    property="protocol"
    title="{{:: 'nasha_partition_protocol' | translate }}"
  ></oui-column>

  <oui-action-menu data-align="end">
    <oui-action-menu-item
      data-text="{{:: 'nasha_partition_edit' | translate }}"
      data-on-click="$ctrl.editPartition($row)"
    ></oui-action-menu-item>
    <oui-action-menu-item
      data-text="{{:: 'nasha_partition_delete' | translate }}"
      data-on-click="$ctrl.deletePartition($row)"
    ></oui-action-menu-item>
  </oui-action-menu>
</oui-datagrid>
```

### React Migration (AFTER - PERFECT)

```typescript
// packages/manager/apps/bmc-nasha/src/pages/Partitions/PartitionsList.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Datagrid, DatagridColumn, ActionMenu } from '@ovh-ux/muk';
import { useNashaPartitions } from '@/data/api/hooks/useNashaPartitions';
import { EditPartitionModal } from './modals/EditPartitionModal';
import { DeletePartitionModal } from './modals/DeletePartitionModal';
import { formatBytes } from '@/utils/formatBytes';

interface Partition {
  partitionName: string;
  size: number;
  protocol: string;
}

export function PartitionsList({ serviceName }: { serviceName: string }) {
  const { t } = useTranslation('nasha');
  const { data: partitions, isLoading } = useNashaPartitions(serviceName);

  // ✅ PARITY: Modal state for edit/delete actions
  const [editingPartition, setEditingPartition] = useState<Partition | null>(null);
  const [deletingPartition, setDeletingPartition] = useState<Partition | null>(null);

  // ✅ PARITY: Same columns as oui-column elements
  const columns: DatagridColumn<Partition>[] = [
    {
      id: 'partitionName',
      label: t('nasha_partition_name'),
      cell: (row) => row.partitionName,
      isSortable: true, // ✅ PARITY: sortable attribute
    },
    {
      id: 'size',
      label: t('nasha_partition_size'),
      // ✅ PARITY: Same formatting as | bytes filter
      cell: (row) => formatBytes(row.size),
      isSortable: true,
    },
    {
      id: 'protocol',
      label: t('nasha_partition_protocol'),
      cell: (row) => row.protocol,
    },
    {
      id: 'actions',
      label: '',
      // ✅ PARITY: Same actions as oui-action-menu
      cell: (row) => (
        <ActionMenu>
          <ActionMenu.Item onClick={() => setEditingPartition(row)}>
            {t('nasha_partition_edit')}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => setDeletingPartition(row)}>
            {t('nasha_partition_delete')}
          </ActionMenu.Item>
        </ActionMenu>
      ),
    },
  ];

  return (
    <>
      {/* ✅ PARITY: Same pageSize as page-size="25" */}
      <Datagrid
        data={partitions || []}
        columns={columns}
        isLoading={isLoading}
        pageSize={25}
      />

      {/* ✅ PARITY: Same edit action as $ctrl.editPartition($row) */}
      {editingPartition && (
        <EditPartitionModal
          partition={editingPartition}
          serviceName={serviceName}
          isOpen={!!editingPartition}
          onClose={() => setEditingPartition(null)}
        />
      )}

      {/* ✅ PARITY: Same delete action as $ctrl.deletePartition($row) */}
      {deletingPartition && (
        <DeletePartitionModal
          partition={deletingPartition}
          serviceName={serviceName}
          isOpen={!!deletingPartition}
          onClose={() => setDeletingPartition(null)}
        />
      )}
    </>
  );
}
```

### Parity Checklist for This Pattern

| Check | AngularJS | React | Status |
|-------|-----------|-------|--------|
| Column count | 4 columns | 4 columns | ✅ |
| Column properties | partitionName, size, protocol | Same | ✅ |
| Sortable columns | 2 sortable | 2 sortable | ✅ |
| Value formatting | `\| bytes` filter | `formatBytes()` | ✅ |
| Page size | 25 | 25 | ✅ |
| Action menu | 2 actions (edit, delete) | 2 actions | ✅ |
| Action handlers | `$ctrl.editPartition()` | `setEditingPartition()` | ✅ |

---

## VIOLATIONS to Avoid

### Violation 1: Missing Loading State

```typescript
// ❌ WRONG: No loading state (AngularJS resolve blocks render until data ready)
export function DashboardPage() {
  const { data } = useNashaDetail(serviceName);
  return <Dashboard nasha={data} />; // Crashes if data is undefined
}

// ✅ CORRECT: Explicit loading state
export function DashboardPage() {
  const { data, isLoading } = useNashaDetail(serviceName);
  if (isLoading) return <Loading />;
  return <Dashboard nasha={data} />;
}
```

### Violation 2: Wrong API Pattern

```typescript
// ❌ WRONG: Using v6 when AngularJS used AAPI
const { data } = await v6.get(`/dedicated/nasha/${serviceName}`);
// This returns different data structure than AAPI!

// ✅ CORRECT: Match the API pattern
const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
```

### Violation 3: Missing Data Transformation

```typescript
// ❌ WRONG: Raw data without transformation
export function useNashaDetail(serviceName: string) {
  return useQuery({
    queryKey: ['nasha', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return data; // Missing prepareNasha transformation!
    },
  });
}

// ✅ CORRECT: Apply same transformation as AngularJS
export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();
  return useQuery({
    queryKey: ['nasha', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return prepareNasha(data); // Same as .then(prepareNasha)
    },
  });
}
```

### Violation 4: Missing Notification

```typescript
// ❌ WRONG: No success notification
const onSubmit = async (data) => {
  await createPartition.mutateAsync(data);
  onClose(); // User doesn't know if it worked!
};

// ✅ CORRECT: Match AngularJS Alerter behavior
const onSubmit = async (data) => {
  await createPartition.mutateAsync(data);
  addSuccess(t('nasha_partition_add_success'));
  onClose();
};
```

### Violation 5: Missing Query Invalidation

```typescript
// ❌ WRONG: List doesn't update after create
export function useCreatePartition(serviceName: string) {
  return useMutation({
    mutationFn: async (payload) => {
      return v6.post(`/dedicated/nasha/${serviceName}/partition`, payload);
    },
    // Missing onSuccess! List won't refresh.
  });
}

// ✅ CORRECT: Invalidate queries to refresh list
export function useCreatePartition(serviceName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      return v6.post(`/dedicated/nasha/${serviceName}/partition`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha', serviceName, 'partitions'] });
    },
  });
}
```

### Violation 6: Wrong Navigation Pattern

```typescript
// ❌ WRONG: Using wrong navigation
window.location.href = '/nasha/' + serviceName; // Full page reload!

// ✅ CORRECT: Client-side navigation (same as $state.go)
navigate(`/nasha/${serviceName}`);
```

### Violation 7: Missing Translation Key

```typescript
// ❌ WRONG: Hardcoded string
<OdsButton>Create Partition</OdsButton>

// ✅ CORRECT: Use translation key (same as | translate)
<OdsButton>{t('nasha_partition_add_button')}</OdsButton>
```

### Violation 8: Different Page Size

```typescript
// ❌ WRONG: Different page size than AngularJS
<Datagrid pageSize={10} /> // AngularJS had page-size="25"

// ✅ CORRECT: Same page size
<Datagrid pageSize={25} />
```

---

## Summary: Perfect Parity Checklist

For EVERY feature migrated, verify:

### Routes
- [ ] Same URL pattern
- [ ] Same URL parameters extracted
- [ ] Same navigation behavior

### API Calls
- [ ] Same endpoint (v6 vs AAPI vs Iceberg)
- [ ] Same request parameters
- [ ] Same data transformation applied

### Components
- [ ] Same number of columns in tables
- [ ] Same sortable columns
- [ ] Same page sizes
- [ ] Same action buttons/menus

### Forms
- [ ] Same default values
- [ ] Same validation rules
- [ ] Same error messages

### User Feedback
- [ ] Same success notifications
- [ ] Same error notifications
- [ ] Same loading states

### Navigation
- [ ] Same post-action navigation
- [ ] Same breadcrumb structure
