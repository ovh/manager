import { v6 } from '@ovh-ux/manager-core-api';
import queryClient from '@/queryClient';
import { getQueryKeyFloatingIPs } from '@/api/hooks/useFloatingIP';

export const createFloatingIp = async (
  projectId: string,
  regionName: string,
  instanceId: string,
  ip: string,
  gateway?: {
    name: string;
    model: string;
  },
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/floatingIp`,
    {
      ip,
      ...(gateway && { gateway }),
    },
  );

  queryClient.invalidateQueries({
    queryKey: getQueryKeyFloatingIPs(projectId),
  });

  return data;
};
