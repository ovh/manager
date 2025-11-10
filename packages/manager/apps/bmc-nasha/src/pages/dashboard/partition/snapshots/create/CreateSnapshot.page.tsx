import { useState, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, FormField, Input, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { useCreateSnapshot } from '@/hooks/partitions/useCreateSnapshot';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';
import { usePartitionCustomSnapshots } from '@/hooks/partitions/usePartitionSnapshots';
import { APP_NAME } from '@/Tracking.constants';

const CUSTOM_SNAPSHOT_NAME_PATTERN = /^[a-zA-Z0-9.:-]+$/;
const CUSTOM_SNAPSHOT_NAME_PREFIX = 'snap';
const CUSTOM_SNAPSHOT_NAME_SEPARATOR = '-';
const MAX_CUSTOM_SNAPSHOT = 10;

export default function CreateSnapshotPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const createSnapshotMutation = useCreateSnapshot();

  // Fetch data
  const { data: partition } = usePartitionDetail(serviceName ?? '', partitionName ?? '');
  const { data: customSnapshots } = usePartitionCustomSnapshots(serviceName ?? '', partitionName ?? '');

  // Generate default snapshot name
  const defaultSnapshotName = useMemo(() => {
    if (!partitionName) return '';
    const timestamp = new Date().toISOString();
    return `${partitionName}${CUSTOM_SNAPSHOT_NAME_SEPARATOR}${timestamp}`;
  }, [partitionName]);

  const [snapshotName, setSnapshotName] = useState(defaultSnapshotName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canCreateSnapshot = (customSnapshots?.length || 0) < MAX_CUSTOM_SNAPSHOT;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!snapshotName.trim()) {
      newErrors.snapshotName = t('partition:snapshots.create.errors.name_required');
    } else if (!CUSTOM_SNAPSHOT_NAME_PATTERN.test(snapshotName.trim())) {
      newErrors.snapshotName = t('partition:snapshots.create.errors.name_invalid');
    }

    if (!canCreateSnapshot) {
      newErrors.submit = t('partition:snapshots.create.errors.max_reached', {
        max: MAX_CUSTOM_SNAPSHOT,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create', 'cancel'],
    });
    // Navigate back to snapshots list using relative path
    navigate('..', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !serviceName || !partitionName) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create', 'confirm'],
    });

    setIsSubmitting(true);
    setErrors({});

    try {
      // Build full snapshot name with prefix
      const fullSnapshotName = [
        CUSTOM_SNAPSHOT_NAME_PREFIX,
        snapshotName.trim(),
      ].join(CUSTOM_SNAPSHOT_NAME_SEPARATOR);

      const result = await createSnapshotMutation.mutateAsync({
        serviceName,
        partitionName,
        name: fullSnapshotName,
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercCustomSnapAdd',
            params: { partitionName, customSnapshotName: fullSnapshotName },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        // If no task, just go back to snapshots list
        navigate('..');
      }
    } catch (err) {
      setErrors({
        submit: (err as Error).message || t('partition:snapshots.create.errors.submit_failed'),
      });
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('partition:snapshots.create.title', 'Create a snapshot'),
        description: t('partition:snapshots.create.description', 'Create a custom snapshot for this partition'),
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {t('partition:snapshots.create.prefix_info', {
              prefix: CUSTOM_SNAPSHOT_NAME_PREFIX,
              separator: CUSTOM_SNAPSHOT_NAME_SEPARATOR,
            })}
          </p>
          <p className="text-sm text-gray-600">
            {t('partition:snapshots.create.count_info', {
              current: customSnapshots?.length || 0,
              max: MAX_CUSTOM_SNAPSHOT,
            })}
          </p>
        </div>

        <FormField
          label={t('partition:snapshots.create.name_label', 'Snapshot name')}
          error={errors.snapshotName}
          required
          helper={t('partition:snapshots.create.name_helper', 'Only alphanumeric characters, dots, colons and hyphens are allowed')}
        >
          <Input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            disabled={isSubmitting || !canCreateSnapshot}
            placeholder={defaultSnapshotName}
          />
        </FormField>

        {errors.submit && (
          <div className="text-critical">{errors.submit}</div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {t('partition:snapshots.create.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !snapshotName.trim() || !canCreateSnapshot}
            loading={isSubmitting}
          >
            {t('partition:snapshots.create.submit', 'Create snapshot')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}

