import React from 'react';
import { useTask } from '@ovhcloud/manager-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VrackTask } from '../vrack.type';
import {
  dissociateVrackServices,
  dissociateVrackServicesQueryKey,
} from '../delete';
import { useVrackService } from '@/data/vrack-services';

export type UseDissociateVrackParams = {
  vrackServicesId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export const useDissociateVrack = ({
  vrackServicesId,
  onSuccess,
  onError,
}: UseDissociateVrackParams) => {
  const [taskId, setTaskId] = React.useState<string>();
  const { data: vs } = useVrackService();

  const {
    isPending: isTaskPending,
    error: taskError,
    isError: isTaskError,
    isSuccess,
  } = useTask({
    resourceUrl: `/vrack/${vs?.currentState?.vrackId}`,
    apiVersion: 'v6',
    taskId,
    onSuccess,
    onError,
    onFinish: () => {
      setTaskId(undefined);
    },
  });

  const { mutate: dissociateVs, isPending, isError, error } = useMutation<
    ApiResponse<VrackTask>,
    ApiError
  >({
    mutationFn: () =>
      dissociateVrackServices({
        vrack: vs?.currentState?.vrackId,
        vrackServices: vrackServicesId,
      }),
    mutationKey: dissociateVrackServicesQueryKey(vrackServicesId),
    onSuccess: (task) => {
      setTaskId(task.data.id.toString());
    },
    onError,
    retry: (_, err) => err?.response?.status === 409,
  });

  console.log({ isError, error, isTaskError, taskError });

  return {
    dissociateVs,
    isPending: isPending || isTaskPending,
    isError: isError || isTaskError,
    error: error || taskError,
    isSuccess,
  };
};
