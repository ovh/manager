import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/types/operation/entity.type';
import { useOperationsPolling } from '@/data/hooks/operation/polling/useOperationsPolling';
import { shouldRetryAfterNot404Error } from '@/data/hooks/instance/polling/useInstancesPolling';
import { getNumberOfOperationInProgress } from './operations.utils';

export const useDatagridOperationsPolling = (onComplete?: () => void) => {
  const projectId = useProjectId();

  const [
    numberOfOperationsInProgress,
    setNumberOfOperationsInProgress,
  ] = useState(0);

  const onSuccess = useCallback(
    (operations?: TOperation[]) => {
      if (!operations || operations.length === 0) return;

      const newNumberOfOperationsInProgress = getNumberOfOperationInProgress(
        operations,
      );

      if (
        onComplete &&
        newNumberOfOperationsInProgress < numberOfOperationsInProgress
      ) {
        onComplete();
      }
    },
    [numberOfOperationsInProgress, onComplete, projectId],
  );

  const { isPending, operations } = useOperationsPolling(
    projectId,
    {
      refetchInterval: numberOfOperationsInProgress && 5_000,
      retry: shouldRetryAfterNot404Error,
    },
    { onSuccess },
  );

  const newNumberOfOperationsInProgress = getNumberOfOperationInProgress(
    operations,
  );

  useEffect(() => {
    setNumberOfOperationsInProgress(newNumberOfOperationsInProgress);
  }, [newNumberOfOperationsInProgress]);

  return useMemo(
    () => ({
      hasOperationsRunning: newNumberOfOperationsInProgress > 0,
      isPending,
    }),
    [newNumberOfOperationsInProgress, isPending],
  );
};
