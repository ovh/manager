import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';

export default function ActionsComponent() {
  const { t } = useTranslation('objects/users');
  const { t: tPciStoragesContainers } = useTranslation(
    'pci-storages-containers',
  );
  const items = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_users_import_json'),
    },
    {
      id: 1,
      label: t('pci_projects_project_storages_containers_users_download_json'),
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_users_download_rclone_file',
      ),
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_users_see_secret_key'),
    },
    {
      id: 4,
      label: tPciStoragesContainers(
        'pci_projects_project_storages_containers_delete_label',
      ),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
