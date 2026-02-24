/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useRef } from 'react';

import { Query, UseQueryResult, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import { operationQueryKey, operationsQueryKey } from '@/adapters/operations/queryKeys';
import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import { getOperation, getOperations } from '@/data/api/operation.api';
import { TOperation } from '@/domain/entities/operation.entity';
import {
  isShareCreationOperationFailed,
  isShareCreationOperationPending,
  isShareCreationOperationPendingOrInError,
} from '@/domain/services/operation.service';
import { useProjectId } from '@/hooks/useProjectId';

const POLLING_INTERVAL = 8000;

type TUseShareCreationPolling = {
  shareCreationsCount: number;
  hasError: boolean;
  isPending: boolean;
};

const getOperationsData = (results: UseQueryResult<TOperation>[]): TOperation[] =>
  results.map(({ data }) => data).filter(Boolean) as TOperation[];

export const useShareCreationPolling = (): TUseShareCreationPolling => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const previousPendingCountRef = useRef<number | undefined>();

  const { data: operations = [], isPending: isPendingOperations } = useQuery({
    queryKey: operationsQueryKey(projectId),
    queryFn: () => getOperations(projectId),
    select: (data) => data.filter(isShareCreationOperationPendingOrInError),
  });

  const { polledOperations, isPendingPolling } = useQueries({
    queries: operations.map((operation) => ({
      queryKey: operationQueryKey(projectId, operation.id),
      queryFn: () => getOperation(projectId, operation.id),
      refetchInterval: (query: Query<TOperation>) => {
        const op = query.state.data;
        if (!op) return false;

        const hasShareCreationPending =
          op.subOperations?.some((subOp) => isShareCreationOperationPending(subOp)) ||
          isShareCreationOperationPending(op);

        return hasShareCreationPending ? POLLING_INTERVAL : false;
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
        (operation.subOperations ?? []).some((subOp) => isShareCreationOperationFailed(subOp)) ||
        isShareCreationOperationFailed(operation),
    );
  }, [polledOperations]);

  const shareCreationsCount = useMemo(() => {
    return polledOperations.reduce((count, operation) => {
      const pendingSubOps = (operation.subOperations || []).filter((subOp) =>
        isShareCreationOperationPending(subOp),
      );

      if (pendingSubOps.length > 0) {
        return count + pendingSubOps.length;
      }
      if (isShareCreationOperationPending(operation)) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [polledOperations]);

  useEffect(() => {
    const wasCreating = !!previousPendingCountRef.current;
    const noMorePendingCreations = shareCreationsCount === 0;

    if (wasCreating && noMorePendingCreations) {
      void queryClient.invalidateQueries({
        queryKey: sharesQueryKey(projectId),
      });
      previousPendingCountRef.current = 0;
    } else if (shareCreationsCount > 0) {
      previousPendingCountRef.current = shareCreationsCount;
    }
  }, [shareCreationsCount, queryClient, projectId]);

  const isPending = isPendingOperations || isPendingPolling;

  return {
    shareCreationsCount,
    hasError,
    isPending,
  };
};
