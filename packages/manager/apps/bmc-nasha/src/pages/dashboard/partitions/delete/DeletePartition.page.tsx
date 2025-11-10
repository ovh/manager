import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, Modal, MODAL_COLOR } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE } from '@/constants/nasha.constants';
import { useDeletePartition } from '@/hooks/partitions/useDeletePartition';
import { APP_NAME } from '@/Tracking.constants';

export default function DeletePartitionPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
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
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE, 'cancel'],
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
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE, 'confirm'],
    });

    try {
      const result = await deletePartitionMutation.mutateAsync({
        serviceName,
        partitionName,
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        navigate(`../task-tracker`, {
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
    } catch (error) {
      // Error is handled by the mutation hook
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

