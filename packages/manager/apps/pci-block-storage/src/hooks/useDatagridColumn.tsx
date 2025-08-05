import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Badge } from '@ovh-ux/manager-pci-common';
import { TVolume } from '@/api/hooks/useVolume';
import CapacityComponent from '@/components/list/Capacity.component';
import ActionsComponent from '@/components/list/Actions.component';
import AttachedInstanceComponent from '@/components/list/AttachedInstance.component';
import StatusComponent from '@/components/list/Status.component';

export const useDatagridColumn = (projectId: string, projectUrl: string) => {
  const { t } = useTranslation('common');
  const columns: DatagridColumn<TVolume>[] = [
    {
      id: 'name',
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_name_label'),
    },
    {
      id: 'id',
      cell: (props) => <DataGridTextCell>{props.id}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_id_label'),
    },
    {
      id: 'regionName',
      cell: (props) => <DataGridTextCell>{props.regionName}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_region_label'),
    },
    {
      id: 'type',
      cell: (props) => <DataGridTextCell>{props.type}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_type_label'),
    },
    {
      id: 'size',
      cell: (props) => <CapacityComponent size={props.size} />,
      label: t('pci_projects_project_storages_blocks_size_label'),
    },
    {
      id: 'attachedTo',
      cell: (props) => (
        <DataGridTextCell>
          {props.attachedTo.map((instance) => (
            <div key={instance}>
              <AttachedInstanceComponent
                projectId={projectId}
                projectUrl={projectUrl}
                instanceId={instance}
              />
            </div>
          ))}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_blocks_attachedTo_label'),
    },
    {
      id: 'encryptionStatus',
      cell: (volume) => (
        <Badge
          label={volume.encryptionStatus}
          color={volume.encrypted ? 'success' : 'neutral'}
        />
      ),
      label: t('pci_projects_project_storages_blocks_encrypted_label'),
    },
    {
      id: 'status',
      cell: (props) => (
        <StatusComponent
          statusGroup={props.statusGroup}
          status={props.statusLabel}
        />
      ),
      label: t('pci_projects_project_storages_blocks_status_label'),
    },
    {
      id: 'actions',
      cell: (props) => (
        <ActionsComponent projectUrl={projectUrl} volume={props} />
      ),
      label: t(''),
    },
  ];
  return columns;
};
