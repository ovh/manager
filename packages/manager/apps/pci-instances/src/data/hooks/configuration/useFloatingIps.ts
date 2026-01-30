import { useQuery } from '@tanstack/react-query';
import { getFloatingIps } from '@/data/api/floatingIps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { floatingIpsQueryKey } from '@/adapters/tanstack/configuration/queryKeys';
import { TFloatingIp } from '@/domain/entities/configuration';
import { TSelectOptions } from '@/types/querySelectOptions.type';

export const useFloatingIps = <TData>({
  select,
  regionName,
}: { regionName: string | null } & TSelectOptions<TFloatingIp[], TData>) => {
  const projectId = useProjectId();

  return useQuery({
    queryKey: floatingIpsQueryKey(projectId, regionName ?? ''),
    queryFn: () => getFloatingIps({ projectId, regionName: regionName ?? '' }),
    select,
    enabled: !!regionName,
  });
};
