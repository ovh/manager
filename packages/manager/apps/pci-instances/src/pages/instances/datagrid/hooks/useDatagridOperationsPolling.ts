import { useCallback, useState } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/types/operation/entity.type';
import { useOperationsPolling } from '@/data/hooks/instance/polling/useOperationsPolling';
import { shouldRetryAfterNot404Error } from '@/data/hooks/instance/polling/useInstancesPolling';

const isInstanceCreationOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'create' &&
  operation.status === 'in-progress';

const isInstanceReinstallOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'reinstall' &&
  operation.status === 'in-progress';

const isSubOperationCopyImageInProgress = (
  subOperation?: Required<TOperation>['subOperations'][number],
) =>
  subOperation &&
  subOperation.section === 'image' &&
  subOperation.action === 'copytoregion' &&
  subOperation.status === 'in-progress';

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
