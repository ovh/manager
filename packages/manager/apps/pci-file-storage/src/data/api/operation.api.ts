import { v6 } from '@ovh-ux/manager-core-api';

import { TOperationDTO } from '@/adapters/operations/right/dto.type';
import { mapOperationDTOToEntity } from '@/adapters/operations/right/mapper';
import { TOperation } from '@/domain/entities/operation.entity';

export const getOperations = (projectId: string): Promise<TOperation[]> =>
  v6
    .get<TOperationDTO[]>(`/cloud/project/${projectId}/operation`)
    .then((response) => response.data.map(mapOperationDTOToEntity));

export const getOperation = (projectId: string, operationId: string): Promise<TOperation> =>
  v6
    .get<TOperationDTO>(`/cloud/project/${projectId}/operation/${operationId}`)
    .then((response) => mapOperationDTOToEntity(response.data));
