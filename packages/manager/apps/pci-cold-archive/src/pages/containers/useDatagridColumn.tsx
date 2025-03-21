import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { TArchiveContainer } from '@/api/data/archive';
import StatusComponent from './Status.components';
import ActionsComponent from './Actions.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';

export const useDatagridColumn = () => {
  const { t } = useTranslation(['cold-archive', 'containers']);

  const { formatBytes } = useBytes();

  const columns: DatagridColumn<TArchiveContainer>[] = [
    {
      id: 'name',
      cell: (props: TArchiveContainer) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      label: t(
        'containers:pci_projects_project_storages_containers_name_label',
      ),
    },
    {
      id: 'createdAt',
      cell: (props: TArchiveContainer) => (
        <DataGridTextCell>
          {useFormattedDate(props.createdAt, 'P p')}
        </DataGridTextCell>
      ),
      label: t(
        'pci_projects_project_storages_cold_archive_containers_creation_date_label',
      ),
    },
    {
      id: 'objectsCount',
      cell: (props: TArchiveContainer) => (
        <DataGridTextCell>{props.objectsCount}</DataGridTextCell>
      ),
      label: t(
        'containers:pci_projects_project_storages_containers_storedObjects_label',
      ),
    },
    {
      id: 'objectsSize',
      cell: (props: TArchiveContainer) => {
        if (props.objectsSize > 0) {
          return (
            <DataGridTextCell>
              {formatBytes(props.objectsSize, 2, 1024)}
            </DataGridTextCell>
          );
        }
        return <DataGridTextCell>-</DataGridTextCell>;
      },
      label: t(
        'containers:pci_projects_project_storages_containers_storedBytes_label',
      ),
    },
    {
      id: 'lockedUntil',
      cell: (props: TArchiveContainer) => {
        if (props.lockedUntil) {
          return (
            <DataGridTextCell>
              {useFormattedDate(props.lockedUntil, 'P p')}
            </DataGridTextCell>
          );
        }
        return <DataGridTextCell>-</DataGridTextCell>;
      },
      label: t(
        'containers:pci_projects_project_storages_cold_archive_containers_locked_until_label',
      ),
    },
    {
      id: 'status',
      cell: (props: TArchiveContainer) => (
        <StatusComponent
          status={props.status}
          name={props.name}
          automaticDeletionAt={props.automaticDeletionAt}
        />
      ),
      label: t(
        'pci_projects_project_storages_cold_archive_containers_status_label',
      ),
    },
    {
      id: 'actions',
      cell: (props: TArchiveContainer) => <ActionsComponent archive={props} />,
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
