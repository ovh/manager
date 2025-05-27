import {
  DataGridTextCell,
  DatagridColumn,
  useFormatDate,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { TVolumeBackup } from '@/data/api/api.types';
import StatusComponent from './Status.component';
import ActionsComponent from './Actions.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation('listing');

  const formatDate = useFormatDate();
  const { formatBytes } = useBytes();
  const hrefProject = useProjectUrl('public-cloud');
  const hrefBlockStorage = `${hrefProject}/storages/blocks`;

  const columns: DatagridColumn<TVolumeBackup>[] = [
    {
      id: 'name',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_name',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'id',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_id',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>{props.id}</DataGridTextCell>
      ),
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'region',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_region',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'volumeId',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_volume',
      ),
      cell: (props: TVolumeBackup) => (
        <OdsLink label={props.volumeId} href={hrefBlockStorage} />
      ),
      isSearchable: false,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'creationDate',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_create_date',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>
          {formatDate({ date: props.creationDate, format: 'P p' })}
        </DataGridTextCell>
      ),
      isSearchable: false,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Date,
    },
    {
      id: 'size',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_capacity',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>
          {formatBytes(props.size * 1024 ** 3, 2, 1024)}
        </DataGridTextCell>
      ),
      isSearchable: false,
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
    },
    {
      id: 'status',
      label: t(
        'pci_projects_project_storages_volume_backup_list_datagrid_column_status',
      ),
      cell: (props: TVolumeBackup) => (
        <DataGridTextCell>
          <StatusComponent status={props.status} />
        </DataGridTextCell>
      ),
      isSearchable: false,
      isSortable: true,
      isFilterable: false,
      type: FilterTypeCategories.String,
    },
    {
      id: 'actions',
      cell: (props: TVolumeBackup) => <ActionsComponent backup={props} />,
      label: '',
      isSortable: false,
      isSearchable: false,
    },
  ];

  return columns;
};
