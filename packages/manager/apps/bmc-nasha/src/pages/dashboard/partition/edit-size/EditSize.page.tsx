import { useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, FormField, Input, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { SIZE_MIN } from '@/constants/nasha.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionAllocatedSize } from '@/hooks/dashboard/usePartitionAllocatedSize';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';
import { APP_NAME } from '@/Tracking.constants';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

export default function EditSizePage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: partition, isLoading: isPartitionLoading } = usePartitionDetail(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: nasha } = useNashaDetail(serviceName ?? '');
  const { data: partitionAllocatedSize } = usePartitionAllocatedSize(serviceName ?? '');

  const [size, setSize] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (partition) {
      // Convert bytes to GB
      const sizeInGB = Math.floor(partition.size / (1024 * 1024 * 1024));
      setSize(sizeInGB);
    }
  }, [partition]);

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size', 'cancel'],
    });
    // Navigate back to partition detail using relative path
    navigate('..', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !partitionName) return;

    const sizeInBytes = size * 1024 * 1024 * 1024; // Convert GB to bytes

    if (size < boundaries.min || size > boundaries.max) {
      setError(
        t('partition:edit_size.boundaries_error', {
          min: boundaries.min,
          max: boundaries.max,
        }),
      );
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size', 'confirm'],
    });

    setIsUpdating(true);
    setError(null);

    try {
      await httpV6.put(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
        {
          size: sizeInBytes,
        },
      );

      // Navigate back to partition detail with success using relative path
      navigate('..', {
        replace: true,
        state: { success: t('partition:edit_size.success', 'Size updated successfully') },
      });
    } catch (err) {
      setError((err as Error).message || t('partition:edit_size.error', 'An error occurred'));
      setIsUpdating(false);
    }
  };

  if (isPartitionLoading || !partition || !nasha) {
    return <div>Loading...</div>;
  }

  const hasError = size < boundaries.min || size > boundaries.max;

  return (
    <BaseLayout
      header={{
        title: t('partition:edit_size.title', 'Edit size'),
        description: partitionName,
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <FormField error={error || (hasError ? t('partition:edit_size.boundaries_error', { min: boundaries.min, max: boundaries.max }) : undefined)}>
          <FormField.Label>
            {t('partition:edit_size.label', { name: partitionName }, `Size for ${partitionName}`)}
          </FormField.Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={size}
              min={boundaries.min}
              max={boundaries.max}
              step={1}
              onChange={(e) => setSize(Number(e.target.value))}
              disabled={isUpdating}
              className="w-32"
            />
            <span className="text-gray-600">GB</span>
          </div>
          <FormField.Helper>
            {t('partition:edit_size.helper', {
              min: boundaries.min,
              max: boundaries.max,
            }, `Size must be between ${boundaries.min} GB and ${boundaries.max} GB`)}
          </FormField.Helper>
        </FormField>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={isUpdating || hasError || size === Math.floor(partition.size / (1024 * 1024 * 1024))}
            isLoading={isUpdating}
          >
            {t('partition:edit_size.confirm', 'Confirm')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isUpdating}>
            {t('partition:edit_size.cancel', 'Cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}

