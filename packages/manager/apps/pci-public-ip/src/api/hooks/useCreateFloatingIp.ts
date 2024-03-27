import { v6 } from '@ovh-ux/manager-core-api';

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

  return data;
};
