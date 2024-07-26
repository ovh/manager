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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConnectionPoolWithData } from '../Pools.page';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';

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
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.name,
    },
    {
      id: 'database',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadDatabase')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.database.name,
    },
    {
      id: 'mode',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadMode')}</SortableHeader>
      ),
      accessorFn: (row) => row.mode,
    },
    {
      id: 'size',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadSize')}</SortableHeader>
      ),
      accessorFn: (row) => row.size,
    },
    {
      id: 'username',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadUsername')}
        </SortableHeader>
      ),
      accessorFn: (row) => (row.user ? row.user.username : ''),
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
