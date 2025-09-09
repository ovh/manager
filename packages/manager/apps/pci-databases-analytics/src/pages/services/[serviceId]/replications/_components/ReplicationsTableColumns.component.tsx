import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Skeleton,
  Badge,
} from '@datatr-ux/uxlib';

import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import { ReplicationWithServiceData } from '../Replications.page';

interface ReplicationsTableColumnsProps {
  onEditClick: (replication: ReplicationWithServiceData) => void;
  onDeleteClick: (replication: ReplicationWithServiceData) => void;
}
export const getColumns = ({
  onEditClick,
  onDeleteClick,
}: ReplicationsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/replications',
  );
  const columns: ColumnDef<ReplicationWithServiceData>[] = [
    {
      id: 'source',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadSource')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.sourceIntegrationService?.description ?? '',
      cell: ({ row }) =>
        row.original.sourceIntegrationService?.description ?? (
          <Skeleton className="w-full h-4" />
        ),
    },
    {
      id: 'target',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadTarget')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.targetIntegrationService?.description ?? '',
      cell: ({ row }) =>
        row.original.targetIntegrationService?.description ?? (
          <Skeleton className="w-full h-4" />
        ),
    },
    {
      id: 'topics',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadTopics')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.topics.length,
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap max-w-md">
          {row.original.topics.map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="border border-border text-xs w-fit"
            >
              {topic}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'topicExcludeList',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadTopicsExcludeList')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.topicExcludeList.length,
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap max-w-md">
          {row.original.topicExcludeList.map((excludedTopic) => (
            <Badge
              key={excludedTopic}
              variant="outline"
              className="border border-border text-xs w-fit"
            >
              {excludedTopic}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'syncGroupOffsets',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadSyncGroupOffsets')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.syncGroupOffsets,
      cell: ({ row }) =>
        row.original.syncGroupOffsets
          ? t('tableCellSyncGroupOffsetsTrue')
          : t('tableCellSyncGroupOffsetsFalse'),
    },
    {
      id: 'syncInterval',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadSyncInterval')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.syncInterval,
    },
    {
      id: 'enabled',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadEnabled')}
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) =>
        row.original.enabled
          ? t('tableCellEnabledTrue')
          : t('tableCellEnabledFalse'),
    },
    {
      id: MENU_COLUMN_ID,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      data-testid="replications-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="replications-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      {service.capabilities.replication?.update && (
                        <DropdownMenuItem
                          data-testid="replications-action-edit-button"
                          variant="primary"
                          disabled={
                            service.capabilities.replication?.update ===
                            database.service.capability.StateEnum.disabled
                          }
                          onClick={() => {
                            onEditClick(row.original);
                          }}
                          className="w-full"
                        >
                          {t('tableActionEdit')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {service.capabilities.replication?.delete && (
                        <DropdownMenuItem
                          data-testid="replications-action-delete-button"
                          variant="destructive"
                          disabled={
                            service.capabilities.replication?.delete ===
                            database.service.capability.StateEnum.disabled
                          }
                          onClick={() => {
                            onDeleteClick(row.original);
                          }}
                          className="w-full"
                        >
                          {t('tableActionDelete')}
                        </DropdownMenuItem>
                      )}
                    </TooltipTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
  return columns;
};
