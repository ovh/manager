import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as sshkey from '@/types/cloud/sshkey';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getSshkey } from '@/data/api/sshkey/sshkey.api';

export function useGetSshkey(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'sshkey'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSshkey({ projectId }),
    ...options,
  }) as UseQueryResult<sshkey.SshKey[], Error>;
}
