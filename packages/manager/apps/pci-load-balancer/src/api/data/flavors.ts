import { v6 } from '@ovh-ux/manager-core-api';
import { TFlavor } from '@/api/data/load-balancer';
import { ProductAddonDetail } from '@/types/product.type';

export const getFlavor = async (
  projectId: string,
  regionName: string,
  product: ProductAddonDetail,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor[]>(
    `/cloud/project/${projectId}/region/${regionName}/loadbalancing/flavor`,
  );

  return data.find(
    (regionalizedFlavors) => regionalizedFlavors.name === product.technicalName,
  );
};
