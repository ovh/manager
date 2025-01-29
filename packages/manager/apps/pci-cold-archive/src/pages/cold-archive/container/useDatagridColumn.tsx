import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { format } from 'date-fns';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { TArchiveContainer } from '@/api/data/archive';
import StatusComponent from './Status.components';
import ActionsComponent from './ActionsComponent';

export const useDatagridColumn = () => {
  const { t } = useTranslation([
    'cold-archive',
    'cold-archive/containers',
    'containers',
  ]);

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
          {format(new Date(props.createdAt), 'dd/MM/yyyy HH:mm')}
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
              {format(new Date(props.lockedUntil), 'dd/MM/yyyy HH:mm')}
            </DataGridTextCell>
          );
        }
        return <DataGridTextCell>-</DataGridTextCell>;
      },
      label: t(
        'cold-archive/containers:pci_projects_project_storages_cold_archive_containers_locked_until_label',
      ),
    },
    {
      id: 'status',
      cell: (props: TArchiveContainer) => (
        <StatusComponent
          status={props.status}
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
