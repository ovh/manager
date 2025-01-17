import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/data-table';
import { ExpandableSqlQuery } from './ExpandableSqlQuery.component';
import * as database from '@/types/cloud/project/database';

export const getColumns = (engine: database.EngineEnum) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );

  if (engine === database.EngineEnum.postgresql) {
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
        id: 'meanTime',
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
  }

  // MySQL Columns
  return [
    {
      id: 'digestText',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadName')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.digestText,
      cell: ({ row }) => (
        <ExpandableSqlQuery sqlQuery={row.original.digestText} />
      ),
    },
    {
      id: 'sumRowsSent',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadRows')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.sumRowsSent,
    },
    {
      id: 'countStar',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadCalls')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.countStar,
    },
    {
      id: 'minTimerWait',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMinTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.minTimerWait.toFixed(2),
    },
    {
      id: 'maxTimerWait',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMaxTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.maxTimerWait.toFixed(2),
    },
    {
      id: 'meanTime',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadMeanTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => (row.sumTimerWait / row.countStar).toFixed(2),
    },
    {
      id: 'sumTimerWait',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableQueryStatisticsHeadTotalTime')}
        </DataTable.SortableHeader>
      ),
      accessorFn: (row) => row.sumTimerWait.toFixed(2),
    },
  ] as ColumnDef<database.mysql.querystatistics.Query>[];
};
