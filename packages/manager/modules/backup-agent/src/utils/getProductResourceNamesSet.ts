import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const getProductResourceNames = (vspcTenants: Resource<VSPCTenant>[]): Set<string> => {
  const productNames = new Set<string>();

  vspcTenants.forEach((vspc) =>
    vspc.currentState.backupAgents.forEach((agent) => productNames.add(agent.productResourceName)),
  );

  return productNames;
};
