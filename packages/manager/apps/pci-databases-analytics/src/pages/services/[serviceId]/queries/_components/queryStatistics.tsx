import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { useGetQueryStatistics } from '@/hooks/api/queries.api.hooks';
import { useServiceData } from '../../layout';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { ExpandableSqlQuery } from './ExpandableSqlQuery';
import { H3, P } from '@/components/typography';
import { Button } from '@/components/ui/button';

const QueryStatistics = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  const { projectId, service } = useServiceData();
  const queryStatisticsQuery = useGetQueryStatistics(
    projectId,
    service.engine,
    service.id,
  );

  const columns: ColumnDef<database.postgresql.querystatistics.Query>[] = [
    {
      id: 'query',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'rows',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadRows')}</SortableHeader>
      ),
      accessorFn: (row) => row.rows,
    },
    {
      id: 'calls',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadCalls')}</SortableHeader>
      ),
      accessorFn: (row) => row.calls,
    },
    {
      id: 'minTime',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadMinTime')}</SortableHeader>
      ),
      accessorFn: (row) => row.minTime.toFixed(2),
    },
    {
      id: 'maxTime',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeadMaxTime')}</SortableHeader>
      ),
      accessorFn: (row) => row.maxTime.toFixed(2),
    },

    {
      id: 'meamTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadMeanTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.meanTime.toFixed(2),
    },

    {
      id: 'stdDevTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadStDevTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.stddevTime.toFixed(2),
    },
    {
      id: 'totalTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeadTotalTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.totalTime.toFixed(2),
    },
  ];
  return (
    <>
      <H3 className="mb-2">Statistiques de requêtes</H3>
      <P className="mb-2">
        Les statistiques de requêtes rassemblent les statistiques collectées
        dans les schémas de performance. Elles permettent de monitorer les
        évènements serveurs (par exemple, la synchronisation, les tables
        temporaires, les index, les jointures,...)
      </P>
      <Button variant="outline" size="sm" className="mb-2">
        <RotateCcw className="size-4 mr-2" /> Réinitialiser
      </Button>
      {queryStatisticsQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={
            queryStatisticsQuery.data as database.postgresql.querystatistics.Query[]
          }
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default QueryStatistics;
