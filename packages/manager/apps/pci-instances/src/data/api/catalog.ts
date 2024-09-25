import { v6 } from '@ovh-ux/manager-core-api';
import { TCatalogDto } from '@/types/catalog/api.types';

export const getCatalog = (projectId: string): Promise<TCatalogDto> =>
  v6
    .get<TCatalogDto>(`/cloud/project/${projectId}/catalog/instance`)
    .then((response) => response.data);
