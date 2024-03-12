import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  CancelQueryProps,
  QueryStatistics,
  cancelCurrentQuery,
  getCurrentQueries,
  getQueryStatistics,
  resetQueryStatistics,
} from '@/api/databases/queries';
import { ServiceData } from '@/api/databases';

export function useGetCurrentQueries(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'currentQueries'];
  return useQuery({
    queryKey,
    queryFn: () => getCurrentQueries({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.currentqueries.Query[], Error>;
}

interface MutateCurrentQueryProps {
  onError: (cause: Error) => void;
  onSuccess: (
    database: database.service.currentqueries.query.CancelResponse,
  ) => void;
}
export function useCancelCurrentQuery({
  onError,
  onSuccess,
}: MutateCurrentQueryProps) {
  const mutation = useMutation({
    mutationFn: (currentQueryInfo: CancelQueryProps) => {
      return cancelCurrentQuery(currentQueryInfo);
    },
    onError,
    onSuccess,
  });

  return {
    cancelCurrentQuery: (currentQueryInfo: CancelQueryProps) => {
      return mutation.mutate(currentQueryInfo);
    },
    ...mutation,
  };
}

export function useGetQueryStatistics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'queryStatistics',
  ];
  return useQuery({
    queryKey,
    queryFn: () => getQueryStatistics({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<QueryStatistics[], Error>;
}

interface MutateQuerStatisticsyProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
export function useResetQueryStatistics({
  onError,
  onSuccess,
}: MutateQuerStatisticsyProps) {
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return resetQueryStatistics(serviceInfo);
    },
    onError,
    onSuccess,
  });

  return {
    resetQueryStatistics: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
