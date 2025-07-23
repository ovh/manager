import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { Loading } from '@/components';
import { TaskStatus, TaskType } from '@/data/api';
import { useTasks } from '@/data/hooks';

const defaultNumberToShow = 5;
const isOngoing = (task: TaskType) =>
  task.status !== TaskStatus.DONE && task.status !== TaskStatus.ERROR;

export const OngoingTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [loadMore, setLoadMore] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { data, isError, isPending } = useTasks();

  const ongoingTasks = useMemo(() => {
    return data?.filter(isOngoing);
  }, [data]);

  useEffect(() => {
    setTasks(loadMore ? ongoingTasks : ongoingTasks?.slice(0, defaultNumberToShow));
  }, [loadMore, data]);

  return (
    <div className="flex flex-col" data-testid="ongoingtasks">
      {tasks?.length ? (
        <ul className="pl-9 flex flex-col gap-3">
          {tasks?.map((task) => (
            <li key={task.id}>
              <OdsText preset={ODS_TEXT_PRESET.span}>{task.message}</OdsText>
            </li>
          ))}
        </ul>
      ) : null}
      {ongoingTasks?.length > defaultNumberToShow && (
        <OdsLink
          className="mt-5 ml-9"
          color={ODS_LINK_COLOR.primary}
          onClick={(e) => {
            e?.preventDefault();
            setLoadMore(!loadMore);
          }}
          href="#"
          label={
            !loadMore
              ? t('zimbra_dashboard_tile_status_ongoingTask_viewMore')
              : t('zimbra_dashboard_tile_status_ongoingTask_viewLess')
          }
          icon={!loadMore ? ODS_ICON_NAME.chevronDown : ODS_ICON_NAME.chevronUp}
        ></OdsLink>
      )}
      {(!tasks?.length || isError) && !isPending && (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_dashboard_tile_status_ongoingTask_none')}
        </OdsText>
      )}
      {isPending && <Loading size={ODS_SPINNER_SIZE.xs} />}
    </div>
  );
};

export default OngoingTasks;
