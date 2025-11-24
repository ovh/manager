import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { DatagridColumn, useFormatDate } from '@ovh-ux/muk';

import { TaskDetailsType } from '@/data/types/product/webHosting';

export default function useDatagridColumn() {
  const { t } = useTranslation('task');
  const formatDate = useFormatDate();
  const StatusColor = {
    cancelled: BADGE_COLOR.information,
    doing: BADGE_COLOR.information,
    done: BADGE_COLOR.success,
    init: BADGE_COLOR.information,
    todo: BADGE_COLOR.information,
    error: BADGE_COLOR.information,
    ovhError: BADGE_COLOR.information,
  };

  const columns: DatagridColumn<TaskDetailsType>[] = [
    {
      id: 'task',
      accessorFn: (row) => row.function,
      cell: (props: { row: { original: TaskDetailsType } }) => (
        <>
          {t(`hosting_tab_TASKS_function_${props.row.original.function?.replace('/', '_')}`, {
            defaultValue: props.row.original.function,
          })}
        </>
      ),
      header: t('hosting_tab_TASKS_table_function'),
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      cell: (props: { row: { original: TaskDetailsType } }) => (
        <Badge className="my-3" color={StatusColor[props.row.original.status]}>
          {t(`hosting_tab_TASKS_status_${props.row.original.status?.toLowerCase()}`)}
        </Badge>
      ),
      header: t('hosting_tab_TASKS_table_state'),
    },
    {
      id: 'startDate',
      accessorFn: (row) => row.startDate,
      cell: (props: { row: { original: TaskDetailsType } }) => (
        <>{formatDate({ date: props.row.original.startDate, format: 'Pp' })}</>
      ),
      header: t('hosting_tab_TASKS_table_start_date'),
    },
    {
      id: 'finishDate',
      accessorFn: (row) => row.doneDate,
      cell: (props: { row: { original: TaskDetailsType } }) =>
        props.row.original.doneDate ? (
          <>{formatDate({ date: props.row.original.doneDate, format: 'Pp' })}</>
        ) : null,
      header: t('hosting_tab_TASKS_table_finish_date'),
    },
  ];

  return columns;
}
