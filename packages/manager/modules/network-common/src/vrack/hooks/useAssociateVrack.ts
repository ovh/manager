import React from 'react';

import { UseMutationResult, useMutation } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';

import { Task } from '../../types';
import { associateVrackServices, associateVrackServicesQueryKey } from '../api';

export type UseAssociateVrackParams = {
  vrackServicesId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export type UseAssociateVrackReturn = {
  associateVs: UseMutationResult<ApiResponse<Task>, ApiError, { vrackId: string }>['mutate'];
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
};

export const useAssociateVrack = ({
  vrackServicesId,
  onSuccess,
  onError,
}: UseAssociateVrackParams): UseAssociateVrackReturn => {
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
  }) as UseAssociateVrackReturn;

  const {
    mutate: associateVs,
    isPending,
    isError,
    error,
  } = useMutation<ApiResponse<Task>, ApiError, { vrackId: string }>({
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
    error: error ?? taskError ?? null,
    isSuccess,
  };
};
