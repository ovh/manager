import { Trans, useTranslation } from 'react-i18next';

import { PciModal, useInstance } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useOvhTracking, PageType } from '@ovh-ux/manager-react-shell-client';
import { useDetachVolume, useVolume } from '@/data/hooks/useVolume';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';

export default function DetachVolume() {
  const { t } = useTranslation('detach-volume');
  const { trackClick } = useOvhTracking();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const volumeId = searchParams.get('volumeId');
  const instanceId = searchParams.get('instanceId');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'detach-volume',
  });

  const { data: volume, isLoading: isVolumeLoading } = useVolume(
    projectId,
    volumeId,
  );

  const { data: instance, isLoading: isInstanceLoading } = useInstance(
    projectId || '',
    instanceId || '',
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { detachVolume, isPending: isDetachPending } = useDetachVolume({
    projectId: projectId || '',
    volumeId,
    instanceId,
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_detach_volume_action_success',
        values: {
          volumeName: volume?.name,
          instanceName: instance?.name,
        },
        trackingParams: {
          pageType: PageType.bannerSuccess,
          pageName: VOLUME_BACKUP_TRACKING.DETACH_VOLUME.REQUEST_SUCCESS,
        },
      });

      goBack();
    },
    onError: (error) => {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_detach_volume_action_fail',
        error,
        trackingParams: {
          pageType: PageType.bannerError,
          pageName: VOLUME_BACKUP_TRACKING.DETACH_VOLUME.REQUEST_FAIL,
        },
      });

      goBack();
    },
  });

  const handleConfirm = () => {
    trackClick({
      actionType: 'action',
      actions: VOLUME_BACKUP_TRACKING.DETACH_VOLUME.CTA_CONFIRM,
    });
    detachVolume();
  };
  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: VOLUME_BACKUP_TRACKING.DETACH_VOLUME.CTA_CANCEL,
    });
    goBack();
  };

  const isModalLoading =
    isVolumeLoading || isInstanceLoading || isDetachPending;

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_volume_backup_create_detach_volume_title',
      )}
      type="warning"
      isPending={isModalLoading}
      onClose={goBack}
      onCancel={handleCancel}
      cancelText={t(
        'pci_projects_project_storages_volume_backup_create_detach_volume_action_cancel',
      )}
      onConfirm={handleConfirm}
      submitText={t(
        'pci_projects_project_storages_volume_backup_create_detach_volume_action_detach',
      )}
    >
      <OdsText>
        <Trans
          t={t}
          i18nKey="pci_projects_project_storages_volume_backup_create_detach_volume_description"
          values={{
            volumeName: `<strong>${volume?.name}</strong>`,
            instanceName: `<strong>${instance?.name}</strong>`,
          }}
        />
      </OdsText>
    </PciModal>
  );
}
