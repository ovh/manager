import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';
import { getRegionalizedFlavorOsTypePriceId } from '@/utils';
import { TFlavorPrices } from '@/domain/entities/instancesCatalog';
import { TDistributionImageVersion } from '../CreateInstance.schema';

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

type TFlavorCartPrice = {
  hourlyPrice: number | null;
  monthlyPrice: number | null;
  licencePrice: number | null;
};

export type TSelectFlavorDetails = {
  id: string;
  name: string;
  memory: number;
  vCore: number;
  storage: number;
  bandwidthPublic: number;
  bandwidthPrivate: number;
  prices: TFlavorCartPrice;
  gpu?: string;
  numberOfGpu?: number;
  vRamTotal?: number;
};

type TSelectFlavorData = (
  projectId: string,
  regionalizedFlavorId: string | null,
  distributionImageVersion: TDistributionImageVersion | null,
) => TSelectFlavorDetails | null;

const getPrices = (flavorPrices: TFlavorPrices) =>
  flavorPrices.prices.reduce<TFlavorCartPrice>(
    (acc, price) => {
      if (!acc.licencePrice && price.type === 'licence')
        acc.licencePrice = price.price.priceInUcents;
      if (!acc.licencePrice && price.type === 'hour')
        acc.hourlyPrice = price.price.priceInUcents;
      if (!acc.licencePrice && price.type === 'month')
        acc.monthlyPrice = price.price.priceInUcents;

      return acc;
    },
    {
      hourlyPrice: null,
      monthlyPrice: null,
      licencePrice: null,
    },
  );

export const selectFlavorDetails: Reader<Deps, TSelectFlavorData> = (deps) => {
  return (projectId, regionalizedFlavorId, distributionImageVersion) => {
    if (
      !regionalizedFlavorId ||
      !distributionImageVersion?.distributionImageVersionName
    )
      return null;

    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);

    const foundRegionalizedFlavor = data?.entities.regionalizedFlavors.byId.get(
      regionalizedFlavorId,
    );

    if (!foundRegionalizedFlavor) return null;

    const foundFlavor = data?.entities.flavors.byId.get(
      foundRegionalizedFlavor.flavorId,
    );

    const foundImage = data?.entities.images.byId.get(
      distributionImageVersion.distributionImageVersionName,
    );
    if (!foundFlavor || !foundImage) return null;

    const flavorOsTypePriceId = getRegionalizedFlavorOsTypePriceId(
      foundFlavor.name,
      foundRegionalizedFlavor.regionId,
      foundImage.osType,
    );

    const flavorPrices = data?.entities.flavorPrices.byId.get(
      flavorOsTypePriceId,
    );

    if (!flavorPrices) return null;

    // TODO: adapt to GPU
    return {
      id: regionalizedFlavorId,
      name: foundFlavor.name,
      memory: foundFlavor.specifications.ram.value,
      vCore: foundFlavor.specifications.cpu.value,
      storage: foundFlavor.specifications.storage.value,
      bandwidthPublic: foundFlavor.specifications.bandwidth.public.value,
      bandwidthPrivate: foundFlavor.specifications.bandwidth.private.value,
      prices: getPrices(flavorPrices),
    };
  };
};
