import { v6 } from '@ovh-ux/manager-core-api';
import { TQuota } from '@ovh-ux/manager-pci-common';

export const getProjectQuotaByRegion = async (
  projectId: string,
  regionName: string,
): Promise<TQuota> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/region/${regionName}/quota`);
  return data;
};
