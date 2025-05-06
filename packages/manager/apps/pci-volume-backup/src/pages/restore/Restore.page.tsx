import { Trans, useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useBackup, useRestoreVolume } from '@/data/hooks/useVolumeBackup';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { useVolume } from '@/data/hooks/useVolume';

export default function Restore() {
  const { t } = useTranslation(['restore']);

  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const volumeId = searchParams.get('volumeId') || '';
  const { trackClick, trackPage } = useOvhTracking();

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'restore',
  });

  const { data: volume, isLoading: isVolumeLoading } = useVolume(
    projectId,
    volumeId,
  );

  const { data: backup, isLoading: isBackupLoading } = useBackup({
    projectId,
    volumeId,
  });

  const goBack = () => {
    trackClick({
      actionType: 'action',
      actions: [VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.CTA_CANCEL],
    });

    navigate('..');
  };

  const { restoreVolume, isPending: isRestorePending } = useRestoreVolume({
    projectId: projectId || '',
    regionName: volume?.region || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.REQUEST_SUCCESS,
      });

      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_success',
        values: {
          volumeName: `<strong>${volume?.name}</strong>`,
        },
      });

      goBack();
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.REQUEST_FAIL,
      });

      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_error',
        error,
        values: {
          volumeName: `<strong>${volume?.name}</strong>`,
        },
      });

      goBack();
    },
  });

  const isModalLoading = isVolumeLoading || isBackupLoading || isRestorePending;

  const restore = () => {
    if (volume?.id && backup?.id) {
      trackClick({
        actionType: 'action',
        actions: [VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.CTA_CONFIRM],
      });

      restoreVolume({ volumeId: volume.id, backupId: backup?.id });
    }
  };

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_volume_backup_list_restore_volume_header',
      )}
      type="warning"
      isPending={isModalLoading}
      onClose={goBack}
      onCancel={goBack}
      cancelText={t(
        'pci_projects_project_storages_volume_backup_list_restore_volume_action_cancel',
      )}
      onConfirm={restore}
      submitText={t(
        'pci_projects_project_storages_volume_backup_list_restore_volume_action_confirm',
      )}
    >
      <OdsText>
        <Trans
          t={t}
          i18nKey="pci_projects_project_storages_volume_backup_list_restore_volume_description"
          values={{
            volumeName: `<strong>${volume?.name}</strong>`,
            volumeBackupName: `<strong>${backup?.name}</strong>`,
          }}
        />
      </OdsText>
    </PciModal>
  );
}
