import {
  DataGridTextCell,
  DatagridColumn,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { TVolumeSnapshot } from '@/api/api.types';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import StatusComponent from './Status.component';
import ActionsComponent from './Actions.component';

const CreationDateCell = (props: TVolumeSnapshot) => (
  <DataGridTextCell>
    {useFormattedDate(props.creationDate, 'P p')}
  </DataGridTextCell>
);

export const useDatagridColumn = () => {
  const { t } = useTranslation('volumes');

  const { formatBytes } = useBytes();

  const { translateMicroRegion } = useTranslatedMicroRegions();

  const columns: DatagridColumn<TVolumeSnapshot>[] = [
    {
      id: 'name',
      label: t('pci_projects_project_storages_snapshots_name_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      isSortable: false,
    },
    {
      id: 'id',
      label: t('pci_projects_project_storages_snapshots_id_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>{props.id}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t('pci_projects_project_storages_snapshots_region_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>
          {translateMicroRegion(props.region)}
        </DataGridTextCell>
      ),
    },
    {
      id: 'volumeId',
      label: t('pci_projects_project_storages_snapshots_volume_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>{props.volume?.name}</DataGridTextCell>
      ),
    },
    {
      id: 'size',
      label: t('pci_projects_project_storages_snapshots_size_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>
          {formatBytes(props.size * 1024 ** 3, 2, 1024)}
        </DataGridTextCell>
      ),
    },
    {
      id: 'creationDate',
      label: t('pci_projects_project_storages_snapshots_creationDate_label'),
      cell: CreationDateCell,
    },
    {
      id: 'status',
      label: t('pci_projects_project_storages_snapshots_status_label'),
      cell: (props: TVolumeSnapshot) => (
        <DataGridTextCell>
          <StatusComponent status={props.status} />
        </DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      cell: (props: TVolumeSnapshot) => <ActionsComponent snapshot={props} />,
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
