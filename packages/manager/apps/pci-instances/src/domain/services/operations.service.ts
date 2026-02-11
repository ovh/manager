import { TBaseOperation } from '../entities/operations';

export const isOperationInProgress = (operation?: TBaseOperation): boolean =>
  operation?.status == 'pending' || operation?.status === 'created';

export const isOperationInError = (operation?: TBaseOperation): boolean =>
  operation?.status === 'error';

export const isInstanceCreationOperation = (
  operation?: TBaseOperation,
): boolean => operation?.action === 'instance#create';

export const isInstanceCreationOperationPending = (
  operation?: TBaseOperation,
): boolean =>
  isInstanceCreationOperation(operation) && isOperationInProgress(operation);

export const isInstanceCreationOperationFailed = (
  operation?: TBaseOperation,
): boolean =>
  isInstanceCreationOperation(operation) && isOperationInError(operation);

export const isInstanceCreationOperationPendingOrInError = (
  operation?: TBaseOperation,
): boolean =>
  isInstanceCreationOperation(operation) &&
  (isOperationInProgress(operation) || isOperationInError(operation));
