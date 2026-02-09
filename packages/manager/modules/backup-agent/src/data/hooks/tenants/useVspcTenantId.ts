import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useVSPCTenantsOptions } from '@/data/hooks/tenants/useVspcTenants';

export const useGetVspcTenantId = () => {
  const queryClient = useQueryClient();
  const vspcTenantsOptions = useVSPCTenantsOptions();

  return async () => {
    const tenants = await queryClient.ensureQueryData(vspcTenantsOptions);
    if (!tenants || tenants.length === 0) {
      throw new Error('No VSPC Tenant found');
    }
    return tenants[0]!.id;
  };
};

export const useVspcTenantId = () => {
  return useQuery({
    ...useVSPCTenantsOptions(),
    select: (data) => data[0]?.id,
  });
};
