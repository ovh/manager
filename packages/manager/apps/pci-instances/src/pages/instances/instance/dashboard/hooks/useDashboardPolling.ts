import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { TInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  shouldRetryAfter404Error,
  TPendingTask,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { buildPartialInstance } from '@/data/hooks/instance/builder/instance.builder';
import { updateDashboardCache } from './useDashboard';

const getPartialDeletedInstance = (id: string) =>
  buildPartialInstance({ id })
    .with('actions', [])
    .with('addresses', new Map())
    .with('volumes', [])
    .with('status', 'DELETED')
    .with('task', {
      isPending: false,
      status: null,
    })
    .build();

const getPartialInstance = (instance: TInstance) =>
  buildPartialInstance({ id: instance.id })
    .with('actions', instance.actions)
    .with('status', instance.status)
    .with('task', {
      isPending: instance.task.isPending,
      status: instance.task.status ?? null,
    })
    .build();

export const useDashboardPolling = (pendingTask: TPendingTask | null) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');
  const pendingTasks = pendingTask ? [pendingTask] : [];

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { status, task } = instance;
      const isDeleted = !task.isPending && status === 'DELETED';
      const deletedInstance = getPartialDeletedInstance(instance.id);
      updateDashboardCache({
        projectId,
        region: pendingTask?.region ?? '',
        instanceId: pendingTask?.instanceId ?? '',
        payload: isDeleted ? deletedInstance : getPartialInstance(instance),
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
        const deletedInstance = getPartialDeletedInstance(instanceId);
        updateDashboardCache({
          projectId,
          region: pendingTask?.region ?? '',
          instanceId,
          payload: deletedInstance,
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

  return pollingData;
};
