import { useCallback, useEffect, useState } from 'react';
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

const getOperationsWithImageCopyInProgress = (operations: TOperation[] = []) =>
  operations
    .filter(
      (operation) =>
        isInstanceCreationOperationInProgress(operation) ||
        isInstanceReinstallOperationInProgress(operation),
    )
    .flatMap((operation) => operation.subOperations)
    .filter(isSubOperationCopyImageInProgress).length;

const getCreationOperationWithoutImageCopy = (operations: TOperation[] = []) =>
  operations
    .filter(isInstanceCreationOperationInProgress)
    .filter(
      (operation) => !operation.subOperations?.some(isSubOperationCopyImage),
    ).length;

export const useDatagridOperationsPolling = (onComplete?: () => void) => {
  const projectId = useProjectId();

  const [
    numberOfOperationsWithImageCopyInProgress,
    setNumberOfOperationsWithImageCopyInProgress,
  ] = useState(0);

  const [
    numberOfCreationOperationWithoutImageCopyInProgress,
    setNumberOfCreationOperationWithoutImageCopyInProgress,
  ] = useState(0);

  const onSuccess = useCallback(
    (operations?: TOperation[]) => {
      if (!operations) return;

      const newNumberOfOperationsWithImageCopyInProgress = getOperationsWithImageCopyInProgress(
        operations,
      );

      const newNumberOfCreationOperationWithoutImageCopyInProgress = getCreationOperationWithoutImageCopy(
        operations,
      );

      if (
        onComplete &&
        (newNumberOfOperationsWithImageCopyInProgress <
          numberOfOperationsWithImageCopyInProgress ||
          newNumberOfCreationOperationWithoutImageCopyInProgress <
            numberOfCreationOperationWithoutImageCopyInProgress)
      ) {
        onComplete();
      }
    },
    [
      numberOfOperationsWithImageCopyInProgress,
      numberOfCreationOperationWithoutImageCopyInProgress,
      onComplete,
      projectId,
    ],
  );

  const { isPending, operations } = useOperationsPolling(
    projectId,
    {
      refetchInterval:
        (numberOfOperationsWithImageCopyInProgress ||
          numberOfCreationOperationWithoutImageCopyInProgress) &&
        5_000,
      retry: shouldRetryAfterNot404Error,
    },
    { onSuccess },
  );

  const newNumberOfCreationOfReinstallOperationInProgress = getOperationsWithImageCopyInProgress(
    operations,
  );

  const newNumberOfCreationOperationWithoutImageCopyInProgress = getCreationOperationWithoutImageCopy(
    operations,
  );

  useEffect(() => {
    setNumberOfOperationsWithImageCopyInProgress(
      newNumberOfCreationOfReinstallOperationInProgress,
    );
  }, [newNumberOfCreationOfReinstallOperationInProgress]);

  useEffect(() => {
    setNumberOfCreationOperationWithoutImageCopyInProgress(
      newNumberOfCreationOperationWithoutImageCopyInProgress,
    );
  }, [newNumberOfCreationOperationWithoutImageCopyInProgress]);

  return {
    hasOperationsRunning:
      newNumberOfCreationOfReinstallOperationInProgress +
        newNumberOfCreationOperationWithoutImageCopyInProgress >
      0,
    isPending,
  };
};
