import { v6 } from '@ovh-ux/manager-core-api';

import type { TShareCatalog } from '@/domain/entities/catalog.entity';
import { TShareCatalogDTO } from '@/adapters/catalog/right/dto.type';
import { mapCatalogDTOToCatalog } from '@/adapters/catalog/right/mapper';

export const getShareCatalog = async (
  projectId: string,
): Promise<TShareCatalog> =>{
  return v6
    .get<TShareCatalogDTO>(`/cloud/project/${projectId}/catalog/instance`)
    .then((response) => mapCatalogDTOToCatalog(response.data));
};
