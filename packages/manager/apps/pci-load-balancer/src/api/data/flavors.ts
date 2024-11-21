import { v6 } from '@ovh-ux/manager-core-api';
import { TAddon } from '@/pages/create/store';
import { TFlavor } from '@/api/data/load-balancer';

export const getFlavor = async (
  projectId: string,
  regionName: string,
  addon: TAddon,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor[]>(
    `/cloud/project/${projectId}/region/${regionName}/loadbalancing/flavor`,
  );

  return data.find(
    (regionalizedFlavors) => regionalizedFlavors.name === addon.technicalName,
  );
};
