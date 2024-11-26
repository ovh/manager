import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useHref } from 'react-router-dom';
import { TUser } from '@/api/data/user';

type ActionsComponentProps = {
  user: TUser;
};

export default function ActionsComponent({
  user,
}: Readonly<ActionsComponentProps>) {
  const { t } = useTranslation('objects/users');
  const { t: tPciStoragesContainers } = useTranslation(
    'pci-storages-containers',
  );

  const deleteHref = useHref(`./${user.id}/delete`);
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
      href: deleteHref,
      label: tPciStoragesContainers(
        'pci_projects_project_storages_containers_delete_label',
      ),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
