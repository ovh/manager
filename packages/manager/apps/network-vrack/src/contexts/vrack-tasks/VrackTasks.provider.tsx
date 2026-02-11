import { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useNotifications } from '@ovh-ux/muk';

import { REMOVE_BLOCK_FROM_BRIDGE_DOMAIN_TASK_FUNCTION } from '@/App.constants';
import { useGetVrackTasks } from '@/hooks/tasks/useGetVrackTasks';
import usePrevious from '@/hooks/usePrevious';
import { getVrackIpv4ListKey } from '@/hooks/vrack-ip/useGetVrackIpv4List';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import tasksContext from './vrack-tasks.context';

type Props = {
  serviceName: string;
  children: JSX.Element | JSX.Element[];
};

export const VrackTasksProvider = ({ serviceName, children }: Props): JSX.Element => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const queryClient = useQueryClient();
  const { addInfo, addSuccess, clearNotifications } = useNotifications();
  const { vrackTasks } = useGetVrackTasks({ serviceName });
  const deleteIpTasks = useMemo(
    () =>
      vrackTasks.filter((task) => task.function === REMOVE_BLOCK_FROM_BRIDGE_DOMAIN_TASK_FUNCTION),
    [vrackTasks],
  );
  const previousDeleteIpTasks = usePrevious(deleteIpTasks) ?? [];

  const context = {
    vrackTasks,
  };

  useEffect(() => {
    const updatedDeleteTasksId = deleteIpTasks.map(({ id }) => id);
    const previousDeleteIpTasksIds = previousDeleteIpTasks.map(({ id }) => id);
    const newDeleteTasks = deleteIpTasks.filter(({ id }) => !previousDeleteIpTasksIds.includes(id));

    if (newDeleteTasks.length) {
      clearNotifications();
      addInfo(<Text>{t('publicIpRouting_region_detach_ip_pending')}</Text>);
    }

    const finishedDeleteTasks = previousDeleteIpTasks.filter(
      ({ id }) => !updatedDeleteTasksId.includes(id),
    );
    if (finishedDeleteTasks.length) {
      finishedDeleteTasks.forEach(({ targetDomain }) => {
        clearNotifications();
        addSuccess(
          <Text>{t('publicIpRouting_region_detach_ip_success', { ip: targetDomain })}</Text>,
        );
      });
      void queryClient.invalidateQueries({ queryKey: getVrackIpv4ListKey(serviceName) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteIpTasks, previousDeleteIpTasks]);

  return <tasksContext.Provider value={context}>{children}</tasksContext.Provider>;
};

export default VrackTasksProvider;
