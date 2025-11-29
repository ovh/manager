import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, MODAL_COLOR, Modal } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useDeletePartition } from '@/hooks/partitions/useDeletePartition';

export default function DeletePartitionPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['partitions']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const deletePartitionMutation = useDeletePartition();

  const [isOpen] = useState(true);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'delete', 'cancel'],
    });
    // Navigate back to partitions list using relative path
    navigate('..', { replace: true });
  };

  const handleConfirm = async () => {
    if (!serviceName || !partitionName) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'delete', 'confirm'],
    });

    try {
      const result = await deletePartitionMutation.mutateAsync({
        serviceName,
        partitionName,
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        navigate('../task-tracker', {
          state: {
            taskId,
            operation: 'clusterLeclercPartitionDelete',
            params: { partitionName },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        // If no task, just go back to partitions list
        navigate('..');
      }
    } catch {
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
        heading={t('partitions:delete.title', 'Delete a partition')}
        primaryButton={{
          label: t('partitions:delete.submit', 'Delete partition'),
          onClick: () => {
            void handleConfirm();
          },
          loading: deletePartitionMutation.isPending,
          testId: 'delete-partition-confirm',
        }}
        secondaryButton={{
          label: t('partitions:delete.cancel', 'Close'),
          onClick: handleClose,
          testId: 'delete-partition-cancel',
        }}
      >
        <p>
          {t('partitions:delete.content', {
            partitionName,
          })}
        </p>
      </Modal>
    </BaseLayout>
  );
}
