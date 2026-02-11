/* eslint-disable max-lines-per-function */
import {
  Query,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { getOperation, getOperations } from '@/data/api/operation';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/domain/entities/operations';
import {
  operationsQueryKey,
  operationQueryKey,
} from '@/adapters/tanstack/operations/queryKeys';
import {
  isInstanceCreationOperationFailed,
  isInstanceCreationOperationPending,
  isInstanceCreationOperationPendingOrInError,
} from '@/domain/services/operations.service';
import { instancesQueryKey } from '@/utils';

const POLLING_INTERVAL = 8000;

type TUseInstanceCreationPolling = {
  instancesCreationsCount: number;
  hasError: boolean;
  isPending: boolean;
};

const getOperationsData = (
  results: UseQueryResult<TOperation>[],
): TOperation[] =>
  results.map(({ data }) => data).filter(Boolean) as TOperation[];

export const useInstanceCreationPolling = (): TUseInstanceCreationPolling => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const previousPendingCountRef = useRef<number | undefined>();

  const { data: operations = [], isPending: isPendingOperations } = useQuery({
    queryKey: operationsQueryKey(projectId),
    queryFn: () => getOperations(projectId),
    select: (data) => data.filter(isInstanceCreationOperationPendingOrInError),
  });

  const { polledOperations, isPendingPolling } = useQueries({
    queries: operations.map((operation) => ({
      queryKey: operationQueryKey(projectId, operation.id),
      queryFn: () => getOperation(projectId, operation.id),
      refetchInterval: (query: Query<TOperation>) => {
        const op = query.state.data;
        if (!op) return false;

        const hasInstanceCreationPending =
          op.subOperations?.some((subOp) =>
            isInstanceCreationOperationPending(subOp),
          ) || isInstanceCreationOperationPending(op);

        return hasInstanceCreationPending ? POLLING_INTERVAL : false;
      },
      refetchIntervalInBackground: true,
      gcTime: 0,
    })),
    combine: (results) => ({
      polledOperations: getOperationsData(results),
      isPendingPolling: results.some((r) => r.isPending),
    }),
  });

  const hasError = useMemo(() => {
    return polledOperations.some(
      (operation) =>
        (operation.subOperations ?? []).some((subOp) =>
          isInstanceCreationOperationFailed(subOp),
        ) || isInstanceCreationOperationFailed(operation),
    );
  }, [polledOperations]);

  const instancesCreationsCount = useMemo(() => {
    return polledOperations.reduce((count, operation) => {
      const pendingSubOps = (operation.subOperations || []).filter((subOp) =>
        isInstanceCreationOperationPending(subOp),
      );

      if (pendingSubOps.length > 0) {
        return count + pendingSubOps.length;
      } else if (isInstanceCreationOperationPending(operation)) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [polledOperations]);

  useEffect(() => {
    const wasCreating = !!previousPendingCountRef.current;
    const noMorePendingCreations = instancesCreationsCount === 0;

    if (wasCreating && noMorePendingCreations) {
      void queryClient.invalidateQueries({
        queryKey: instancesQueryKey(projectId),
      });
      previousPendingCountRef.current = 0;
    } else if (instancesCreationsCount > 0) {
      previousPendingCountRef.current = instancesCreationsCount;
    }
  }, [instancesCreationsCount, queryClient, projectId]);

  const isPending = isPendingOperations || isPendingPolling;

  return {
    instancesCreationsCount,
    hasError,
    isPending,
  };
};
