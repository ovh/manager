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

export type TSelectFlavorDetails = {
  id: string;
  name: string;
  memory: number;
  vCore: number;
  storage: number;
  bandwidthPublic: number;
  bandwidthPrivate: number;
  gpu?: string;
  numberOfGpu?: number;
  vRamTotal?: number;
};

type TSelectFlavorData = (
  projectId: string,
  regionalizedFlavorId: string | null,
) => TSelectFlavorDetails | null;

export const selectFlavorDetails: Reader<Deps, TSelectFlavorData> = (deps) => {
  return (projectId, regionalizedFlavorId) => {
    console.log(
      '🚀 ~ selectFlavorDetails ~ regionalizedFlavorId:',
      regionalizedFlavorId,
    );
    if (!regionalizedFlavorId) return null;
    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);

    const foundRegionalizedFlavor = data?.entities.regionalizedFlavors.byId.get(
      regionalizedFlavorId,
    );
    console.log(
      '🚀 ~ selectFlavorDetails ~ foundRegionalizedFlavor:',
      foundRegionalizedFlavor,
    );
    if (!foundRegionalizedFlavor) return null;

    const foundFlavor = data?.entities.flavors.byId.get(
      foundRegionalizedFlavor.flavorId,
    );
    console.log('🚀 ~ selectFlavorDetails ~ foundFlavor:', foundFlavor);
    if (!foundFlavor) return null;

    // TODO: adapt to GPU
    return {
      id: regionalizedFlavorId,
      name: foundFlavor.name,
      memory: foundFlavor.specifications.ram.value,
      vCore: foundFlavor.specifications.cpu.value,
      storage: foundFlavor.specifications.storage.value,
      bandwidthPublic: foundFlavor.specifications.bandwidth.public.value,
      bandwidthPrivate: foundFlavor.specifications.bandwidth.private.value,
    };
  };
};
