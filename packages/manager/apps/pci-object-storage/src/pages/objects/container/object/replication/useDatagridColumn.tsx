import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { useHref } from 'react-router-dom';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import ActionsComponent from './ActionsComponent';
import { TObject } from '@/api/data/container';
import { STATUS_DISABLED, STATUS_ENABLED } from '@/constants';

export type TIndexedObject = TObject & { index: string };

export type TIndexedBackupConfiguration = {
  id: string;
  status: 'enabled' | 'disabled';
  priority: number;
  destination: {
    name: string;
    region: string;
    storageClass: 'STANDARD' | 'STANDARD_IA' | 'HIGH_PERF';
  };
  deleteMarkerReplication: 'enabled' | 'disabled';
  index?: string;
};

export const useDatagridColumn = () => {
  const { t } = useTranslation('containers/replication');

  const columns: DatagridColumn<TIndexedBackupConfiguration>[] = [
    {
      id: 'name',
      cell: (props: TIndexedBackupConfiguration) => {
        const { id } = props;

        return (
          <div className="flex flex-col">
            <DataGridTextCell>{id}</DataGridTextCell>
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_name',
      ),
    },
    {
      id: 'destinationName',
      cell: (props: TIndexedBackupConfiguration) => {
        const { name, region } = props.destination;
        const href = useHref(`../${name}?region=${region}`);

        return (
          <div className="flex flex-col">
            <OdsLink color="primary" href={href} label={name} />
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_destination_name',
      ),
    },
    {
      id: 'priority',
      cell: (props: TIndexedBackupConfiguration) => {
        const { priority } = props;

        return (
          <div className="flex flex-col">
            <DataGridTextCell>{priority}</DataGridTextCell>
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_priority',
      ),
    },
    {
      id: 'region',
      cell: (props: TIndexedBackupConfiguration) => {
        const { region } = props.destination;

        return (
          <div className="flex flex-col">
            <DataGridTextCell>{region}</DataGridTextCell>
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_region',
      ),
    },
    {
      id: 'storageClass',
      cell: (props: TIndexedBackupConfiguration) => {
        const { storageClass } = props.destination;

        return (
          <div className="flex flex-col">
            <DataGridTextCell>
              {t(
                `pci_projects_project_storages_containers_replication_list_storage_class_${storageClass}`,
              )}
            </DataGridTextCell>
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_storage_class',
      ),
    },
    {
      id: 'status',
      cell: (props: TIndexedBackupConfiguration) => {
        const { status } = props;

        const getVersioningBadgeColor = useMemo(() => {
          const statusMap = {
            [STATUS_ENABLED]: ODS_BADGE_COLOR.success,
            [STATUS_DISABLED]: ODS_BADGE_COLOR.critical,
          };

          return statusMap[status] ?? ODS_BADGE_COLOR.information;
        }, [status]);

        return (
          <div className="flex flex-col">
            <OdsBadge
              size="sm"
              label={t(
                status === STATUS_ENABLED
                  ? 'pci_projects_project_storages_containers_replication_list_data_grid_status_enabled'
                  : 'pci_projects_project_storages_containers_replication_list_data_grid_status_disabled',
              )}
              color={getVersioningBadgeColor}
            />
          </div>
        );
      },
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_status',
      ),
    },
    {
      id: 'actions',
      cell: (props: TIndexedBackupConfiguration) => (
        <ActionsComponent replication={props} />
      ),
      label: '',
      isSortable: false,
    },
  ].filter(Boolean);

  return columns;
};
