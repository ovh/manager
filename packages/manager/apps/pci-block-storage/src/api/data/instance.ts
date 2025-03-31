import { getInstancesByRegion as commonGetInstancesByRegion } from '@ovh-ux/manager-pci-common';
import { TInstance } from '@/entity/instance';

export type TInstanceDTO = Pick<
  TInstance,
  'id' | 'status' | 'name' | 'availabilityZone'
>;

export async function getInstancesByRegion(
  projectId: string,
  regionId: string,
): Promise<TInstance[]> {
  const instancesDTOs = (await commonGetInstancesByRegion(
    projectId,
    regionId,
  )) as TInstanceDTO[];

  return instancesDTOs.map(({ id, status, name, availabilityZone }) => ({
    id,
    status,
    name,
    availabilityZone,
  }));
}
