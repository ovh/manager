import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { useTasks } from '@/hooks';

export const OngoingTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [loadMore, setLoadMore] = useState(false);
  const [tasksDiplayed, setTasksDiplayed] = useState([]);
  const { data } = useTasks();

  useEffect(() => {
    setTasksDiplayed(loadMore ? data : data?.slice(0, 5));
  }, [loadMore, data]);

  return (
    <div data-testid="ongoingtasks" className="flex flex-col">
      {tasksDiplayed?.map((task) => (
        <span key={task.id}>{`${task.type} ${task.message}`}</span>
      ))}
      {data?.length > 5 && (
        <OsdsLink className="mt-5" onClick={() => setLoadMore(!loadMore)}>
          <span slot="start"></span>
          {!loadMore
            ? t('zimbra_dashboard_tile_status_ongoingTask_viewMore')
            : t('zimbra_dashboard_tile_status_ongoingTask_viewLess')}
          <span slot="end">
            <OsdsIcon
              className="ml-3"
              name={
                !loadMore
                  ? ODS_ICON_NAME.CHEVRON_DOWN
                  : ODS_ICON_NAME.CHEVRON_UP
              }
              size={ODS_ICON_SIZE.xs}
            ></OsdsIcon>
          </span>
        </OsdsLink>
      )}
    </div>
  );
};
