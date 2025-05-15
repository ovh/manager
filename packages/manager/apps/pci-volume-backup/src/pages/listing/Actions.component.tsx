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
  const { id, volumeId, status } = backup;

  const restoreVolumeHref = useHref(`./restore-volume?volumeId=${volumeId}`);
  const createVolumeHref = useHref(`./${id}/create-volume`);
  const deleteVolumeBackupHref = useHref(`./delete?backupId=${id}`);

  if (![VOLUME_BACKUP_STATUS.OK, VOLUME_BACKUP_STATUS.ERROR].includes(status)) {
    return null;
  }

  const menuItems = [
    ...(status === VOLUME_BACKUP_STATUS.OK
      ? [
          {
            id: 1,
            href: restoreVolumeHref,
            label: t(
              'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
            ),
          },
          {
            id: 2,
            href: createVolumeHref,
            label: t(
              'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
            ),
          },
        ]
      : []),
    {
      id: 3,
      href: deleteVolumeBackupHref,
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete',
      ),
    },
  ];

  return <ActionMenu id={id} items={menuItems} isCompact />;
}
