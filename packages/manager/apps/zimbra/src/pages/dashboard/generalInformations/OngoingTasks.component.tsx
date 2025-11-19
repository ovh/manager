import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Link, SPINNER_SIZE, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

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
  }, [loadMore, data, ongoingTasks]);

  return (
    <div className="flex flex-col" data-testid="ongoingtasks">
      {tasks?.length ? (
        <ul className="flex flex-col gap-3 pl-9">
          {tasks?.map((task) => (
            <li key={task.id}>
              <Text preset={TEXT_PRESET.span}>{task.message}</Text>
            </li>
          ))}
        </ul>
      ) : null}
      {ongoingTasks?.length > defaultNumberToShow && (
        <Link className="ml-9 mt-5" onClick={() => setLoadMore(!loadMore)} href="#">
          {!loadMore
            ? t('zimbra_dashboard_tile_status_ongoingTask_viewMore')
            : t('zimbra_dashboard_tile_status_ongoingTask_viewLess')}
          <Icon name={loadMore ? ICON_NAME.chevronUp : ICON_NAME.chevronDown} />
        </Link>
      )}
      {(!tasks?.length || isError) && !isPending && (
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_dashboard_tile_status_ongoingTask_none')}
        </Text>
      )}
      {isPending && <Loading size={SPINNER_SIZE.xs} />}
    </div>
  );
};

export default OngoingTasks;
