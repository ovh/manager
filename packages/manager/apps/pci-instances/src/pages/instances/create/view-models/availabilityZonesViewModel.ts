import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';

type TSelectAvailabilityZonesData = (
  projectId: string,
  regionId: string | null,
) => string[];

export const selectAvailabilityZones: Reader<
  Deps,
  TSelectAvailabilityZonesData
> = (deps) => (projectId, regionId) => {
  if (!regionId) return [];

  const data = deps.instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  return data.entities.microRegions.byId.get(regionId)?.availabilityZones || [];
};
