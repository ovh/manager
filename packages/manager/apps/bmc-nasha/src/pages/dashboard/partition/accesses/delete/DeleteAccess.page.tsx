import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, MODAL_COLOR, Modal } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useDeleteAccess } from '@/hooks/partitions/useDeleteAccess';

export default function DeleteAccessPage() {
  const { serviceName, partitionName, ip } = useParams<{
    serviceName: string;
    partitionName: string;
    ip: string;
  }>();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const deleteAccessMutation = useDeleteAccess();

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'delete', 'cancel'],
    });
    // Navigate back to accesses list using relative path
    void navigate('..', { replace: true });
  };

  const handleConfirm = async () => {
    if (!serviceName || !partitionName || !ip) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'delete', 'confirm'],
    });

    try {
      const result = await deleteAccessMutation.mutateAsync({
        serviceName,
        partitionName,
        ip: decodeURIComponent(ip),
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        void navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercPartitionAccessDelete',
            params: { partitionName, ip: decodeURIComponent(ip) },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        // If no task, just go back to accesses list
        void navigate('..');
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
        heading={t('partition:accesses.delete.title', 'Delete an access control (ACL)')}
        primaryButton={{
          label: t('partition:accesses.delete.submit', 'Delete access'),
          onClick: () => {
            void handleConfirm();
          },
          loading: deleteAccessMutation.isPending,
          testId: 'delete-access-confirm',
        }}
        secondaryButton={{
          label: t('partition:accesses.delete.cancel', 'Close'),
          onClick: handleClose,
          testId: 'delete-access-cancel',
        }}
      >
        <p>
          {t('partition:accesses.delete.content', {
            ip: decodeURIComponent(ip || ''),
            partitionName,
          })}
        </p>
      </Modal>
    </BaseLayout>
  );
}
