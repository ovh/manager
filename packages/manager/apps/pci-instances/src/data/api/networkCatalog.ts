import { v6 } from '@ovh-ux/manager-core-api';
import { TNetworkCatalog } from '@/domain/entities/networkCatalog';
import { TNetworkCatalogDTO } from '@/adapters/tanstack/networkCatalog/right/dto.type';
import { mapNetworkCatalogDtoToEntity } from '@/adapters/tanstack/networkCatalog/right/mapper';

type TGetNetworkCatalogArgs = {
  projectId: string;
};

export const getNetworkCatalog = async ({
  projectId,
}: TGetNetworkCatalogArgs): Promise<TNetworkCatalog> =>
  v6
    .get<TNetworkCatalogDTO>(`/cloud/project/${projectId}/catalog/network`)
    .then((response) => mapNetworkCatalogDtoToEntity(response.data));
