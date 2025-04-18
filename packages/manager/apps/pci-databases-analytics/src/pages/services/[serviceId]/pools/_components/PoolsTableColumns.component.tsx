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
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { ConnectionPoolWithData } from '../Pools.page';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';

interface ConnectionPoolsTableColumnsProps {
  onGetInformationClick: (connectionPool: ConnectionPoolWithData) => void;
  onEditClick: (connectionPool: ConnectionPoolWithData) => void;
  onDeleteClick: (connectionPool: ConnectionPoolWithData) => void;
}
export const getColumns = ({
  onGetInformationClick,
  onEditClick,
  onDeleteClick,
}: ConnectionPoolsTableColumnsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const { service } = useServiceData();
  const columns: ColumnDef<ConnectionPoolWithData>[] = [
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
      id: 'database',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadDatabase')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.database.name,
    },
    {
      id: 'mode',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadMode')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.mode,
    },
    {
      id: 'size',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadSize')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.size,
    },
    {
      id: 'username',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeadUsername')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => (row.user ? row.user.username : ''),
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
                      data-testid="pools-action-trigger"
                      variant="menu"
                      size="menu"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-testid="pools-action-content"
                    align="end"
                  >
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        data-testid="pools-action-info-button"
                        variant="primary"
                        onClick={() => {
                          onGetInformationClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionGetInformation')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {service.capabilities.connectionPools?.update && (
                        <DropdownMenuItem
                          data-testid="pools-action-edit-button"
                          variant="primary"
                          disabled={
                            service.capabilities.connectionPools?.update ===
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
                      {service.capabilities.connectionPools?.delete && (
                        <DropdownMenuItem
                          data-testid="pools-action-delete-button"
                          variant="destructive"
                          disabled={
                            service.capabilities.connectionPools?.delete ===
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
