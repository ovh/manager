import { v6 } from '@ovh-ux/manager-core-api';
import { TOperationDto } from '@/types/operation/api.type';
import { mapDtoToOperation } from '@/data/api/mapper/operation.mapper';

export const getOperations = (projectId: string) =>
  v6
    .get<TOperationDto[]>(`/cloud/project/${projectId}/operation`)
    .then(({ data }) => data.map(mapDtoToOperation));
