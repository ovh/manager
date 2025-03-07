import { v6 } from '@ovh-ux/manager-core-api';
import { FloatingIp } from '@/types/floating.type';

export const getFloatingIps = async (projectId: string, region: string) => {
  const { data } = await v6.get<FloatingIp[]>(
    `/cloud/project/${projectId}/region/${region}/floatingip`,
  );

  return data;
};
