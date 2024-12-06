import { useQuery } from '@tanstack/react-query';
import { getImages } from '../data/image';

export const useImages = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'images'],
    queryFn: () => getImages(projectId),
  });
