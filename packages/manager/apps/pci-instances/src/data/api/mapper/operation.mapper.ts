import {
  TOperationDTO,
  TSubOperationDTO,
} from '@/adapters/tanstack/operations/right/dto.type';
import { TOperation, TBaseOperation } from '@/domain/entities/operations';
import { mapDtoStatusToStatus } from '@/adapters/tanstack/operations/right/mapper';

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
