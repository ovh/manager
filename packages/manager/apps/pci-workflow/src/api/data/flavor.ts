import { v6 } from '@ovh-ux/manager-core-api';

import { mapDtoToFlavor } from '@/api/data/mapper/flavor.mapper';
import { TFlavorDto } from '@/types/flavor/api';
import { TEFlavor } from '@/types/flavor/entity';

export const getFlavor = async (
  projectId: string,
  region: string,
  flavorId: string,
): Promise<TEFlavor> => {
  const { data } = await v6.get<TFlavorDto>(
    `/cloud/project/${projectId}/region/${region}/flavor/${flavorId}`,
  );

  return mapDtoToFlavor(data);
};
