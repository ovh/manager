import {
  Query,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { getOperation, getOperations } from '@/data/api/operation';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/domain/entities/operations';
import {
  operationsQueryKey,
  operationQueryKey,
} from '@/adapters/tanstack/operations/queryKeys';
import {
  isInstanceCreationOperationPendingOrInError,
  isOperationInError,
  isOperationInProgress,
} from '@/domain/services/operations.service';

const POLLING_INTERVAL = 8000;

type TUseInstanceCreationPolling = {
  operationsCount: number;
  hasError: boolean;
};

const getOperationsData = (
  results: UseQueryResult<TOperation>[],
): TOperation[] =>
  results.map(({ data }) => data).filter(Boolean) as TOperation[];

export const useInstanceCreationPolling = (): TUseInstanceCreationPolling => {
  const projectId = useProjectId();

  const { data: operations = [] } = useQuery({
    queryKey: operationsQueryKey(projectId),
    queryFn: () => getOperations(projectId),
    select: (data) => data.filter(isInstanceCreationOperationPendingOrInError),
  });

  const polledOperations = useQueries({
    queries: operations.map((operation) => ({
      queryKey: operationQueryKey(projectId, operation.id),
      queryFn: () => getOperation(projectId, operation.id),
      refetchInterval: (query: Query<TOperation>) =>
        isOperationInProgress(query.state.data) ? POLLING_INTERVAL : false,
      refetchIntervalInBackground: true,
      gcTime: 0,
    })),
    combine: getOperationsData,
  });

  const hasError = useMemo(() => polledOperations.some(isOperationInError), [
    polledOperations,
  ]);

  const operationsCount = useMemo(
    () => polledOperations.filter(isOperationInProgress).length,
    [polledOperations],
  );

  return {
    operationsCount,
    hasError,
  };
};
