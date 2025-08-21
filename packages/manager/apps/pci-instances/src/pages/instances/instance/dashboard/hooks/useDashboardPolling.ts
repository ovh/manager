import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { TInstance, TInstanceTaskStatus } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  shouldRetryAfter404Error,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { updateInstancesFromCache } from '@/data/hooks/instance/useInstances';

type TDashboardPollingArgs = {
  region: string;
  instanceId: string;
  taskStatus?: TInstanceTaskStatus;
};

export const useDashboardPolling = ({
  region,
  instanceId,
  taskStatus,
}: TDashboardPollingArgs) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');
  const pendingTasks = taskStatus?.isPending ? [{ region, instanceId }] : [];

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { task, actions, status } = instance;

      updateInstancesFromCache(queryClient, {
        projectId,
        instance: {
          id: instanceId,
          actions,
          status,
          taskState: task.status ?? '',
          pendingTask: task.isPending,
        },
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
    [queryClient, projectId, instanceId, clearNotifications, addSuccess, t],
  );

  const handlePollingError = useCallback(
    (error: ApiError) => {
      if (error.response?.status === 404) {
        updateInstancesFromCache(queryClient, {
          projectId,
          instance: {
            id: instanceId,
            actions: [],
            status: 'DELETED',
            taskState: '',
            pendingTask: false,
          },
        });
      }
    },
    [projectId, queryClient, instanceId],
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
