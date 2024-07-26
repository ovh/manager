import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SortableHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';

interface DatabasesTableColumnsProps {
  onDeleteClick: (db: database.service.Database) => void;
}
export const getColumns = ({ onDeleteClick }: DatabasesTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/databases',
  );
  const columns: ColumnDef<database.service.Database>[] = [
    {
      id: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.name,
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
                      variant="menu"
                      size="menu"
                      data-testid="databases-action-trigger"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="namepaces-menu-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        data-testid="databases-action-delete-button"
                        variant="destructive"
                        disabled={
                          row.original.default ||
                          service.capabilities.databases?.delete ===
                            database.service.capability.StateEnum.disabled
                        }
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
                {row.original.default && (
                  <TooltipContent>
                    {t('tableActionDeleteDisabledMessage')}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
  return columns;
};
