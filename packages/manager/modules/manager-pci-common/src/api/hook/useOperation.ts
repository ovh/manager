import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOperation, OperationStatus, TOperation } from '../data/operation';

export const useOperationProgress = (
  projectId: string,
  operationId: string,
  onCompleted: (status: OperationStatus) => void,
) => {
  const [progress, setProgress] = useState({
    percentage: 0,
    status: OperationStatus.Unknown,
  });

  const onCompletedRef = useRef(onCompleted);
  const notifyCompletion = (status: OperationStatus) => {
    if (onCompletedRef.current) {
      onCompletedRef.current(status);
      onCompletedRef.current = null;
    }
  };

  const { data: operation, error } = useQuery<TOperation, { code: number }>({
    queryKey: ['pci-operation-progress', projectId, operationId],
    queryFn: () => getOperation(projectId, operationId),
    enabled:
      !!projectId &&
      !!operationId &&
      progress.percentage < 100 &&
      ![OperationStatus.Completed, OperationStatus.InError].includes(
        progress.status,
      ),
    refetchInterval: 3000,
    retry: 5,
  });

  useEffect(() => {
    // if operation doesn't exist (404) we assume it is done and successfull
    if (operation === null) {
      setProgress({
        percentage: 100,
        status: OperationStatus.Completed,
      });
      notifyCompletion(OperationStatus.Completed);
    } else if (operation) {
      const status = operation.status || OperationStatus.Unknown;
      setProgress({
        percentage: operation.progress,
        status,
      });
      if (operation.progress === 100) {
        notifyCompletion(status);
      }
    }
  }, [operation]);

  useEffect(() => {
    if (error) {
      setProgress({
        percentage: 100,
        status: OperationStatus.InError,
      });
      notifyCompletion(OperationStatus.InError);
    }
  }, [error]);

  return progress;
};
