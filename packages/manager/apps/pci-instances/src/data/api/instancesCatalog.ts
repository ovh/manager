import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { TInstancesCatalog } from '@/types/instance/instancesCatalog.type';
import { TInstancesCatalogDTO } from '../../adapters/instancesCatalog/dto.type';
import { mapInstancesCatalogDtoToEntity } from '@/adapters/instancesCatalog/mapper';

type TGetInstancesCatalogArgs = {
  projectId: string;
};

export const getInstancesCatalog = async ({
  projectId,
}: TGetInstancesCatalogArgs): Promise<TInstancesCatalog> =>
  v6
    .get(`/cloud/project/${projectId}/catalog/instance`)
    .then((response: AxiosResponse<TInstancesCatalogDTO>) =>
      mapInstancesCatalogDtoToEntity(response.data),
    );
