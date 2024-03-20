import { v6 } from '@ovh-ux/manager-core-api';
import { Instance } from '@/interface';

export const getAllInstance = async (
  projectId: string,
): Promise<Instance[]> => {
  const instances = await v6.get(`/cloud/project/${projectId}/instance`);
  return instances.data;
};

export default { getAllInstance };
