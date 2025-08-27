import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { updateInstancesFromCache } from '@/data/hooks/instance/useInstances';
import { TInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import { buildPartialInstanceDto } from '@/data/hooks/instance/builder/instanceDto.builder';
import {
  shouldRetryAfter404Error,
  TPendingTask,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { selectPollingDataForDatagrid } from '../view-models/selectPollingDataForDatagrid';

const getPartialDeletedInstanceDto = (id: string) =>
  buildPartialInstanceDto({ id })
    .with('actions', [])
    .with('addresses', [])
    .with('volumes', [])
    .with('status', 'DELETED')
    .with('pendingTask', false)
    .build();

const getPartialInstanceDto = (instance: TInstance) =>
  buildPartialInstanceDto({ id: instance.id })
    .with('actions', instance.task.isPending ? [] : instance.actions)
    .with('status', instance.status)
    .with('pendingTask', instance.task.isPending)
    .with('taskState', instance.task.status ?? '')
    .build();

export const useDatagridPolling = (pendingTasks: TPendingTask[]) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { status, task } = instance;
      const isDeleted = !task.isPending && status === 'DELETED';
      const deletedInstance = getPartialDeletedInstanceDto(instance.id);
      updateInstancesFromCache(queryClient, {
        projectId,
        instance: isDeleted ? deletedInstance : getPartialInstanceDto(instance),
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
        const deletedInstance = getPartialDeletedInstanceDto(instanceId);
        updateInstancesFromCache(queryClient, {
          projectId,
          instance: deletedInstance,
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
