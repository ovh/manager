import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolumeBackup } from '@/data/api/api.types';
import { VOLUME_BACKUP_STATUS } from '@/constants';

type ActionsProps = {
  backup: TVolumeBackup;
};

export default function Actions({ backup }: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');

  const restoreBackupItem = {
    id: 1,
    href: useHref(`./restore-volume?volumeId=${backup.volumeId}`),
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
    ),
  };
  const createVolumeItem = {
    id: 2,
    href: useHref(`./${backup.id}/create-volume`),
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
    ),
  };
  const deleteVolumeItem = {
    id: 3,
    href: useHref(`./delete?backupId=${backup.id}`),
    label: t(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete',
    ),
  };

  let items: { id: number; href: string; label: string }[] = [];
  if (backup?.status === VOLUME_BACKUP_STATUS.OK) {
    items = [restoreBackupItem, createVolumeItem, deleteVolumeItem];
  } else if (backup?.status === VOLUME_BACKUP_STATUS.ERROR) {
    items = [deleteVolumeItem];
  }

  return <ActionMenu id={backup.id} items={items} isCompact />;
}
