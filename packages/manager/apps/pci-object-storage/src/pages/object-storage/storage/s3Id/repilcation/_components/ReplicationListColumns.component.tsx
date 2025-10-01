import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import storages from '@/types/Storages';
import { ActionsMenu } from './ActionsMenu.component';

type GetColumnsParams = {
  onEditClicked: (replication: storages.ReplicationRule) => void;
  onDeleteClicked: (replication: storages.ReplicationRule) => void;
};

export function getColumns({
  onEditClicked,
  onDeleteClicked,
}: GetColumnsParams): ColumnDef<storages.ReplicationRule>[] {
  const { t } = useTranslation('pci-object-storage/replication');

  return [
    {
      accessorKey: 'id',
      header: t('columnName'),
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: 'destination.name',
      header: t('columnDestinationName'),
      cell: ({ row }) => <span>{row.original.destination.name}</span>,
    },
    {
      accessorKey: 'priority',
      header: t('columnPriority'),
      cell: ({ row }) => <span>{row.original.priority}</span>,
    },
    {
      accessorKey: 'destination.region',
      header: t('columnRegion'),
      cell: ({ row }) => <span>{row.original.destination.region}</span>,
    },
    {
      accessorKey: 'destination.storageClass',
      header: t('columnStorageClass'),
      cell: ({ row }) => <span>{row.original.destination.storageClass}</span>,
    },
    {
      accessorKey: 'status',
      header: t('columnStatus'),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === storages.ReplicationRuleStatusEnum.enabled
              ? 'success'
              : 'error'
          }
        >
          {t(
            row.original.status === storages.ReplicationRuleStatusEnum.enabled
              ? 'statusEnabled'
              : 'statusDisabled',
          )}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ActionsMenu
          replication={row.original}
          onEdit={onEditClicked}
          onDelete={onDeleteClicked}
        />
      ),
    },
  ];
}
