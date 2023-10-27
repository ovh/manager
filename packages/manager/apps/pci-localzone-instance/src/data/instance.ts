import { v6 } from '@ovh-ux/manager-core-api';

export interface Instance {
  id: string;
  name: string;
  flavorId: string;
  imageId: string;
  region: string;
  status: string;
}

export const getInstances = async (projectId: string): Promise<Instance[]> => {
  const response = await v6.get(`/cloud/project/${projectId}/instance`);
  return response.data as Instance[];
};

export const getInstance = async (
  projectId: string,
  instanceId: string,
): Promise<Instance> => {
  const response = await v6.get(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return response.data as Instance;
};

export default getInstances;
