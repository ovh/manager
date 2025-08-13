import { TOperationDto } from '@/types/operation/api.type';
import { TOperation } from '@/types/operation/entity.type';

export const mapDtoToOperation = (operation: TOperationDto): TOperation => {
  const [section, action] = operation.action.split('#') as [string, string];

  return {
    ...operation,
    section,
    action,
  };
};
