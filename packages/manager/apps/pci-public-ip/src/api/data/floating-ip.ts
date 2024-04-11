import { v6 } from '@ovh-ux/manager-core-api';
import { FloatingIP } from '@/interface';

export const getAllFloatingIP = async (
  projectId: string,
): Promise<FloatingIP[]> => {
  const {
    data: { resources },
  } = await v6.get(`/cloud/project/${projectId}/aggregated/floatingip`);

  return resources;
};

export const getAllAssociatedInstances = async (
  projectId: string,
  regionName: string,
): Promise<FloatingIP[]> => {
  const { data } = await v6.get<FloatingIP[]>(
    `/cloud/project/${projectId}/region/${regionName}/floatingip`,
  );
  return data;
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

export const updateInstanceForFloatingIP = async (
  projectId: string,
  instanceId: string,
  ipAddress: string,
  floatingIP: FloatingIP,
) => {
  const { region, id } = floatingIP;
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/instance/${instanceId}/associateFloatingIp`,
    {
      floatingIpId: id,
      ip: ipAddress,
    },
  );
  return data;
};

export default { getAllFloatingIP };
