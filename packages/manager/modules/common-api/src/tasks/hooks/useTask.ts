import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UseTaskParams = {
  resourceUrl: string;
  apiVersion?: 'v2' | 'v6';
  taskId?: number | string;
  queryKey?: string[];
  onSuccess?: () => void;
  onError?: () => void;
  onFinish?: () => void;
  refetchIntervalTime?: number;
};

export type TaskStatus = 'DONE' | 'PENDING' | 'RUNNING' | 'ERROR';

export interface TaskResponse {
  status: TaskStatus;
}

export const getDefaultQueryKey = (taskId: number | string) => ['manage-task', taskId];

export const useTask = ({
  resourceUrl,
  apiVersion = 'v2',
  taskId,
  queryKey,
  onSuccess,
  onError,
  onFinish,
  refetchIntervalTime = 2000,
}: UseTaskParams) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const { error } = useQuery<ApiResponse<TaskResponse>, ApiError>({
    staleTime: 0,
    queryKey: queryKey || getDefaultQueryKey(taskId || resourceUrl),
    queryFn: async () => {
      const url = `/${resourceUrl
        .split('/')
        .filter(Boolean)
        .concat(['task', taskId as string])
        .join('/')}`;

      try {
        setIsPending(true);
        const result = await apiClient[apiVersion].get<TaskResponse>(url);
        const data: TaskResponse = result.data;

        if (apiVersion === 'v2') {
          if (data?.status === 'DONE') {
            setIsPending(false);
            setIsSuccess(true);
            setIsError(false);
            onSuccess?.();
            onFinish?.();
          }
          if (data?.status === 'ERROR') {
            setIsPending(false);
            setIsSuccess(false);
            setIsError(true);
            onError?.();
            onFinish?.();
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw result;
          }
        }
        return result;
      } catch (err) {
        if (apiVersion === 'v6') {
          const apiError = err as ApiError;
          if (apiError?.response?.status === 404) {
            setIsPending(false);
            setIsSuccess(true);
            setIsError(false);
            onSuccess?.();
          } else {
            setIsPending(false);
            setIsError(true);
            setIsSuccess(false);
            onError?.();
          }
          onFinish?.();
        }
        throw err;
      }
    },
    enabled: !!taskId,
    retry: false,
    refetchInterval: (query) => {
      if (apiVersion === 'v6') {
        return query.state.status !== 'error' ? refetchIntervalTime : undefined;
      }
      return !['DONE', 'ERROR'].includes(query.state.data?.data?.status || '')
        ? refetchIntervalTime
        : undefined;
    },
  });

  return {
    error,
    isError,
    isPending,
    isSuccess,
  };
};
