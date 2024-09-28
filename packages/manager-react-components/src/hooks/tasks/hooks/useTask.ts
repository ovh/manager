import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../useCoreApiClient';
import { ManagerReactComponentContext } from '../../../context/ManagerReactComponentsContext';

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

export const getDefaultQueryKey = (taskId: number | string) => [
  'manage-task',
  taskId,
];

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
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const { error } = useQuery<
    ApiResponse<{ status: 'DONE' | 'PENDING' | 'RUNNING' }>,
    ApiError
  >({
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
        const result = await apiClient[apiVersion].get(url);
        if (apiVersion === 'v2') {
          if (result.data?.status === 'DONE') {
            setIsPending(false);
            setIsSuccess(true);
            setIsError(false);
            onSuccess?.();
            onFinish?.();
          }
          if (result.data?.status === 'ERROR') {
            setIsPending(false);
            setIsSuccess(false);
            setIsError(true);
            onError?.();
            onFinish?.();
            throw result;
          }
        }
        return result;
      } catch (err) {
        if (apiVersion === 'v6') {
          if (err?.response?.status === 404) {
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
      return !['DONE', 'ERROR'].includes(query.state.data?.data?.status)
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
