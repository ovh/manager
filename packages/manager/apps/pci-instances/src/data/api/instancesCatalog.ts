import { v6 } from '@ovh-ux/manager-core-api';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { TInstancesCatalogDTO } from '../../adapters/tanstack/instancesCatalog/right/dto.type';
import { mapInstancesCatalogDtoToEntity } from '@/adapters/tanstack/instancesCatalog/right/mapper';

type TGetInstancesCatalogArgs = {
  projectId: string;
};

export const getInstancesCatalog = async ({
  projectId,
}: TGetInstancesCatalogArgs): Promise<TInstancesCatalog> =>
  v6
    .get<TInstancesCatalogDTO>(`/cloud/project/${projectId}/catalog/instance`)
    .then((response) => mapInstancesCatalogDtoToEntity(response.data));
