import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getPartner } from '@/data/api/ai/partner.api';

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
