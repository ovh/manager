import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { Badge, DataGridTextCell, useFormatDate } from '@ovh-ux/manager-react-components';

import { TaskDetailsType } from '@/data/types/product/webHosting';

export default function useDatagridColumn() {
  const { t } = useTranslation('task');
  const formatDate = useFormatDate();

  const StatusColor = {
    cancelled: ODS_BADGE_COLOR.information,
    doing: ODS_BADGE_COLOR.information,
    done: ODS_BADGE_COLOR.success,
    init: ODS_BADGE_COLOR.information,
    todo: ODS_BADGE_COLOR.information,
    error: ODS_BADGE_COLOR.information,
    ovhError: ODS_BADGE_COLOR.information,
  };

  const columns = [
    {
      id: 'task',
      cell: (props: TaskDetailsType) => (
        <DataGridTextCell>
          {t(`hosting_tab_TASKS_function_${props?.function?.replace('/', '_')}`, {
            defaultValue: props?.function,
          })}
        </DataGridTextCell>
      ),
      label: t('hosting_tab_TASKS_table_function'),
    },
    {
      id: 'status',
      cell: (props: TaskDetailsType) => (
        <DataGridTextCell>
          <Badge
            label={t(`hosting_tab_TASKS_status_${props?.status?.toLowerCase()}`)}
            className="my-3"
            color={StatusColor[props?.status]}
          />
        </DataGridTextCell>
      ),
      label: t('hosting_tab_TASKS_table_state'),
    },
    {
      id: 'startDate',
      cell: (props: TaskDetailsType) => {
        return (
          <DataGridTextCell>
            {formatDate({ date: props?.startDate, format: 'Pp' })}
          </DataGridTextCell>
        );
      },
      label: t('hosting_tab_TASKS_table_start_date'),
    },
    {
      id: 'finishDate',
      cell: (props: TaskDetailsType) =>
        props.doneDate && (
          <DataGridTextCell>{formatDate({ date: props?.doneDate, format: 'Pp' })}</DataGridTextCell>
        ),
      label: t('hosting_tab_TASKS_table_finish_date'),
    },
  ];

  return columns;
}
