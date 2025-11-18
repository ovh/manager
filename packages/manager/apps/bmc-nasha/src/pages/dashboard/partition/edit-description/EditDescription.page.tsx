import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, FormField, Input, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';
import { APP_NAME } from '@/Tracking.constants';

const DESCRIPTION_MAX = 50;

export default function EditDescriptionPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: partition, isLoading } = usePartitionDetail(serviceName ?? '', partitionName ?? '');
  const [description, setDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (partition) {
      setDescription(partition.partitionDescription || '');
    }
  }, [partition]);

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'cancel'],
    });
    // Navigate back to partition detail using relative path
    navigate('..', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !partitionName) return;

    if (description.length > DESCRIPTION_MAX) {
      setError(t('partition:edit_description.max_length', `Maximum ${DESCRIPTION_MAX} characters`));
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'confirm'],
    });

    setIsUpdating(true);
    setError(null);

    try {
      await httpV6.put(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
        {
          partitionDescription: description.trim(),
        },
      );

      // Navigate back to partition detail with success using relative path
      navigate('..', {
        replace: true,
        state: { success: t('partition:edit_description.success', 'Description updated successfully') },
      });
    } catch (err) {
      setError((err as Error).message || t('partition:edit_description.error', 'An error occurred'));
      setIsUpdating(false);
    }
  };

  if (isLoading || !partition) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout
      header={{
        title: t('partition:edit_description.title', 'Edit description'),
        description: partitionName,
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <FormField error={error || undefined}>
          <FormField.Label>
            {t('partition:edit_description.label', 'Description')}
          </FormField.Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={DESCRIPTION_MAX}
            disabled={isUpdating}
            required
          />
          <FormField.Helper>
            {t('partition:edit_description.helper', `Maximum ${DESCRIPTION_MAX} characters`)}
          </FormField.Helper>
        </FormField>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={isUpdating || description === partition.partitionDescription}
            isLoading={isUpdating}
          >
            {t('partition:edit_description.confirm', 'Confirm')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isUpdating}>
            {t('partition:edit_description.cancel', 'Cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}



