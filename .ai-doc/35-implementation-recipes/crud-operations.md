# Recipe: CRUD Operations

> @ai-purpose: Complete implementation recipe for Create, Read, Update, Delete operations

## Overview

This recipe implements full CRUD functionality:
- List view with data table
- Create modal with form
- Edit modal with pre-filled form
- Delete confirmation modal
- Success/error notifications
- Query invalidation

## File Structure

```
src/
├── data/api/hooks/
│   ├── useResourceList.ts      # Read (list)
│   ├── useResourceDetail.ts    # Read (single)
│   ├── useCreateResource.ts    # Create
│   ├── useUpdateResource.ts    # Update
│   └── useDeleteResource.ts    # Delete
├── pages/Resources/
│   ├── ResourcesList.page.tsx  # List page
│   ├── ResourceDetail.page.tsx # Detail page
│   └── modals/
│       ├── CreateResourceModal.tsx
│       ├── EditResourceModal.tsx
│       └── DeleteResourceModal.tsx
└── types/
    └── resource.types.ts
```

## Step 1: Define Types

```typescript
// src/types/resource.types.ts

export interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourcePayload {
  name: string;
  description?: string;
}

export interface UpdateResourcePayload {
  name?: string;
  description?: string;
  status?: Resource['status'];
}
```

## Step 2: Create API Hooks

### Read List

```typescript
// src/data/api/hooks/useResourceList.ts

import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import type { Resource } from '@/types/resource.types';

export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...resourceKeys.lists(), filters] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
};

export function useResourceList() {
  return useQuery({
    queryKey: resourceKeys.lists(),
    queryFn: async () => {
      const { data: ids } = await v6.get<string[]>('/api/resources');
      const resources = await Promise.all(
        ids.map((id) => v6.get<Resource>(`/api/resources/${id}`).then((r) => r.data))
      );
      return resources;
    },
  });
}
```

### Read Single

```typescript
// src/data/api/hooks/useResourceDetail.ts

import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import type { Resource } from '@/types/resource.types';
import { resourceKeys } from './useResourceList';

export function useResourceDetail(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: async () => {
      const { data } = await v6.get<Resource>(`/api/resources/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
