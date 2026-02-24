import { TBaseOperation, TOperation, TOperationStatus } from '@/domain/entities/operation.entity';

import { TOperationDTO, TOperationStatusDTO, TSubOperationDTO } from './dto.type';

export const mapDtoStatusToStatus = (statusDto: TOperationStatusDTO): TOperationStatus => {
  switch (statusDto) {
    case 'in-error':
      return 'error';
    case 'in-progress':
      return 'pending';
    default:
      return statusDto;
  }
};

const mapSubOperationDTOToEntity = (dto: TSubOperationDTO): TBaseOperation => ({
  action: dto.action,
  id: dto.id,
  status: mapDtoStatusToStatus(dto.status),
});

export const mapOperationDTOToEntity = (dto: TOperationDTO): TOperation => ({
  action: dto.action,
  id: dto.id,
  status: mapDtoStatusToStatus(dto.status),
  subOperations: dto.subOperations?.map(mapSubOperationDTOToEntity) ?? [],
});
