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
import { Span } from '@/components/typography';

import { database } from '@/models/database';
import { useServiceData } from '../../layout';
import { GenericUser } from '@/api/databases/users';

interface ConnectionPoolsTableColumnsProps {
  databases: database.service.Database[];
  users: GenericUser[];
  onGetInformationClick: (
    connectionPool: database.postgresql.ConnectionPool,
  ) => void;
  onEditClick: (connectionPool: database.postgresql.ConnectionPool) => void;
  onDeleteClick: (connectionPool: database.postgresql.ConnectionPool) => void;
}
export const getColumns = ({
  databases,
  users,
  onGetInformationClick,
  onEditClick,
  onDeleteClick,
}: ConnectionPoolsTableColumnsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const columns: ColumnDef<database.postgresql.ConnectionPool>[] = [
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
      accessorFn: (row) =>
        databases.find((db) => db.id === row.databaseId).name,
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
      accessorFn: (row) =>
        row.userId ? users.find((user) => user.id === row.userId).username : '',
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
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Span className="sr-only">Open menu</Span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <TooltipTrigger className="w-full">
                      <DropdownMenuItem
                        onClick={() => {
                          onGetInformationClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionGetInformation')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          onEditClick(row.original);
                        }}
                        className="w-full"
                      >
                        {t('tableActionEdit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
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
