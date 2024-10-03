import { v6 } from '@ovh-ux/manager-core-api';
import { TRegistryPlan } from '@/api/data/registry';

export type TCapability = {
  regionName: string;
  plans: TRegistryPlan[];
};

export const getCapabilities = async (
  projectId: string,
): Promise<TCapability[]> => {
  const { data } = await v6.get<TCapability[]>(
    `cloud/project/${projectId}/capabilities/containerRegistry`,
  );

  return data;
};
