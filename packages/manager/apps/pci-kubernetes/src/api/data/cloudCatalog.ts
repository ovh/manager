import { v6 } from '@ovh-ux/manager-core-api';

import { TCloudCatalog } from '@/domain/entities/cloudCatalog';

import { TCloudCatalogResponseDTO } from '../../adapters/api/cloudCatalog/dto.types';
import { mapCloudCatalogToEntity } from '../../adapters/api/cloudCatalog/mapper';

export const getCloudCatalog = async (ovhSubsidiary: string): Promise<TCloudCatalog> => {
  return await v6
    .get<TCloudCatalogResponseDTO>(`/order/catalog/public/cloud`, { params: { ovhSubsidiary } })
    .then(({ data }) => mapCloudCatalogToEntity(data));
};
