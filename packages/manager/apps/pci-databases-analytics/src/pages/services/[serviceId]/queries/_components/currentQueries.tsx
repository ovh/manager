import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { useGetCurrentQueries } from '@/hooks/api/queries.api.hooks';
import { useServiceData } from '../../layout';
import { H3, P } from '@/components/typography';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { ExpandableSqlQuery } from './ExpandableSqlQuery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const CurrentQueries = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { projectId, service } = useServiceData();
  const currentQueriesQuery = useGetCurrentQueries(
    projectId,
    service.engine,
    service.id,
  );

  const columns: ColumnDef<database.service.currentqueries.Query>[] = [
    {
      id: 'query',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'pid',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadPid')}</SortableHeader>
      ),
      accessorFn: (row) => row.pid,
    },
    {
      id: 'queryDuration',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadQueryDuration')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.queryDuration,
    },
    {
      id: 'databaseName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadDatabaseName')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.databaseName,
    },
    {
      id: 'clientIp',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadClientIp')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.clientIp,
    },
    {
      id: 'applicationName',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadApplicationName')}
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
              //     disabled={
              //       service.capabilities.users?.update ===
              //       database.service.capability.StateEnum.disabled
              //     }
              //     onClick={() => {
              //       toast.toast({
              //         title: t('tableActionsMenuNotImplementedYet'),
              //       });
              //     }}
              >
                {t('tableActionsMenuTerminateQuery')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <H3 className="mb-2">Requêtes en cours</H3>
      <P className="mb-2">Liste des requêtes en cours d'exécution</P>

      {currentQueriesQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={currentQueriesQuery.data}
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default CurrentQueries;
