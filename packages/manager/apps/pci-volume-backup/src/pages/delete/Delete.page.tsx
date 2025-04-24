import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useBackups, useDeleteBackup } from '@/data/hooks/useVolumeBackup';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';

export default function DeletePage() {
  const { t } = useTranslation('delete');
  const { trackClick, trackPage } = useOvhTracking();
  const { projectId, backupId } = useParams();
  const { data: allBackupsData, isLoading: isBackupsLoading } = useBackups(
    projectId,
  );
  const allBackups = allBackupsData?.data || [];
  const backup = useMemo(() => {
    const matchingBackup = allBackups.find((d) => d.id === backupId);
    return matchingBackup || null;
  }, [allBackups, backupId]);
  const backupRegionName = backup ? backup.region : '';

  const navigate = useNavigate();
  const goBack = () => {
    trackClick({
      actionType: 'action',
      actions: [VOLUME_BACKUP_TRACKING.DELETE_BACKUP.CTA_CANCEL],
    });
    navigate('..');
  };

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'delete',
  });

  const handleCancel = goBack;
  const handleClose = goBack;

  const { deleteBackup, isPending: isDeleteVolumePending } = useDeleteBackup({
    projectId: projectId || '',
    regionName: backupRegionName,
    onSuccess() {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: VOLUME_BACKUP_TRACKING.DELETE_BACKUP.REQUEST_SUCCESS,
      });

      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_delete_success',
        values: {
          volumeBackupName: backup?.name || '',
        },
      });

      goBack();
    },
    onError(error: ApiError) {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.DELETE_BACKUP.REQUEST_FAIL,
      });

      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_delete_error',
        error,
        values: {
          volumeBackupName: backup?.name || '',
        },
      });

      goBack();
    },
  });

  const onConfirm = () => {
    if (backupId) {
      trackClick({
        actionType: 'action',
        actions: [VOLUME_BACKUP_TRACKING.DELETE_BACKUP.CTA_CONFIRM],
      });
      deleteBackup(backupId);
    }
  };

  const isModalLoading = isBackupsLoading || isDeleteVolumePending;
  const isDisabled = isDeleteVolumePending || isBackupsLoading;

  const confirmationLabel = (
    <OdsText preset="caption" className="fw-bold">
      {t('pci_projects_project_storages_volume_backup_list_delete_enter')}
    </OdsText>
  );

  return (
    <DeletionModal
      title={t('pci_projects_project_storages_volume_backup_list_delete_title')}
      cancelText={t(
        'pci_projects_project_storages_volume_backup_list_delete_action_cancel',
      )}
      isPending={isModalLoading}
      isDisabled={isDisabled}
      onCancel={handleCancel}
      submitText={t(
        'pci_projects_project_storages_volume_backup_list_delete_action_confirm',
      )}
      confirmationText="DELETE"
      confirmationLabel={(confirmationLabel as unknown) as string}
      onClose={handleClose}
      onConfirm={onConfirm}
      data-testid="backup-deletion-modal"
    >
      <OdsText
        preset="paragraph"
        className="mb-4"
        data-testid="delete-backup_warning-message"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: t(
              'pci_projects_project_storages_volume_backup_list_delete_description',
              {
                volumeBackupName: `<strong>${backup?.name}</strong>`,
              },
            ),
          }}
        ></span>
      </OdsText>
      <OdsText preset="paragraph" className="delete-modal-input-caption mb-4">
        {t('pci_projects_project_storages_volume_backup_list_delete_warn')}
      </OdsText>
    </DeletionModal>
  );
}
