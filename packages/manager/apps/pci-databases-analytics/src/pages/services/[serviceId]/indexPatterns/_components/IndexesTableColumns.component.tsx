import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';
import { SortableHeader } from '@/components/ui/data-table';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

interface IndexesTableColumnsProps {
  onDeleteClick: (index: database.opensearch.Index) => void;
}
export const getIndexesColumns = ({
  onDeleteClick,
}: IndexesTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const columns: ColumnDef<database.opensearch.Index>[] = [
    {
      id: 'index',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadIndex')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'shards',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadShards')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.shardsNumber,
    },
    {
      id: 'replicas',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadReplicas')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.replicasNumber,
    },
    {
      id: 'size',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadSize')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.size,
    },
    {
      id: 'documents',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadDocuments')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.documents,
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableIndexHeadCreatedAt')}
        </SortableHeader>
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
