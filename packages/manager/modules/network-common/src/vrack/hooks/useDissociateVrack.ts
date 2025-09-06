import React from 'react';

import { UseMutateFunction, useMutation } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';

import { VrackTask } from '../../types';
import { useVrackService } from '../../vrack-services';
import { dissociateVrackServices, dissociateVrackServicesQueryKey } from '../api';

export type UseDissociateVrackParams = {
  vrackServicesId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export type UseDissociateVrackReturn = {
  dissociateVs: UseMutateFunction<ApiResponse<VrackTask>, ApiError, void, unknown>;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
};

export const useDissociateVrack = ({
  vrackServicesId,
  onSuccess,
  onError,
}: UseDissociateVrackParams): UseDissociateVrackReturn => {
  const [taskId, setTaskId] = React.useState<string>();
  const { data: vs } = useVrackService();

  const {
    isPending: isTaskPending,
    error: taskError,
    isError: isTaskError,
    isSuccess,
  } = useTask({
    resourceUrl: `/vrack/${vs?.currentState?.vrackId ?? ''}`,
    apiVersion: 'v6',
    taskId,
    onSuccess,
    onError,
    onFinish: () => {
      setTaskId(undefined);
    },
  }) as UseDissociateVrackReturn;

  const {
    mutate: dissociateVs,
    isPending,
    isError,
    error,
  } = useMutation<ApiResponse<VrackTask>, ApiError>({
    mutationFn: () =>
      dissociateVrackServices({
        vrack: vs?.currentState?.vrackId ?? '',
        vrackServices: vrackServicesId,
      }),
    mutationKey: dissociateVrackServicesQueryKey(vrackServicesId),
    onSuccess: (task) => {
      setTaskId(task.data.id.toString());
    },
    onError,
    retry: (_, err) => err?.response?.status === 409,
  });

  return {
    dissociateVs,
    isPending: isPending || isTaskPending,
    isError: isError || isTaskError,
    error: error ?? taskError ?? null,
    isSuccess,
  };
};
