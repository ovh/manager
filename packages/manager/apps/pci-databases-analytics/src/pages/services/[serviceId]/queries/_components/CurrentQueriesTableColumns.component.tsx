import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import { ExpandableSqlQuery } from './ExpandableSqlQuery.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';

interface CurrentQueriesListColumnsProps {
  onCancelQueryClicked: (query: database.service.currentqueries.Query) => void;
}
export const getColumns = ({
  onCancelQueryClicked,
}: CurrentQueriesListColumnsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { service } = useServiceData();
  return [
    {
      id: 'query',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'pid',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadPid')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.pid,
    },
    {
      id: 'queryDuration',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadQueryDuration')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.queryDuration,
    },
    {
      id: 'databaseName',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadDatabaseName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.databaseName,
    },
    {
      id: 'clientIp',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadClientIp')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.clientIp,
    },
    {
      id: 'applicationName',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableCurrentQueriesHeadApplicationName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.applicationName,
    },
    {
      id: MENU_COLUMN_ID,
      cell: ({ row }) => (
        <div className="w-full text-right pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="current-queries-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {service.capabilities.currentQueriesCancel && (
                <DropdownMenuItem
                  data-testid="current-queries-action-cancel-button"
                  variant="destructive"
                  onClick={() => onCancelQueryClicked(row.original)}
                  disabled={
                    service.capabilities.currentQueriesCancel.create ===
                    database.service.capability.StateEnum.disabled
                  }
                >
                  {t('tableCurrentQueriesActionsMenuTerminateQuery')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ] as ColumnDef<database.service.currentqueries.Query>[];
};
