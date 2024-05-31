import { useQuery } from '@tanstack/react-query';
import { getShare } from '@/api';

export const useShare = ({
  projectId,
  regionName,
  shareId,
}: {
  projectId: string;
  regionName: string;
  shareId: string;
}) =>
  useQuery({
    queryKey: ['share', projectId, regionName, shareId],
    queryFn: () => getShare({ projectId, regionName, shareId }),
    staleTime: Infinity,
    enabled: true,
  });
