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
import * as ai from '@/types/cloud/project/ai';
import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';

interface DatastoreTableColumnsProps {
  onDeleteClick: (datastore: ai.DataStore) => void;
}
export const getColumns = ({ onDeleteClick }: DatastoreTableColumnsProps) => {
  const { t } = useTranslation('pci-ai-dashboard/datastores');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<DataStoresWithRegion>[] = [
    {
      id: 'alias',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadAlias')}</SortableHeader>
      ),
      accessorFn: (row) => row.alias,
    },
    {
      id: 'endpoint',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadEndpoint')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.endpoint,
    },
    {
      id: 'region',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadRegion')}</SortableHeader>
      ),
      accessorFn: (row) => tRegions(`region_${row.region}`),
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
                      data-testid="datastore-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="datastore-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        data-testid="datastore-action-delete-button"
                        variant="destructive"
                        onClick={() => {
                          onDeleteClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionDelete')}
                      </DropdownMenuItem>
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
