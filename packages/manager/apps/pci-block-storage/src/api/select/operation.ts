import { TOperation, TOperationStatus } from '@/api/data/operation';

export const isOperationInProgress = (
  operation: TOperation | undefined | null,
): boolean =>
  !!operation &&
  [TOperationStatus.CREATED, TOperationStatus.IN_PROGRESS].includes(
    operation.status,
  );

export const isOperationInFailedState = (
  operation: TOperation | undefined | null,
) =>
  (!!operation &&
    [
      TOperationStatus.CANCELED,
      TOperationStatus.IN_ERROR,
      TOperationStatus.UNKNOWN,
    ].includes(operation.status)) ||
  false;

export const isOperationASuccess = (
  operation: TOperation | undefined | null,
): boolean => !!operation && TOperationStatus.COMPLETED === operation.status;
