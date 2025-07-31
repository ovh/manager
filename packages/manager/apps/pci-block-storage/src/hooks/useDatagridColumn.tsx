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

export enum BlockStorageListColumn {
  NAME = 'name',
  ID = 'id',
  REGION = 'regionName',
  TYPE = 'type',
  SIZE = 'size',
  ATTACHED = 'attachedTo',
  ENCRYPTION = 'encryptionStatus',
  STATUS = 'status',
  ACTIONS = 'actions',
}

export const isBlockStorageListColumn = (
  maybeColumn: string,
): maybeColumn is BlockStorageListColumn =>
  Object.values<string>(BlockStorageListColumn).includes(maybeColumn);

export const useDatagridColumn = (projectId: string, projectUrl: string) => {
  const { t } = useTranslation('common');
  const columns: DatagridColumn<TVolume>[] = [
    {
      id: BlockStorageListColumn.NAME,
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_name_label'),
    },
    {
      id: BlockStorageListColumn.ID,
      cell: (props) => <DataGridTextCell>{props.id}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_id_label'),
    },
    {
      id: BlockStorageListColumn.REGION,
      cell: (props) => <DataGridTextCell>{props.regionName}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_region_label'),
    },
    {
      id: BlockStorageListColumn.TYPE,
      cell: (props) => <DataGridTextCell>{props.type}</DataGridTextCell>,
      label: t('pci_projects_project_storages_blocks_type_label'),
    },
    {
      id: BlockStorageListColumn.SIZE,
      cell: (props) => <CapacityComponent size={props.size} />,
      label: t('pci_projects_project_storages_blocks_size_label'),
    },
    {
      id: BlockStorageListColumn.ATTACHED,
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
      id: BlockStorageListColumn.ENCRYPTION,
      cell: (volume) => (
        <Badge
          label={volume.encryptionStatus}
          color={volume.encrypted ? 'success' : 'neutral'}
        />
      ),
      label: t('pci_projects_project_storages_blocks_encrypted_label'),
    },
    {
      id: BlockStorageListColumn.STATUS,
      cell: (props) => (
        <StatusComponent
          statusGroup={props.statusGroup}
          status={props.statusLabel}
        />
      ),
      label: t('pci_projects_project_storages_blocks_status_label'),
    },
    {
      id: BlockStorageListColumn.ACTIONS,
      cell: (props) => (
        <ActionsComponent projectUrl={projectUrl} volume={props} />
      ),
      label: t(''),
    },
  ];
  return columns;
};
