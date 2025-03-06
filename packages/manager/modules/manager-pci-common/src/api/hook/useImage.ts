import { useQuery } from '@tanstack/react-query';
import { getImages, TGetImagesParams } from '../data/image';

export const useImages = (projectId: string, params: TGetImagesParams = {}) =>
  useQuery({
    queryKey: ['project', projectId, 'images'],
    queryFn: () => getImages(projectId, params),
  });
