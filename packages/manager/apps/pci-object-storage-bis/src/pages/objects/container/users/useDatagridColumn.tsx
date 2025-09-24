import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TUser } from '@/api/data/user';
import ActionsComponent from '@/pages/objects/container/users/Actions';

export const useDatagridColumn = () => {
  const { t } = useTranslation('objects/users');

  const columns: DatagridColumn<TUser>[] = [
    {
      id: 'username',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.username}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_username'),
    },
    {
      id: 'description',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.description}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_description'),
    },
    {
      id: 'access',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.access}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_accesskey'),
    },
    {
      id: 'actions',
      cell: (props: TUser) => (
        <div className="min-w-16">
          <ActionsComponent user={props} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
