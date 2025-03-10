import { v6 } from '@ovh-ux/manager-core-api';
import {
  TImageDto,
  TImageType,
  TImageVisibility,
} from '@/types/image/api.types';

export type TGetImagesParams = {
  type?: TImageType;
  visibility?: TImageVisibility;
};

export const getImages = async (
  projectId: string,
  region: string,
  params: TGetImagesParams,
): Promise<TImageDto[]> => {
  const { data } = await v6.get<TImageDto[]>(
    `/cloud/project/${projectId}/region/${region}/image`,
    {
      params,
    },
  );
  return data;
};
