import { useQuery } from '@tanstack/react-query';
import { getAllPrivateNetworks } from '../data/network';

const getQueryKeyPrivateNetworks = (projectId: string) => [
  'project',
  projectId,
  'privateNetworks',
];

export const useAllPrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworks(projectId),
    queryFn: () => getAllPrivateNetworks(projectId),
    throwOnError: true,
  });
