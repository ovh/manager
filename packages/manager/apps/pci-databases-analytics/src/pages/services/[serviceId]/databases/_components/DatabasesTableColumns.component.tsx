import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';
import DataTable from '@/components/data-table';

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
        <DataTable.SortableHeader column={column}>
          {t('tableHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.name,
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
