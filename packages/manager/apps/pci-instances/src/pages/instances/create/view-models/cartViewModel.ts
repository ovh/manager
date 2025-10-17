import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';

type TSelectLocalizationDetails = {
  city: string;
  datacenterDetails: string;
};

type TSelectLocalizationData = (
  projectId: string,
  macroRegionId: string | null,
  microRegionId: string | null,
  availabilityZone: string | null,
) => TSelectLocalizationDetails | null;

export const selectLocalisationDetails: Reader<
  Deps,
  TSelectLocalizationData
> = (deps) => (projectId, macroRegionId, microRegionId, availabilityZone) => {
  if (!macroRegionId || !microRegionId) return null;

  const { instancesCatalogPort, messageProviderPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  const macroRegion = data?.entities.macroRegions.byId.get(macroRegionId);

  if (!macroRegion) return null;

  const regionName = getRegionNameKey(
    macroRegion.deploymentMode,
    macroRegion.name,
  );

  const city = messageProviderPort.getMessage(
    `regions:manager_components_region_${regionName}`,
  );

  const datacenterDetails = availabilityZone ? availabilityZone : microRegionId;

  return { city, datacenterDetails };
};