```

### Create

```typescript
// src/data/api/hooks/useCreateResource.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import type { CreateResourcePayload, Resource } from '@/types/resource.types';
import { resourceKeys } from './useResourceList';

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateResourcePayload) => {
      const { data } = await v6.post<Resource>('/api/resources', payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate list to trigger refetch
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}
```

### Update

```typescript
// src/data/api/hooks/useUpdateResource.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import type { UpdateResourcePayload, Resource } from '@/types/resource.types';
import { resourceKeys } from './useResourceList';

interface UpdateParams {
  id: string;
  payload: UpdateResourcePayload;
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateParams) => {
      const { data } = await v6.put<Resource>(`/api/resources/${id}`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) });
    },
  });
}
```

### Delete

```typescript
// src/data/api/hooks/useDeleteResource.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { resourceKeys } from './useResourceList';

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await v6.delete(`/api/resources/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      // Remove detail from cache
      queryClient.removeQueries({ queryKey: resourceKeys.detail(id) });
    },
  });
}
```

## Step 3: Create Form Schema

```typescript
// src/pages/Resources/schemas/resource.schema.ts

import { z } from 'zod';

export const createResourceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
});

export const updateResourceSchema = createResourceSchema.extend({
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export type CreateResourceFormData = z.infer<typeof createResourceSchema>;
export type UpdateResourceFormData = z.infer<typeof updateResourceSchema>;
```

## Step 4: Create Modal Components

### Create Modal

```typescript
// src/pages/Resources/modals/CreateResourceModal.tsx

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { OdsModal, OdsButton, OdsFormField, OdsInput, OdsTextarea } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/muk';
import { useCreateResource } from '@/data/api/hooks/useCreateResource';
import { createResourceSchema, CreateResourceFormData } from '../schemas/resource.schema';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateResourceModal({ isOpen, onClose }: CreateResourceModalProps) {
  const { t } = useTranslation('resources');
  const { addSuccess, addError } = useNotifications();
  const createResource = useCreateResource();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateResourceFormData>({
    mode: 'onTouched',
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateResourceFormData) => {
    try {
      await createResource.mutateAsync(data);
      addSuccess(t('resources_create_success'));
      reset();
      onClose();
    } catch (error) {
      addError(t('resources_create_error'), error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <OdsModal isOpen={isOpen} onClose={handleClose}>
      <OdsModal.Header>{t('resources_create_title')}</OdsModal.Header>
      <OdsModal.Body>
        <form id="create-resource-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField
                label={t('resources_field_name')}
                error={errors.name?.message}
              >
                <OdsInput
                  name={name}
                  value={value}
                  onOdsChange={(e) => onChange(e.detail.value)}
                  onOdsBlur={onBlur}
                  hasError={!!errors.name}
                />
              </OdsFormField>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField
                label={t('resources_field_description')}
                error={errors.description?.message}
              >
                <OdsTextarea
                  name={name}
                  value={value || ''}
                  onOdsChange={(e) => onChange(e.detail.value)}
                  onOdsBlur={onBlur}
                  hasError={!!errors.description}
                />
              </OdsFormField>
            )}
          />
        </form>
      </OdsModal.Body>
      <OdsModal.Footer>
        <OdsButton variant="ghost" onClick={handleClose}>
          {t('common_cancel')}
        </OdsButton>
        <OdsButton
          type="submit"
          form="create-resource-form"
          variant="primary"
          isLoading={createResource.isPending}
          isDisabled={!isValid || !isDirty}
        >
          {t('common_create')}
        </OdsButton>
      </OdsModal.Footer>
    </OdsModal>
  );
}
```

### Edit Modal

```typescript
// src/pages/Resources/modals/EditResourceModal.tsx

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { OdsModal, OdsButton, OdsFormField, OdsInput, OdsTextarea, OdsSelect } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/muk';
import { useUpdateResource } from '@/data/api/hooks/useUpdateResource';
import { updateResourceSchema, UpdateResourceFormData } from '../schemas/resource.schema';
import type { Resource } from '@/types/resource.types';

interface EditResourceModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export function EditResourceModal({ resource, isOpen, onClose }: EditResourceModalProps) {
  const { t } = useTranslation('resources');
  const { addSuccess, addError } = useNotifications();
  const updateResource = useUpdateResource();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateResourceFormData>({
    mode: 'onTouched',
    resolver: zodResolver(updateResourceSchema),
    defaultValues: {
      name: resource.name,
      description: resource.description,
      status: resource.status,
    },
  });

  // Reset form when resource changes
  useEffect(() => {
    reset({
      name: resource.name,
      description: resource.description,
      status: resource.status,
    });
  }, [resource, reset]);

  const onSubmit = async (data: UpdateResourceFormData) => {
    try {
      await updateResource.mutateAsync({
        id: resource.id,
        payload: data,
      });
      addSuccess(t('resources_update_success'));
      onClose();
    } catch (error) {
      addError(t('resources_update_error'), error);
    }
  };

  return (
    <OdsModal isOpen={isOpen} onClose={onClose}>
      <OdsModal.Header>{t('resources_edit_title')}</OdsModal.Header>
      <OdsModal.Body>
        <form id="edit-resource-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField
                label={t('resources_field_name')}
                error={errors.name?.message}
              >
                <OdsInput
                  name={name}
                  value={value}
                  onOdsChange={(e) => onChange(e.detail.value)}
                  onOdsBlur={onBlur}
                  hasError={!!errors.name}
                />
              </OdsFormField>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField
                label={t('resources_field_description')}
                error={errors.description?.message}
              >
                <OdsTextarea
                  name={name}
                  value={value || ''}
                  onOdsChange={(e) => onChange(e.detail.value)}
                  onOdsBlur={onBlur}
                  hasError={!!errors.description}
                />
              </OdsFormField>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <OdsFormField label={t('resources_field_status')}>
                <OdsSelect
                  value={value}
                  onOdsChange={(e) => onChange(e.detail.value)}
                >
                  <option value="active">{t('resources_status_active')}</option>
                  <option value="inactive">{t('resources_status_inactive')}</option>
                  <option value="pending">{t('resources_status_pending')}</option>
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
        <OdsButton
          type="submit"
          form="edit-resource-form"
          variant="primary"
          isLoading={updateResource.isPending}
          isDisabled={!isValid || !isDirty}
        >
          {t('common_save')}
        </OdsButton>
      </OdsModal.Footer>
    </OdsModal>
  );
}
```

### Delete Modal

```typescript
// src/pages/Resources/modals/DeleteResourceModal.tsx

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsModal, OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/muk';
import { useDeleteResource } from '@/data/api/hooks/useDeleteResource';
import type { Resource } from '@/types/resource.types';

interface DeleteResourceModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  navigateAfter?: string;
}

export function DeleteResourceModal({
  resource,
  isOpen,
  onClose,
  navigateAfter,
}: DeleteResourceModalProps) {
  const { t } = useTranslation('resources');
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const deleteResource = useDeleteResource();

  const handleDelete = async () => {
    try {
      await deleteResource.mutateAsync(resource.id);
      addSuccess(t('resources_delete_success', { name: resource.name }));
      onClose();
      if (navigateAfter) {
        navigate(navigateAfter);
      }
    } catch (error) {
      addError(t('resources_delete_error'), error);
    }
  };

  return (
    <OdsModal isOpen={isOpen} onClose={onClose}>
      <OdsModal.Header>{t('resources_delete_title')}</OdsModal.Header>
      <OdsModal.Body>
        <OdsMessage color="warning">
          {t('resources_delete_warning')}
        </OdsMessage>
        <p>
          {t('resources_delete_confirmation', { name: resource.name })}
        </p>
      </OdsModal.Body>
      <OdsModal.Footer>
        <OdsButton variant="ghost" onClick={onClose}>
          {t('common_cancel')}
        </OdsButton>
        <OdsButton
          variant="primary"
          color="critical"
          onClick={handleDelete}
          isLoading={deleteResource.isPending}
        >
          {t('common_delete')}
        </OdsButton>
      </OdsModal.Footer>
    </OdsModal>
  );
}
```

## Step 5: Create List Page

```typescript
// src/pages/Resources/ResourcesList.page.tsx

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Datagrid, DatagridColumn, ActionMenu, Loading, ErrorBanner } from '@ovh-ux/muk';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useResourceList } from '@/data/api/hooks/useResourceList';
import { CreateResourceModal } from './modals/CreateResourceModal';
import { EditResourceModal } from './modals/EditResourceModal';
import { DeleteResourceModal } from './modals/DeleteResourceModal';
import { StatusBadge } from '@/components/StatusBadge';
import type { Resource } from '@/types/resource.types';

export function ResourcesListPage() {
  const { t } = useTranslation('resources');
  const { data: resources, isLoading, error } = useResourceList();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);

  const columns = useMemo<DatagridColumn<Resource>[]>(() => [
    {
      id: 'name',
      label: t('resources_column_name'),
      cell: (row) => row.name,
    },
    {
      id: 'status',
      label: t('resources_column_status'),
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      label: '',
      cell: (row) => (
        <ActionMenu>
          <ActionMenu.Item onClick={() => setEditingResource(row)}>
            {t('common_edit')}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => setDeletingResource(row)}>
            {t('common_delete')}
          </ActionMenu.Item>
        </ActionMenu>
      ),
    },
  ], [t]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorBanner error={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>{t('resources_title')}</h1>
        <OdsButton onClick={() => setIsCreateOpen(true)}>
          {t('resources_create_button')}
        </OdsButton>
      </div>

      <Datagrid data={resources || []} columns={columns} />

      {/* Create Modal */}
      <CreateResourceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Edit Modal */}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
        />
      )}

      {/* Delete Modal */}
      {deletingResource && (
        <DeleteResourceModal
          resource={deletingResource}
          isOpen={!!deletingResource}
          onClose={() => setDeletingResource(null)}
        />
      )}
    </div>
  );
}
```

## Verification Checklist

### Create
- [ ] Form validation works
- [ ] Submit disabled until form is valid
- [ ] Loading state on submit button
- [ ] Success notification shown
- [ ] Error notification on failure
- [ ] Modal closes on success
- [ ] List refreshes automatically

### Read
- [ ] List loads with loading state
- [ ] Error shown on failure
- [ ] Data displays correctly

### Update
- [ ] Form pre-filled with current values
- [ ] Dirty check (submit disabled if no changes)
- [ ] Loading state on submit
- [ ] Success notification
- [ ] Error notification on failure
- [ ] List refreshes automatically

### Delete
- [ ] Confirmation shown before delete
- [ ] Warning message displayed
- [ ] Loading state on delete button
- [ ] Success notification
- [ ] Error notification on failure
- [ ] Navigates away (if on detail page)
- [ ] List refreshes automatically
