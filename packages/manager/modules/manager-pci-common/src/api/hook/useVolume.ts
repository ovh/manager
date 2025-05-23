import { useQuery } from '@tanstack/react-query';
import { getVolumes } from '../data/volume';

export const getVolumesQueryKey = (projectId: string) => [
  'project',
  projectId,
  'volumes',
];

export const useVolumes = (projectId: string) =>
  useQuery({
    queryKey: getVolumesQueryKey(projectId),
    queryFn: () => getVolumes(projectId),
  });
