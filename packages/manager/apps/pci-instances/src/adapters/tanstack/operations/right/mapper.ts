import { TOperationStatus } from '@/domain/entities/operations';
import { TOperationStatusDTO } from './dto.type';

export const mapDtoStatusToStatus = (
  statusDto: TOperationStatusDTO,
): TOperationStatus => {
  switch (statusDto) {
    case 'in-error':
      return 'error';
    case 'in-progress':
      return 'pending';
    default:
      return statusDto;
  }
};
