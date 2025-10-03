import { TOperation } from '@/types/operation/entity.type';

export const isInstanceCreationOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'create' &&
  operation.status === 'in-progress';

export const isInstanceReinstallOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'reinstall' &&
  operation.status === 'in-progress';

export const isSubOperationCopyImageInProgress = (
  subOperation?: Required<TOperation>['subOperations'][number],
) =>
  subOperation &&
  subOperation.section === 'image' &&
  subOperation.action === 'copytoregion' &&
  subOperation.status === 'in-progress';
