import { useQuery } from '@tanstack/react-query';
import { getVolumes } from '../data/volume';

export const useVolumes = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'volumes'],
    queryFn: () => getVolumes(projectId),
  });
