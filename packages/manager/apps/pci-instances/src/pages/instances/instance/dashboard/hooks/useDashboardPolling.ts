import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { TInstance, TPartialInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  shouldRetryAfter404Error,
  TPendingTask,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { updateAllInstancesFromCache } from '@/adapters/tanstack-query/store/instances/updaters';

type TDashboardPollingArgs = {
  instanceId: string;
  region: string;
  pendingTasks: TPendingTask[];
};

export const useDashboardPolling = ({
  instanceId,
  region,
  pendingTasks,
}: TDashboardPollingArgs) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { task, actions, status, pricings } = instance;
      const isDeleted = !task.isPending && status === 'DELETED';
      const deletedInstance = { addresses: new Map(), volumes: [] };
      const newInstance: TPartialInstance = {
        id: instanceId,
        actions,
        status,
        task,
        pricings,
      };

      updateAllInstancesFromCache(queryClient, {
        projectId,
        region,
        instance: isDeleted
          ? { ...newInstance, ...deletedInstance }
          : newInstance,
      });

      if (!task.isPending) {
        clearNotifications();
        addSuccess(
          t(`pci_instances_actions_instance_success_message`, {
            name: instance.name,
          }),
          true,
        );
      }
    },
    [
      queryClient,
      projectId,
      instanceId,
      clearNotifications,
      addSuccess,
      t,
      region,
    ],
  );

  const handlePollingError = useCallback(
    (error: ApiError) => {
      if (error.response?.status === 404) {
        updateAllInstancesFromCache(queryClient, {
          projectId,
          region,
          instance: {
            id: instanceId,
            actions: [],
            status: 'DELETED',
            task: {
              isPending: false,
              status: null,
            },
            addresses: new Map(),
            volumes: [],
          },
        });
      }
    },
    [projectId, queryClient, instanceId, region],
  );

  const pollingData = useInstancesPolling(
    pendingTasks,
    {
      onSuccess: handlePollingSuccess,
      onError: handlePollingError,
    },
    { retry: shouldRetryAfter404Error },
  );

  return pollingData;
};
