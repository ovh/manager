import { TBaseOperation } from '../entities/operation.entity';

export const isOperationInProgress = (operation?: TBaseOperation): boolean =>
  operation?.status === 'pending' || operation?.status === 'created';

export const isOperationInError = (operation?: TBaseOperation): boolean =>
  operation?.status === 'error';

const SHARE_CREATE_ACTION = 'share#create';

export const isShareCreationOperation = (operation?: TBaseOperation): boolean =>
  operation?.action === SHARE_CREATE_ACTION;

export const isShareCreationOperationPending = (operation?: TBaseOperation): boolean =>
  isShareCreationOperation(operation) && isOperationInProgress(operation);

export const isShareCreationOperationFailed = (operation?: TBaseOperation): boolean =>
  isShareCreationOperation(operation) && isOperationInError(operation);

export const isShareCreationOperationPendingOrInError = (operation?: TBaseOperation): boolean =>
  isShareCreationOperation(operation) &&
  (isOperationInProgress(operation) || isOperationInError(operation));
