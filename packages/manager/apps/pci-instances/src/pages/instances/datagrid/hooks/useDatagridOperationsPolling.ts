import { useCallback, useState } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/types/operation/entity.type';
import { useOperationsPolling } from '@/data/hooks/operation/polling/useOperationsPolling';
import { shouldRetryAfterNot404Error } from '@/data/hooks/instance/polling/useInstancesPolling';
import {
  isInstanceCreationOperationInProgress,
  isInstanceReinstallOperationInProgress,
  isSubOperationCopyImageInProgress,
} from '@/utils/operation/operations.utils';

export const useDatagridOperationsPolling = (onComplete?: () => void) => {
  const projectId = useProjectId();

  const [
    numberOfDistantBackupCopyRunning,
    setNumberOfDistantBackupCopyRunning,
  ] = useState(0);

  const onSuccess = useCallback(
    (operations?: TOperation[]) => {
      if (!operations) return;

      const newNumberOfDistantBackupCopyRunning = operations
        .filter(
          (operation) =>
            isInstanceCreationOperationInProgress(operation) ||
            isInstanceReinstallOperationInProgress(operation),
        )
        .flatMap((operation) => operation.subOperations)
        .filter(isSubOperationCopyImageInProgress).length;

      if (
        onComplete &&
        newNumberOfDistantBackupCopyRunning < numberOfDistantBackupCopyRunning
      ) {
        onComplete();
      }

      setNumberOfDistantBackupCopyRunning(newNumberOfDistantBackupCopyRunning);
    },
    [numberOfDistantBackupCopyRunning, onComplete, projectId],
  );

  useOperationsPolling(
    projectId,
    {
      refetchInterval: numberOfDistantBackupCopyRunning && 5_000,
      retry: shouldRetryAfterNot404Error,
    },
    { onSuccess },
  );

  return {
    hasOperationsRunning: numberOfDistantBackupCopyRunning > 0,
  };
};
