import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { TVolumeBackup } from '@/data/api/api.types';
import { VOLUME_BACKUP_STATUS } from '@/constants';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { useVolume } from '@/data/hooks/useVolume';
import { isVolumeDeleted } from '@/data/select/volume';

type ActionsProps = {
  backup: TVolumeBackup;
};

export default function Actions({ backup }: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const { id, volumeId, status } = backup;
  const { projectId } = useParams();
  const { data: volume, isLoading } = useVolume(projectId, volumeId);

  const restoreVolumeHref = useHref(`./restore-volume?volumeId=${volumeId}`);
  const createVolumeHref = useHref(`./${id}/create-volume`);
  const deleteVolumeBackupHref = useHref(`./delete?backupId=${id}`);

  if (![VOLUME_BACKUP_STATUS.OK, VOLUME_BACKUP_STATUS.ERROR].includes(status)) {
    return null;
  }

  const restoreAction = {
    id: 1,
    href: restoreVolumeHref,
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
    ),
    onClick: () => {
      trackClick({
        actionType: 'action',
        actions: VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_RESTORE_VOLUME,
      });
    },
  };

  const createAction = {
    id: 2,
    href: createVolumeHref,
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
    ),
    onClick: () => {
      trackClick({
        actionType: 'action',
        actions: VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_CREATE_VOLUME,
      });
    },
  };

  const deleteAction = {
    id: 3,
    href: deleteVolumeBackupHref,
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete',
    ),
    onClick: () => {
      trackClick({
        actionType: 'action',
        actions: VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_DELETE_VOLUME,
      });
    },
  };

  const menuItems = [
    ...(status === VOLUME_BACKUP_STATUS.OK &&
    !isLoading &&
    !!volume &&
    !isVolumeDeleted(volume)
      ? [restoreAction]
      : []),
    ...(status === VOLUME_BACKUP_STATUS.OK ? [createAction] : []),
    deleteAction,
  ];

  return (
    <ActionMenu
      id={id}
      items={menuItems}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
