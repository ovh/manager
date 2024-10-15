import { v6 } from '@ovh-ux/manager-core-api';
import { TPlan } from '@/pages/create/store';
import { TFlavor } from '@/api/data/load-balancer';

export const getFlavor = async (
  projectId: string,
  regionName: string,
  size: TPlan,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor[]>(
    `/cloud/project/${projectId}/region/${regionName}/loadbalancing/flavor`,
  );

  return data.find(
    (regionalizedFlavors) => regionalizedFlavors.name === size.technicalName,
  );
};
