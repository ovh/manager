import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/types/operation/entity.type';
import { useOperationsPolling } from '@/data/hooks/operation/polling/useOperationsPolling';
import { shouldRetryAfterNot404Error } from '@/data/hooks/instance/polling/useInstancesPolling';
import {
  isInstanceCreationOperationInProgress,
  isInstanceReinstallOperationInProgress,
  isSubOperationCopyImage,
  isSubOperationCopyImageInProgress,
} from '@/utils/operation/operations.utils';

const getNumberOfOperationsWithImageCopyInProgress = (
  operations: TOperation[] = [],
) =>
  operations
    .filter(
      (operation) =>
        isInstanceCreationOperationInProgress(operation) ||
        isInstanceReinstallOperationInProgress(operation),
    )
    .flatMap((operation) => operation.subOperations)
    .filter(isSubOperationCopyImageInProgress).length;

const getNumberOfCreationOperationWithoutImageCopy = (
  operations: TOperation[] = [],
) =>
  operations
    .filter(isInstanceCreationOperationInProgress)
    .filter(
      (operation) => !operation.subOperations?.some(isSubOperationCopyImage),
    ).length;

const getNumberOfOperationInProgress = (operations: TOperation[] = []) =>
  getNumberOfOperationsWithImageCopyInProgress(operations) +
  getNumberOfCreationOperationWithoutImageCopy(operations);

export const useDatagridOperationsPolling = (onComplete?: () => void) => {
  const projectId = useProjectId();

  const [
    numberOfOperationsInProgress,
    setNumberOfOperationsInProgress,
  ] = useState(0);

  const onSuccess = useCallback(
    (operations?: TOperation[]) => {
      if (!operations) return;

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
