import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import storages from '@/types/Storages';
import { ActionsMenu } from './ActionsMenu.component';
import LinkComponent from '@/components/links/Link.component';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';

type GetColumnsParams = {
  onEditClicked: (replication: storages.ReplicationRule) => void;
  onDeleteClicked: (replication: storages.ReplicationRule) => void;
};

export function getColumns({
  onEditClicked,
  onDeleteClicked,
}: GetColumnsParams): ColumnDef<storages.ReplicationRule>[] {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );

  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnName')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <LinkComponent to={`./edit/${row.original.id}`}>
          {row.original.id}
        </LinkComponent>
      ),
    },
    {
      id: 'destinationName',
      accessorKey: 'destination.name',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnDestinationName')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <span>{row.original.destination.name}</span>,
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnPriority')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <span>{row.original.priority}</span>,
    },
    {
      id: 'region',
      accessorKey: 'destination.region',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnRegion')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => <span>{row.original.destination.region}</span>,
    },
    {
      id: 'storageClass',
      accessorKey: 'destination.storageClass',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnStorageClass')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const { storageClass } = row.original.destination;
        return (
          <span>
            {tObj(
              storageClass
                ? `objectClass_${row.original.destination.storageClass}`
                : 'objectClassDefault',
            )}
          </span>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('columnStatus')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === storages.ReplicationRuleStatusEnum.enabled
              ? 'success'
              : 'warning'
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
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
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
