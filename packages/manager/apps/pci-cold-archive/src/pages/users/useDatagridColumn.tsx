import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { TUser } from '@/api/data/users';
import ActionsComponent from './Actions';

export const useDatagridColumn = () => {
  const { t } = useTranslation('users');

  const columns = [
    {
      id: 'username',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.username}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_username'),
      comparators: FilterCategories.String,
      isFilterable: true,
    },
    {
      id: 'creationDate',
      cell: (props: TUser) => (
        <DataGridTextCell>
          {format(props.creationDate, 'dd/MM/yyyy HH:mm')}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_creation_date'),
      comparators: FilterCategories.Date,
      isFilterable: true,
    },
    {
      id: 'description',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.description}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_description'),
      comparators: FilterCategories.String,
      isFilterable: true,
    },
    {
      id: 'access',
      cell: (props: TUser) => (
        <DataGridTextCell>{props.access}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_users_accesskey'),
      comparators: FilterCategories.String,
      isFilterable: true,
    },
    {
      id: 'actions',
      cell: (props: TUser) => <ActionsComponent user={props} />,
      label: '',
      isSortable: false,
      isFilterable: false,
    },
  ];

  return columns;
};
