import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolumeBackup } from '@/data/api/api.types';

type ActionsProps = {
  backup: TVolumeBackup;
};

export default function Actions({ backup }: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');

  const items: { id: number; href: string; label: string }[] = [
    {
      id: 1,
      href: useHref(`./restore-volume`),
      label: t('pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore'),
    },
    {
      id: 2,
      href: useHref(`./${backup.id}/create-volume`),
      label: t('pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume'),
    },
    {
      id: 3,
      href: useHref(`./delete`),
      label: t('pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete'),
    },
  ];

  return <ActionMenu id={backup.id} items={items} isCompact />;
}
