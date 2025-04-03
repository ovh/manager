import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';

import { getSshkey } from '@/data/api/sshkey/sshkey.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

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
