import { useQuery } from '@tanstack/react-query';
import {
  getVcdaMigration,
  getVcdaMigrationList,
  matchesVcdaOrg,
  PublicVcda,
} from '@ovh-ux/manager-module-vcd-api';
import { getVcdaMigrationQueryKey } from './vcdaQueryKey';

const POLLING_STATUSES = ['CREATING', 'UPDATING', 'DELETING'];
const POLLING_INTERVAL = 30_000;

const resolveMigration = async (orgId: string): Promise<PublicVcda> => {
  const list = await getVcdaMigrationList();
  const match = list.find((migration) =>
    matchesVcdaOrg(migration.currentState?.organizationId, orgId),
  );
  if (!match) {
    throw new Error(`No VCDA migration found for organization ${orgId}`);
  }
  return getVcdaMigration(match.id);
};

export const useVcdaMigration = (orgId: string) =>
  useQuery({
    queryKey: getVcdaMigrationQueryKey(orgId),
    queryFn: () => resolveMigration(orgId),
    enabled: !!orgId,
    refetchInterval: (query) =>
      query.state.data &&
      POLLING_STATUSES.includes(query.state.data.resourceStatus)
        ? POLLING_INTERVAL
        : false,
  });
