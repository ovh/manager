---
title: MUK Modals Implementation Guide
last_update: 2025-01-27
tags: [modals, muk, react, routing, best-practices, ovhcloud, manager]
ai: true
---

# MUK Modals Implementation Guide

## 🧭 Purpose

This guide explains how to implement modals in React applications using MUK (Manager UI Kit) components. It covers when to use route-based modals vs. integrated modals, and provides complete examples for both approaches.

## ⚙️ Context

MUK provides two main modal components:
- **`Modal`**: Generic modal for custom content
- **`UpdateNameModal`**: Specialized modal for editing resource names

There are two implementation patterns:
1. **Route-based modals** (recommended for most cases)
2. **Integrated modals** (for simple, quick actions)

## 📘 Pattern: Route-Based Modals Only

**All modals MUST be route-based** to enable:
- Shareable URLs
- Browser navigation (back/forward)
- Deep linking
- Better separation of concerns
- Easier testing

There is no "integrated modal" pattern - all modals should have dedicated routes.

## 🎯 Implementation: Route-Based Modal

**Use when:**
- Modal needs shareable URL
- Browser navigation should work
- Deep linking required
- Better separation of concerns
- Easier testing

### Structure

```
src/
  pages/
    dashboard/
      edit-name/
        EditName.page.tsx  ← Modal as a page
```

### Example: UpdateNameModal as Route

```tsx
// src/pages/dashboard/edit-name/EditName.page.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { UpdateNameModal } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';

const NAME_PATTERN = /^[^<>]+$/;
const PREFIX_TRACKING_EDIT_NAME = 'dashboard::edit-name';

export default function EditNamePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'edit-name']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: nasha, isLoading } = useNashaDetail(serviceName ?? '');
  const [customName, setCustomName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nasha) {
      setCustomName(nasha.customName || '');
    }
  }, [nasha]);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_EDIT_NAME, 'cancel'],
    });
    navigate(`../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`);
  };

  const handleUpdateName = async (newName: string) => {
    if (!serviceName || !nasha) return;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_EDIT_NAME, 'confirm'],
    });

    setIsUpdating(true);
    setError(null);

    try {
      await httpV6.put(`${APP_FEATURES.listingEndpoint}/${serviceName}`, {
        customName: newName.trim(),
      });

      // Navigate back with success
      navigate(`../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`, {
        state: { success: t('edit-name:success', 'Name updated successfully') },
      });
    } catch (err) {
      setError((err as Error).message || t('edit-name:error', 'An error occurred'));
      setIsUpdating(false);
    }
  };

  if (isLoading || !nasha) {
    return <div>Loading...</div>;
  }

  return (
    <UpdateNameModal
      isOpen={true}  // Always open since this IS the page
      headline={t('edit-name:title', { name: nasha.serviceName }, `Edit name for ${nasha.serviceName}`)}
      description={t('edit-name:description', 'Update the display name for this service')}
      inputLabel={t('edit-name:label', { name: nasha.serviceName }, `Name for ${nasha.serviceName}`)}
      defaultValue={customName}
      isLoading={isUpdating}
      onClose={handleClose}
      updateDisplayName={handleUpdateName}
      error={error}
      pattern={NAME_PATTERN.source}
      patternMessage={t('edit-name:rules', 'Only alphanumeric characters, hyphens and underscores are allowed')}
      cancelButtonLabel={t('edit-name:cancel', 'Cancel')}
      confirmButtonLabel={t('edit-name:confirm', 'Confirm')}
    />
  );
}
```

### Route Configuration

```tsx
// src/routes/Routes.tsx
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';

const EditNamePage = React.lazy(() => import('@/pages/dashboard/edit-name/EditName.page'));

export default (
  <Route
    path={urls.dashboard}
    Component={DashboardPage}
  >
    {/* Edit name route */}
    <Route
      path="edit-name"
      Component={EditNamePage}
      handle={{
        tracking: {
          pageName: 'edit-name',
          pageType: PageType.dashboard,
        },
      }}
    />
  </Route>
);
```

### Navigation to Modal

```tsx
// In parent component (e.g., Dashboard.page.tsx)
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/Routes.constants';

function DashboardPage() {
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const handleEditName = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'edit-name'],
    });
    // Navigate to edit-name route
    navigate(urls.dashboardEditName.replace(':serviceName', serviceName ?? ''));
  };

  return (
    <button onClick={handleEditName}>Edit Name</button>
  );
}
```

### Example: Generic Modal as Route

```tsx
// src/pages/dashboard/partitions/delete/DeletePartition.page.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BaseLayout, Modal, MODAL_COLOR } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useDeletePartition } from '@/hooks/partitions/useDeletePartition';
import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';

export default function DeletePartitionPage() {
  const { serviceName, partitionName } = useParams();
  const { t } = useTranslation(['partitions']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const deletePartitionMutation = useDeletePartition();

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'delete', 'cancel'],
    });
    navigate(`../${urls.partitions.replace(':serviceName', serviceName ?? '')}`);
  };

  const handleConfirm = async () => {
    if (!serviceName || !partitionName) return;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'delete', 'confirm'],
    });

    try {
      await deletePartitionMutation.mutateAsync({
        serviceName,
        partitionName,
      });
      navigate('..');
    } catch (error) {
      // Error handled by mutation hook
      // Keep modal open on error
    }
  };

  return (
    <BaseLayout>
      <Modal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        type={MODAL_COLOR.critical}
        heading={t('partitions:delete.title')}
        primaryButton={{
          label: t('partitions:delete.submit'),
          onClick: handleConfirm,
          loading: deletePartitionMutation.isPending,
          testId: 'delete-partition-confirm',
        }}
        secondaryButton={{
          label: t('partitions:delete.cancel'),
          onClick: handleClose,
          testId: 'delete-partition-cancel',
        }}
      >
        <p>{t('partitions:delete.content', { partitionName })}</p>
      </Modal>
    </BaseLayout>
  );
}
```


