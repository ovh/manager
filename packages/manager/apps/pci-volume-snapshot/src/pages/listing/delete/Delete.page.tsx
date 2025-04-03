import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useVolumeSnapshot, useDeleteSnapshot } from '@/api/hooks/useSnapshots';

export default function DeletePage() {
  const { t } = useTranslation('volumes/delete');

  const [searchParams] = useSearchParams();

  const snapshotId = useMemo(() => searchParams.get('snapshotId'), [
    searchParams,
  ]);
  const { projectId } = useParams();
  const { data: volumeSnapshot, isPending } = useVolumeSnapshot(
    projectId,
    snapshotId,
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'volumes/delete',
  });

  const handleCancel = goBack;
  const handleClose = goBack;

  const {
    deleteSnapshot,
    isPending: isDeleteSnapshotPending,
  } = useDeleteSnapshot({
    projectId: projectId || '',
    onError(error: ApiError) {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_snapshots_snapshot_delete_error_delete',
        error,
        values: {
          snapshot: volumeSnapshot?.name || '',
        },
      });

      goBack();
    },
    onSuccess() {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_snapshots_snapshot_delete_success_message',
        values: {
          snapshot: volumeSnapshot?.name || '',
        },
      });

      goBack();
    },
  });

  const onConfirm = () => {
    if (snapshotId) {
      deleteSnapshot(snapshotId);
    }
  };

  const isDisabled = isDeleteSnapshotPending || isPending;

  return (
    <DeletionModal
      title={t('pci_projects_project_storages_snapshots_snapshot_delete_title')}
      cancelText={t(
        'pci_projects_project_storages_snapshots_snapshot_delete_cancel_label',
      )}
      isPending={isPending}
      isDisabled={isDisabled}
      onCancel={handleCancel}
      submitText={t(
        'pci_projects_project_storages_snapshots_snapshot_delete_submit_label',
      )}
      onClose={handleClose}
      onConfirm={onConfirm}
    >
      <OdsText preset="paragraph" className="block">
        {t('pci_projects_project_storages_snapshots_snapshot_delete_content', {
          snapshot: volumeSnapshot?.name,
        })}
      </OdsText>
    </DeletionModal>
  );
}
