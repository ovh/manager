import { TFunction } from 'i18next';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { DatatableSortableHeader } from '@/components/data-table/DatatableSortableHeader.component';

interface IndexesTableColumnsProps {
  onDeleteClick: (index: database.opensearch.Index) => void;
  service: database.Service;
  t: TFunction;
}
export const getIndexesColumns = ({
  onDeleteClick,
  service,
  t,
}: IndexesTableColumnsProps) => {
  const columns: ColumnDef<database.opensearch.Index>[] = [
    {
      id: 'index',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadIndex')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'shards',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadShards')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.shardsNumber,
    },
    {
      id: 'replicas',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadReplicas')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.replicasNumber,
    },
    {
      id: 'size',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadSize')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.size,
    },
    {
      id: 'documents',
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadDocuments')}
        </DatatableSortableHeader>
      ),
      accessorFn: (row) => row.documents,
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DatatableSortableHeader column={column}>
          {t('tableIndexHeadCreatedAt')}
        </DatatableSortableHeader>
      ),
      cell: ({ row }) => (
        <FormattedDate date={new Date(row.original.createdAt)} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      data-testid="indexes-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="indexes-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      {service.capabilities.indexes?.delete && (
                        <DropdownMenuItem
                          data-testid="indexes-action-delete-button"
                          variant="destructive"
                          disabled={
                            service.capabilities.indexes?.delete ===
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