## 📋 MUK Modal Components

### UpdateNameModal Props

```typescript
interface UpdateNameModalProps {
  isOpen: boolean;                    // Control modal visibility
  headline: string;                   // Modal title
  description?: string;                // Optional description
  inputLabel: string;                 // Input field label
  defaultValue?: string;              // Initial value
  isLoading?: boolean;                // Loading state
  onClose: () => void;                // Close handler
  updateDisplayName: (newName: string) => void;  // Submit handler (receives new name)
  error?: string | null;              // Error message (string, not Error object)
  pattern?: string;                   // Validation regex pattern
  patternMessage?: string;            // Pattern validation message
  cancelButtonLabel?: string;         // Cancel button text
  confirmButtonLabel?: string;        // Confirm button text
}
```

**Important:** `updateDisplayName` is called when user clicks confirm. It receives the new name as a parameter. Handle the API call inside this function.

### Modal Props (Generic)

```typescript
interface ModalProps {
  open: boolean;                       // Control modal visibility
  onOpenChange: (open: boolean) => void;  // Called when modal state changes
  heading?: string;                    // Modal title
  type?: MODAL_COLOR;                  // Modal color (information, critical, etc.)
  primaryButton?: {                    // Primary action button
    label: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    testId?: string;
  };
  secondaryButton?: {                  // Secondary action button
    label: string;
    onClick: () => void;
    testId?: string;
  };
  children: React.ReactNode;           // Modal content
}
```

## ✅ Best Practices

### 1. Error Handling

```tsx
// ✅ Good: Convert Error to string
const [error, setError] = useState<string | null>(null);

try {
  await updateName(newName);
} catch (err) {
  setError((err as Error).message || t('error', 'An error occurred'));
}

// ❌ Bad: Storing Error object
const [error, setError] = useState<Error | null>(null);
```

### 2. Loading States

```tsx
// ✅ Good: Disable inputs and show loading
<UpdateNameModal
  isLoading={isUpdating}
  // ... other props
/>

// ✅ Good: Show loading on button
<Modal
  primaryButton={{
    label: t('confirm'),
    onClick: handleConfirm,
    loading: mutation.isPending,
  }}
/>
```

### 3. Navigation

```tsx
// ✅ Good: Use navigate() for route-based modals
const handleClose = () => {
  navigate(`../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`);
};

// ✅ Good: Use onClose callback for integrated modals
const handleClose = () => {
  setIsModalOpen(false);
};
```

### 4. Data Refresh

```tsx
// ✅ Good: Refresh data after successful update
const handleUpdateName = async (newName: string) => {
  try {
    await httpV6.put(endpoint, { customName: newName });
    await refetchNasha();  // Refresh parent data
    onClose();
  } catch (err) {
    // Handle error, keep modal open
  }
};
```

### 5. Tracking

```tsx
// ✅ Good: Track all modal actions
const handleClose = () => {
  trackClick({
    location: PageLocation.page,
    buttonType: ButtonType.button,
    actionType: 'action',
    actions: [APP_NAME, 'modal-name', 'cancel'],
  });
  onClose();
};
```

## 🚨 Common Mistakes

### ❌ Mistake 1: Wrong Error Type

```tsx
// ❌ Bad: UpdateNameModal expects string | null, not Error
const [error, setError] = useState<Error | null>(null);
setError(err as Error);

// ✅ Good: Convert to string
const [error, setError] = useState<string | null>(null);
setError((err as Error).message || 'An error occurred');
```

### ❌ Mistake 2: Async onSuccess Handler

```tsx
// ❌ Bad: onSuccess expects void, not Promise
<EditNameModal
  onSuccess={async () => {
    await refetchNasha();
  }}
/>

// ✅ Good: Handle async inside or use void
<EditNameModal
  onSuccess={() => {
    void refetchNasha();
  }}
/>
```

### ❌ Mistake 3: Not Resetting State

```tsx
// ❌ Bad: State persists when modal closes
useEffect(() => {
  setCustomName(currentName);
}, [currentName]);

// ✅ Good: Reset when modal opens/closes
useEffect(() => {
  if (isOpen) {
    setCustomName(currentName || '');
    setError(null);
  }
}, [isOpen, currentName]);
```

### ❌ Mistake 4: Using window.location.href

```tsx
// ❌ Bad: Causes full page reload
const handleEdit = () => {
  window.location.href = editUrl;
};

// ✅ Good: Use React Router navigation
const handleEdit = () => {
  navigate(urls.editName.replace(':serviceName', serviceName));
};
```

## 📚 Complete Examples

### Example 1: Route-Based UpdateNameModal

See: `packages/manager/apps/web-office/src/pages/dashboard/general-information/update-display-name/UpdateDisplayName.modal.tsx`

### Example 2: Route-Based Generic Modal

See: `packages/manager/apps/bmc-nasha/src/pages/dashboard/partitions/delete/DeletePartition.page.tsx`


## 🔗 References

- [MUK Components Documentation](../20-dependencies/muk.md)
- [Navigation Links Guide](./navigation-links-guide.md)
- [Routing Best Practices](./routing-best-practices.md)

## ⚖️ The Modals Moral

- **Route-based modals** = Better UX, shareable URLs, browser navigation
- **Integrated modals** = Simpler for quick actions, no URL needed
- **Always use `navigate()`** instead of `window.location.href`
- **Convert errors to strings** for MUK components
- **Track all modal interactions** for analytics

**👉 Good modals are invisible to users but essential for application workflows.**

