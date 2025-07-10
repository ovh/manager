import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import DataTable from '@/components/data-table';

interface TopicsTableColumnsProps {
  onDeleteClick: (topic: database.kafka.Topic) => void;
  onEditClick: (topic: database.kafka.Topic) => void;
}
export const getColumns = ({
  onDeleteClick,
  onEditClick,
}: TopicsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topics',
  );
  const columns: ColumnDef<database.kafka.Topic>[] = [
    {
      id: 'topic',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'partitions',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadPartitions')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.partitions,
    },
    {
      id: 'replication',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadReplication')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.replication,
    },
    {
      id: 'minInsyncReplicas',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadMinInsyncReplicas')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.minInsyncReplicas,
    },
    {
      id: 'retentionHours',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadRetentionHours')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.retentionHours,
      cell: ({ cell }) => {
        return cell.getValue() === -1
          ? t('tableValueUnlimited')
          : cell.getValue();
      },
    },
    {
      id: 'retentionBytes',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadRetentionBytes')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.retentionBytes,
      cell: ({ cell }) => {
        return cell.getValue() === -1
          ? t('tableValueUnlimited')
          : cell.getValue();
      },
    },
    {
      id: 'deletePolicy',
      header: t('tableHeadDeletePolicy'),
      cell: 'delete',
    },
    {
      id: MENU_COLUMN_ID,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="menu"
                  size="menu"
                  data-testid="topic-action-trigger"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-testid="topic-menu-content" align="end">
                <DropdownMenuItem
                  data-testid="topic-action-edit-button"
                  disabled={
                    service.capabilities.topic?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  onClick={() => {
                    onEditClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionEdit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid="topic-action-delete-button"
                  variant="destructive"
                  disabled={
                    service.capabilities.topic?.delete ===
                    database.service.capability.StateEnum.disabled
                  }
                  onClick={() => {
                    onDeleteClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionDelete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
