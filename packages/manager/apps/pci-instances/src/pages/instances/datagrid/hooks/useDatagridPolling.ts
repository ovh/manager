import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { updateInstancesFromCache } from '@/data/hooks/instance/useInstances';
import { TInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  shouldRetryAfter404Error,
  TPendingTask,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { selectPollingDataForDatagrid } from '../view-models/selectPollingDataForDatagrid';

export const useDatagridPolling = (pendingTasks: TPendingTask[]) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { id, status, task, actions } = instance;
      const isDeleted = !task.isPending && status === 'DELETED';
      const deletedInstance = { addresses: new Map(), volumes: [] };
      const newInstance = { id, actions, status, task };
      updateInstancesFromCache(queryClient, {
        projectId,
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
    [queryClient, projectId, clearNotifications, addSuccess, t],
  );

  const handlePollingError = useCallback(
    (error: ApiError, instanceId: string) => {
      if (error.response?.status === 404) {
        updateInstancesFromCache(queryClient, {
          projectId,
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
    [projectId, queryClient],
  );

  const pollingData = useInstancesPolling(
    pendingTasks,
    {
      onSuccess: handlePollingSuccess,
      onError: handlePollingError,
    },
    { retry: shouldRetryAfter404Error },
  );

  return useMemo(() => selectPollingDataForDatagrid(pollingData), [
    pollingData,
  ]);
};
