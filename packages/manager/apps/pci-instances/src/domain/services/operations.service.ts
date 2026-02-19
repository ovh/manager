import { TOperation } from '../entities/operations';

export const isOperationInProgress = (operation?: TOperation): boolean =>
  operation?.status == 'pending' || operation?.status === 'created';

export const isOperationInError = (operation?: TOperation): boolean =>
  operation?.status === 'error';

export const isInstanceCreationOperationPendingOrInError = (
  operation?: TOperation,
): boolean =>
  operation?.action === 'instance#create' &&
  (isOperationInProgress(operation) || isOperationInError(operation));
