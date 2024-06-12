import React from 'react';
import { useTask } from '@ovhcloud/manager-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { Task } from '../../api.type';
import {
  associateVrackServices,
  associateVrackServicesQueryKey,
} from '../post';

export type UseAssociateVrackParams = {
  vrackServicesId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export const useAssociateVrack = ({
  vrackServicesId,
  onSuccess,
  onError,
}: UseAssociateVrackParams) => {
  const [vrack, setVrack] = React.useState<string>();
  const [taskId, setTaskId] = React.useState<string>();

  const {
    isPending: isTaskPending,
    error: taskError,
    isError: isTaskError,
    isSuccess,
  } = useTask({
    resourceUrl: `/vrack/${vrack}`,
    apiVersion: 'v6',
    taskId,
    onSuccess,
    onError,
    onFinish: () => {
      setTaskId(undefined);
    },
  });

  const { mutate: associateVs, isPending, isError, error } = useMutation<
    ApiResponse<Task>,
    ApiError,
    { vrackId: string }
  >({
    mutationFn: async ({ vrackId }) => {
      setVrack(vrackId);
      return associateVrackServices({
        vrack: vrackId,
        vrackServices: vrackServicesId,
      });
    },
    mutationKey: associateVrackServicesQueryKey(vrackServicesId),
    onSuccess: (task) => {
      setTaskId(task.data.id);
    },
    onError,
    retry: (_, err) => err?.response?.status === 409,
  });

  return {
    associateVs,
    isPending: isPending || isTaskPending,
    isError: isError || isTaskError,
    error: error || taskError,
    isSuccess,
  };
};
