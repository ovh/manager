import { useQuery } from '@tanstack/react-query';
import {
  getVcdaMigrationList,
  matchesVcdaOrg,
  PublicVcda,
  VcdaResourceStatus,
  VcdaTileStatus,
} from '@ovh-ux/manager-module-vcd-api';

export const getVcdaStatusQueryKey = (orgId: string) => [
  'public-vcf',
  orgId,
  'vcda-status',
];

const POLLED_STATUSES: VcdaResourceStatus[] = [
  'CREATING',
  'UPDATING',
  'DELETING',
];

export const deriveTileStatus = (
  entity: PublicVcda | undefined,
): VcdaTileStatus => {
  if (!entity) {
    return { kind: 'inactive' };
  }
  switch (entity.resourceStatus) {
    case 'CREATING':
      return { kind: 'provisioning' };
    case 'DELETING':
      return { kind: 'deleting' };
    default:
      return { kind: 'active', resourceStatus: entity.resourceStatus };
  }
};

export interface UseVcdaStatusResult {
  data: VcdaTileStatus | undefined;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const useVcdaStatus = (
  orgId: string,
  enabled = true,
): UseVcdaStatusResult => {
  const { data, isPending, isLoading, isError, refetch } = useQuery({
    queryKey: getVcdaStatusQueryKey(orgId),
    queryFn: getVcdaMigrationList,
    enabled: enabled && !!orgId,
    staleTime: 30_000,
    select: (migrations: PublicVcda[]) =>
      deriveTileStatus(
        migrations.find((migration) =>
          matchesVcdaOrg(migration.currentState?.organizationId, orgId),
        ),
      ),
    refetchInterval: (query) => {
      const matched = query.state.data?.find((migration) =>
        matchesVcdaOrg(migration.currentState?.organizationId, orgId),
      );
      return matched && POLLED_STATUSES.includes(matched.resourceStatus)
        ? 30_000
        : false;
    },
  });

  return { data, isPending, isLoading, isError, refetch };
};
