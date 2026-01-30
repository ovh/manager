import { useQuery } from '@tanstack/react-query';
import { getPrivateNetworks } from '@/data/api/privateNetworks';
import { useProjectId } from '@/hooks/project/useProjectId';
import { privateNetworksQueryKey } from '@/adapters/tanstack/configuration/queryKeys';
import { TPrivateNetwork } from '@/domain/entities/configuration';
import { TSelectOptions } from '@/types/querySelectOptions.type';

export const usePrivateNetworks = <TData>(
  options: TSelectOptions<TPrivateNetwork, TData>,
) => {
  const { select } = options;
  const projectId = useProjectId();

  return useQuery({
    queryKey: privateNetworksQueryKey(projectId),
    queryFn: () => getPrivateNetworks({ projectId }),
    select,
  });
};
