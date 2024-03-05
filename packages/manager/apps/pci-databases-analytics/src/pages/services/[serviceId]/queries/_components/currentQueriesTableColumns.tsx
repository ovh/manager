import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/ui/data-table';
import { ExpandableSqlQuery } from './ExpandableSqlQuery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { database } from '@/models/database';

interface CurrentQueriesListColumnsProps {
  onCancelQueryClicked: (query: database.service.currentqueries.Query) => void;
}
export const getColumns = ({
  onCancelQueryClicked,
}: CurrentQueriesListColumnsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  return [
    {
      id: 'query',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadName')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'pid',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadPid')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.pid,
    },
    {
      id: 'queryDuration',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadQueryDuration')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.queryDuration,
    },
    {
      id: 'databaseName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadDatabaseName')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.databaseName,
    },
    {
      id: 'clientIp',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadClientIp')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.clientIp,
    },
    {
      id: 'applicationName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableCurrentQueriesHeadApplicationName')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.applicationName,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="w-full text-right pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onCancelQueryClicked(row.original)}
              >
                {t('tableCurrentQueriesActionsMenuTerminateQuery')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ] as ColumnDef<database.service.currentqueries.Query>[];
};
