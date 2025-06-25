import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { updateInstanceFromCache } from '@/data/hooks/instance/useInstances';
import { TInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';
import { buildPartialInstanceDto } from '@/data/hooks/instance/builder/instanceDto.builder';
import {
  shouldRetryAfter404Error,
  useInstancesPolling,
} from '@/data/hooks/instance/polling/useInstancesPolling';
import { selectPollingDataForDatagrid } from '../view-models/selectPollingDataForDatagrid';

export const getPartialDeletedInstanceDto = (id: string) =>
  buildPartialInstanceDto({ id })
    .with('actions', [])
    .with('addresses', [])
    .with('volumes', [])
    .with('status', 'DELETED')
    .with('pendingTask', false)
    .build();

export const getPartialInstanceDto = (instance: TInstance) =>
  buildPartialInstanceDto({ id: instance.id })
    .with('actions', instance.actions)
    .with('status', instance.state.status.label)
    .with('pendingTask', instance.state.pendingTask)
    .with('taskState', instance.state.taskState)
    .build();

export const useDatagridPolling = (pendingTasks: string[]) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { clearNotifications, addSuccess } = useNotifications();
  const { t } = useTranslation('actions');

  const handlePollingSuccess = useCallback(
    (instance?: TInstance) => {
      if (!instance) return;
      const { state } = instance;
      const isDeleted = !state.pendingTask && state.status.label === 'DELETED';
      const deletedInstance = getPartialDeletedInstanceDto(instance.id);
      updateInstanceFromCache(queryClient, {
        projectId,
        instance: isDeleted ? deletedInstance : getPartialInstanceDto(instance),
      });

      if (!state.pendingTask) {
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
        updateInstanceFromCache(queryClient, {
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

  return selectPollingDataForDatagrid(pollingData);
};
