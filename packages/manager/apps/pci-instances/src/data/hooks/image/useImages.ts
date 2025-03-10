import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { DeepReadonly } from '@/types/utils.type';
import { getImages, TGetImagesParams } from '@/data/api/image';
import { TImageDto } from '@/types/image/api.types';

export type TUseActivateRegionCallbacks = DeepReadonly<{
  onSuccess?: (region: string) => void;
  onError?: (error: unknown) => void;
}>;

export type TUseImageProps<T> = {
  projectId: string;
  region: string;
  params?: TGetImagesParams;
  selectFn: (images: TImageDto[]) => T[];
};

export const useImages = <T>({
  projectId,
  region,
  params,
  selectFn,
}: TUseImageProps<T>) =>
  useQuery({
    queryKey: ['project', projectId, 'images'],
    queryFn: () => getImages(projectId, region, params || {}),
    select: useCallback(selectFn, [selectFn]),
  });
