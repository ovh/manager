import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsIcon, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
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
        <OdsLink
          className="mt-5"
          color={ODS_LINK_COLOR.primary}
          onClick={() => setLoadMore(!loadMore)}
          href="#"
        >
          <span slot="start"></span>
          {!loadMore
            ? t('zimbra_dashboard_tile_status_ongoingTask_viewMore')
            : t('zimbra_dashboard_tile_status_ongoingTask_viewLess')}
          <span slot="end">
            <OdsIcon
              className="ml-3"
              name={
                !loadMore ? ODS_ICON_NAME.chevronDown : ODS_ICON_NAME.chevronUp
              }
            ></OdsIcon>
          </span>
        </OdsLink>
      )}
    </div>
  );
};
