import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import {
  CUSTOM_SNAPSHOT_NAME_PREFIX,
  CUSTOM_SNAPSHOT_NAME_SEPARATOR,
  MAX_CUSTOM_SNAPSHOT,
  useCreateSnapshotForm,
} from '@/hooks/partitions/useCreateSnapshotForm';
import { usePartitionCustomSnapshots } from '@/hooks/partitions/usePartitionSnapshots';

export default function CreateSnapshotPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: customSnapshots } = usePartitionCustomSnapshots(
    serviceName ?? '',
    partitionName ?? '',
  );

  // Generate default snapshot name
  const defaultSnapshotName = useMemo(() => {
    if (!partitionName) return '';
    const timestamp = new Date().toISOString();
    return `${partitionName}${CUSTOM_SNAPSHOT_NAME_SEPARATOR}${timestamp}`;
  }, [partitionName]);

  const { form, handleSubmit, isSubmitting, canCreateSnapshot } = useCreateSnapshotForm({
    serviceName,
    partitionName,
    currentSnapshotCount: customSnapshots?.length || 0,
    defaultName: defaultSnapshotName,
    onSuccess: (taskId) => {
      if (taskId) {
        const fullSnapshotName = [
          CUSTOM_SNAPSHOT_NAME_PREFIX,
          form.getValues('snapshotName').trim(),
        ].join(CUSTOM_SNAPSHOT_NAME_SEPARATOR);

        void navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercCustomSnapAdd',
            params: { partitionName, customSnapshotName: fullSnapshotName },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        void navigate('..');
      }
    },
  });

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create', 'cancel'],
    });
    // Navigate back to snapshots list using relative path
    void navigate('..', { replace: true });
  };

  const onSubmit = async () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create', 'confirm'],
    });

    try {
      await handleSubmit();
    } catch {
      // Error handled by form
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('partition:snapshots.create.title', 'Create a snapshot'),
      }}
    >
      <div className="mb-4 text-sm text-gray-600">
        {t('partition:snapshots.create.description', 'Create a custom snapshot for this partition')}
      </div>
      <form onSubmit={void handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600">
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

        <FormField>
          <FormFieldLabel>
            {t('partition:snapshots.create.name_label', 'Snapshot name')} *
          </FormFieldLabel>
          <Input
            type="text"
            {...form.register('snapshotName')}
            disabled={isSubmitting || !canCreateSnapshot}
            placeholder={defaultSnapshotName}
          />
          {form.formState.errors.snapshotName && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.snapshotName.message}
            </FormFieldHelper>
          )}
        </FormField>

        {form.formState.errors.root && (
          <div className="text-critical">{form.formState.errors.root.message}</div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partition:snapshots.create.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !form.formState.isValid || !canCreateSnapshot}
            loading={isSubmitting}
            onClick={void onSubmit}
          >
            {t('partition:snapshots.create.submit', 'Create snapshot')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
