import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, MODAL_COLOR, Modal } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useDeleteSnapshot } from '@/hooks/partitions/useDeleteSnapshot';

export default function DeleteSnapshotPage() {
  const { serviceName, partitionName, customSnapshotName } = useParams<{
    serviceName: string;
    partitionName: string;
    customSnapshotName: string;
  }>();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const deleteSnapshotMutation = useDeleteSnapshot();

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'delete', 'cancel'],
    });
    // Navigate back to snapshots list using relative path
    void navigate('..', { replace: true });
  };

  const handleConfirm = async () => {
    if (!serviceName || !partitionName || !customSnapshotName) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'delete', 'confirm'],
    });

    try {
      const result = await deleteSnapshotMutation.mutateAsync({
        serviceName,
        partitionName,
        customSnapshotName: decodeURIComponent(customSnapshotName),
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        void navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercCustomSnapDelete',
            params: {
              partitionName,
              customSnapshotName: decodeURIComponent(customSnapshotName),
            },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        // If no task, just go back to snapshots list
        void navigate('..');
      }
    } catch (error) {
      // Error is handled by the mutation hook
      // Keep modal open on error
    }
  };

  return (
    <BaseLayout>
      <Modal
        open={isOpen}
        onOpenChange={handleClose}
        dismissible={true}
        type={MODAL_COLOR.critical}
        heading={t('partition:snapshots.delete.title', 'Delete a snapshot')}
        primaryButton={{
          label: t('partition:snapshots.delete.submit', 'Delete snapshot'),
          onClick: () => {
            void handleConfirm();
          },
          loading: deleteSnapshotMutation.isPending,
          testId: 'delete-snapshot-confirm',
        }}
        secondaryButton={{
          label: t('partition:snapshots.delete.cancel', 'Close'),
          onClick: handleClose,
          testId: 'delete-snapshot-cancel',
        }}
      >
        <p>
          {t('partition:snapshots.delete.content', {
            name: decodeURIComponent(customSnapshotName || ''),
            partitionName,
          })}
        </p>
      </Modal>
    </BaseLayout>
  );
}
