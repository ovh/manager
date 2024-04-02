import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { FloatingIP } from '@/interface';

export const getAllFloatingIP = async (
  projectId: string,
): Promise<FloatingIP[]> => {
  const {
    data: { resources },
  } = await v6.get(`/cloud/project/${projectId}/aggregated/floatingip`);

  return resources;
};

export const terminateFloatingIP = async (
  projectId: string,
  region: string,
  ipId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/floatingip/${ipId}`,
  );
  return data;
};

export default { getAllFloatingIP };
