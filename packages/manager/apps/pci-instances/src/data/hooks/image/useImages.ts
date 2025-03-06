import { useQuery } from '@tanstack/react-query';
import { DeepReadonly } from '@/types/utils.type';
import { getImages, TGetImagesParams } from '@/data/api/image';

export type TUseActivateRegionCallbacks = DeepReadonly<{
  onSuccess?: (region: string) => void;
  onError?: (error: unknown) => void;
}>;

export const useImages = (projectId: string, params: TGetImagesParams = {}) =>
  useQuery({
    queryKey: ['project', projectId, 'images'],
    queryFn: () => getImages(projectId, params),
  });
