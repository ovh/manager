import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getPartner } from '@/data/api/ai/partner/partner.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetPartner(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'partners', 'region', region, 'partner'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPartner({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.partner.Partner[], Error>;
}
