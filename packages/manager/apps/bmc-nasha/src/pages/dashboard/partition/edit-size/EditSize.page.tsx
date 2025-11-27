import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { SIZE_MIN } from '@/constants/Nasha.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionAllocatedSize } from '@/hooks/dashboard/usePartitionAllocatedSize';
import { useEditSizeForm } from '@/hooks/partitions/useEditSizeForm';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';

export default function EditSizePage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: partition, isLoading: isPartitionLoading } = usePartitionDetail(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: nasha } = useNashaDetail(serviceName ?? '');
  const { data: partitionAllocatedSize } = usePartitionAllocatedSize(serviceName ?? '');

  // Calculate boundaries
  const boundaries = useMemo(() => {
    if (!nasha || partitionAllocatedSize === undefined || !partition) {
      return { min: SIZE_MIN, max: SIZE_MIN };
    }

    const currentPartitionSize = partition.size;
    const totalAllocated = partitionAllocatedSize;
    const availableSize = nasha.zpoolSize - (totalAllocated - currentPartitionSize);
    const minSize = SIZE_MIN;
    const maxSize = Math.floor(availableSize / (1024 * 1024 * 1024)); // Convert bytes to GB

    return { min: minSize, max: maxSize };
  }, [nasha, partitionAllocatedSize, partition]);

  const initialSize = useMemo(() => {
    if (!partition) return 0;
    return Math.floor(partition.size / (1024 * 1024 * 1024)); // Convert bytes to GB
  }, [partition]);

  const { form, handleSubmit, isSubmitting, isDirty } = useEditSizeForm({
    serviceName,
    partitionName,
    initialSize,
    boundaries,
    onSuccess: () => {
      void navigate('..', {
        replace: true,
        state: { success: t('partition:edit_size.success', 'Size updated successfully') },
      });
    },
  });

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size', 'cancel'],
    });
    // Navigate back to partition detail using relative path
    void navigate('..', { replace: true });
  };

  const onSubmit = async () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size', 'confirm'],
    });

    try {
      await handleSubmit();
    } catch {
      // Error handled by form
    }
  };

  if (isPartitionLoading || !partition || !nasha) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout
      header={{
        title: t('partition:edit_size.title', 'Edit size'),
      }}
    >
      <div className="mb-4 text-sm text-gray-600">{partitionName}</div>
      <form onSubmit={void handleSubmit} className="max-w-2xl">
        <FormField>
          <FormFieldLabel>
            {t('partition:edit_size.label', `Size for ${partitionName}`, {
              name: partitionName,
            })}
          </FormFieldLabel>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              {...form.register('size', { valueAsNumber: true })}
              min={boundaries.min}
              max={boundaries.max}
              step={1}
              disabled={isSubmitting}
              className="w-32"
            />
            <span className="text-gray-600">GB</span>
          </div>
          <FormFieldHelper>
            {t(
              'partition:edit_size.helper',
              `Size must be between ${boundaries.min} GB and ${boundaries.max} GB`,
              {
                min: boundaries.min,
                max: boundaries.max,
              },
            )}
          </FormFieldHelper>
          {form.formState.errors.size && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.size.message}
            </FormFieldHelper>
          )}
        </FormField>

        <div className="mt-6 flex gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !isDirty || !form.formState.isValid}
            loading={isSubmitting}
            onClick={void onSubmit}
          >
            {t('partition:edit_size.confirm', 'Confirm')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partition:edit_size.cancel', 'Cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
