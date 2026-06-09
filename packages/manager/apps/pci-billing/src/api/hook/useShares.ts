import { useQuery } from '@tanstack/react-query';
import { getShares } from '../data/shares';

export const getSharesQueryKey = (projectId: string) => [
  projectId,
  'aggregated',
  'share',
];

export const useShares = (projectId: string) =>
  useQuery({
    queryKey: getSharesQueryKey(projectId),
    queryFn: () => getShares(projectId),
  });
