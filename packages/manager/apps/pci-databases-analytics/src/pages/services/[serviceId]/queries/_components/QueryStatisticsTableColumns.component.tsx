import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/data-table';
import { ExpandableSqlQuery } from './ExpandableSqlQuery.component';
import * as database from '@/types/cloud/project/database';

export const getColumns = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  return [
    {
      id: 'query',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'rows',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadRows')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.rows,
    },
    {
      id: 'calls',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadCalls')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.calls,
    },
    {
      id: 'minTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMinTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.minTime.toFixed(2),
    },
    {
      id: 'maxTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMaxTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.maxTime.toFixed(2),
    },

    {
      id: 'meamTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMeanTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.meanTime.toFixed(2),
    },

    {
      id: 'stdDevTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadStdDevTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.stddevTime.toFixed(2),
    },
    {
      id: 'totalTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadTotalTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.totalTime.toFixed(2),
    },
  ] as ColumnDef<database.postgresql.querystatistics.Query>[];
};
