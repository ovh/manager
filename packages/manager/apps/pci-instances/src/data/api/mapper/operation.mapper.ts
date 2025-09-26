import { TOperationDto } from '@/types/operation/api.type';
import { TOperation } from '@/types/operation/entity.type';

const dtoActionSplitter = (dtoAction: string) => {
  const [section, action] = dtoAction.split('#') as [string, string];

  return {
    section,
    action,
  };
};

export const mapDtoToOperation = (operation: TOperationDto): TOperation => {
  const subOperations = operation.subOperations?.map(({ action, status }) => ({
    ...dtoActionSplitter(action),
    status,
  }));

  return {
    ...operation,
    ...dtoActionSplitter(operation.action),
    subOperations,
  };
};
