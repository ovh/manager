import { v6 } from '@ovh-ux/manager-core-api';
import { TOperationDTO } from '@/adapters/tanstack/operations/right/dto.type';
import { TOperation } from '@/domain/entities/operations';
import { mapOperationDTOToEntity } from './mapper/operation.mapper';

export const getOperations = (projectId: string): Promise<TOperation[]> =>
  v6
    .get<TOperationDTO[]>(`/cloud/project/${projectId}/operation`)
    .then((response) => response.data.map(mapOperationDTOToEntity));

export const getOperation = (
  projectId: string,
  operationId: string,
): Promise<TOperation> =>
  v6
    .get<TOperationDTO>(`/cloud/project/${projectId}/operation/${operationId}`)
    .then((response) => mapOperationDTOToEntity(response.data));
