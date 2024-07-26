import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/ui/data-table';
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
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadName')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.query,
      cell: ({ row }) => <ExpandableSqlQuery sqlQuery={row.original.query} />,
    },
    {
      id: 'rows',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadRows')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.rows,
    },
    {
      id: 'calls',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadCalls')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.calls,
    },
    {
      id: 'minTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMinTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.minTime.toFixed(2),
    },
    {
      id: 'maxTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMaxTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.maxTime.toFixed(2),
    },

    {
      id: 'meamTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMeanTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.meanTime.toFixed(2),
    },

    {
      id: 'stdDevTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadStdDevTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.stddevTime.toFixed(2),
    },
    {
      id: 'totalTime',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableQueryStatisticsHeadTotalTime')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.totalTime.toFixed(2),
    },
  ] as ColumnDef<database.postgresql.querystatistics.Query>[];
};
