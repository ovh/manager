import { TOperation } from '@/types/operation/entity.type';

const isInstanceCreationOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'create' &&
  operation.status === 'in-progress';

const isInstanceReinstallOperationInProgress = (operation: TOperation) =>
  operation.section === 'instance' &&
  operation.action === 'reinstall' &&
  operation.status === 'in-progress';

const isSubOperationCopyImage = (
  subOperation?: Required<TOperation>['subOperations'][number],
) =>
  subOperation
    ? subOperation.section === 'image' && subOperation.action === 'copytoregion'
    : false;

const isSubOperationCopyImageInProgress = (
  subOperation?: Required<TOperation>['subOperations'][number],
) =>
  subOperation
    ? isSubOperationCopyImage(subOperation) &&
      subOperation.status === 'in-progress'
    : false;

const getNumberOfOperationsWithImageCopyInProgress = (
  operations: TOperation[] = [],
) =>
  operations
    .filter(
      (operation) =>
        isInstanceCreationOperationInProgress(operation) ||
        isInstanceReinstallOperationInProgress(operation),
    )
    .flatMap((operation) => operation.subOperations)
    .filter(isSubOperationCopyImageInProgress).length;

const getNumberOfCreationOperationWithoutImageCopy = (
  operations: TOperation[] = [],
) =>
  operations
    .filter(isInstanceCreationOperationInProgress)
    .filter(
      (operation) => !operation.subOperations?.some(isSubOperationCopyImage),
    ).length;

export const getNumberOfOperationInProgress = (operations: TOperation[] = []) =>
  getNumberOfOperationsWithImageCopyInProgress(operations) +
  getNumberOfCreationOperationWithoutImageCopy(operations);
