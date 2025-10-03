import { v6 } from '@ovh-ux/manager-core-api';

import { TRegionInformations } from '@/types/region';

export const getRegionInformations = async (projectId: string, regionName: string) => {
  const { data } = await v6.get<TRegionInformations>(
    `/cloud/project/${projectId}/region/${regionName}`,
  );
  return data;
};
