import { useCallback, useState } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TOperation } from '@/types/operation/entity.type';
import { useOperationsPolling } from '@/data/hooks/instance/polling/useOperationsPolling';
import { shouldRetryAfterNot404Error } from '@/data/hooks/instance/polling/useInstancesPolling';

const isInstanceCreationOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'create' &&
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
    hasDistantBackupCopyRunning,
    setHasDistantBackupCopyRunning,
  ] = useState(false);

  const onSuccess = useCallback(
    (operations?: TOperation[]) => {
      if (!operations) return undefined;

      const hasDistantBackupInCopy = operations
        .filter(isInstanceCreationOperationInProgress)
        .flatMap((operation) => operation.subOperations)
        .some(isSubOperationCopyImageInProgress);

      if (
        hasDistantBackupCopyRunning &&
        !hasDistantBackupInCopy &&
        onComplete
      ) {
        onComplete();
      }

      setHasDistantBackupCopyRunning(hasDistantBackupInCopy);

      return hasDistantBackupInCopy;
    },
    [hasDistantBackupCopyRunning, onComplete],
  );

  useOperationsPolling(
    projectId,
    {
      refetchInterval: hasDistantBackupCopyRunning && 5_000,
      retry: shouldRetryAfterNot404Error,
    },
    { onSuccess },
  );

  return {
    hasOperationsRunning: hasDistantBackupCopyRunning,
  };
};
