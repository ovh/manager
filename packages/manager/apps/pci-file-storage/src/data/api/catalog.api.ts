import { v6 } from '@ovh-ux/manager-core-api';

import { CATALOG_SHARE } from '@/__mocks__/dto/catalog.dto.mocks';
import { TShareCatalogDTO } from '@/adapters/catalog/right/dto.type';
import { mapCatalogDTOToCatalog } from '@/adapters/catalog/right/mapper';
import type { TShareCatalog } from '@/domain/entities/catalog.entity';

/** TODO: to remove when share catalog available **/
const addMockToCatalog = (data: TShareCatalogDTO) => ({ ...data, shares: [CATALOG_SHARE] });

export const getShareCatalog = async (projectId: string): Promise<TShareCatalog> => {
  return (
    v6
      .get<TShareCatalogDTO>(`/cloud/project/${projectId}/catalog/instance`)
      /** TODO: to remove when share catalog available **/
      .then((response) => ({ ...response, data: addMockToCatalog(response.data) }))
      .then((response) => mapCatalogDTOToCatalog(response.data))
  );
};
