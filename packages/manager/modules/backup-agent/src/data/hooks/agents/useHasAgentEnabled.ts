import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useGetBackupAgentListOptions } from '@/data/hooks/agents/getAgents';
import { useVSPCTenantsOptions } from '@/data/hooks/tenants/useVspcTenants';

export const useHasAgentEnabled = () => {
  const queryClient = useQueryClient();
  const vspcTenantsOptions = useVSPCTenantsOptions();
  const getBackupAgentListOptions = useGetBackupAgentListOptions();

  return useQuery({
    queryKey: ['hasAgentEnabled'],
    queryFn: async () => {
      const vspcs = await queryClient.ensureQueryData(vspcTenantsOptions);
      return (
        await Promise.all(
          vspcs.map(async (vspc) => {
            return queryClient.ensureQueryData(getBackupAgentListOptions(vspc.id));
          }),
        )
      ).flat();
    },
    select: (agents) => agents.filter((agent) => agent.status === 'NOT_INSTALLED').length > 0,
  });
};
