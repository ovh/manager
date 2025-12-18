import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';
import { getRegionalizedFlavorOsTypePriceId } from '@/utils';
import {
  TFlavorPrices,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';
import { getMinimumPrices } from './flavorsViewModel';

export type TSelectLocalizationDetails = {
  cityKey: string;
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

  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  const macroRegion = data?.entities.macroRegions.byId.get(macroRegionId);

  if (!macroRegion) return null;

  const regionName = getRegionNameKey(
    macroRegion.deploymentMode,
    macroRegion.name,
  );

  const cityKey = `manager_components_region_${regionName}`;

  const datacenterDetails = availabilityZone ? availabilityZone : microRegionId;

  return { cityKey, datacenterDetails };
};

type TFlavorCartPrice = {
  hourlyPrice: number | null;
  monthlyPrice: number | null;
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
  osType: string | null,
) => TSelectFlavorDetails | null;

const getFlavorPrices = (
  flavorName: string,
  regionId: string,
  osType: string,
  flavorPricesById: Map<string, TFlavorPrices>,
): TFlavorCartPrice => {
  const flavorOsTypePriceId = getRegionalizedFlavorOsTypePriceId(
    flavorName,
    regionId,
    osType,
  );

  const flavorPrices = flavorPricesById.get(flavorOsTypePriceId);

  if (!flavorPrices)
    return {
      hourlyPrice: null,
      monthlyPrice: null,
    };

  return flavorPrices.prices.reduce<TFlavorCartPrice>(
    (acc, price) => {
      if (price.type === 'hour') acc.hourlyPrice = price.price.priceInUcents;
      if (price.type === 'month') acc.monthlyPrice = price.price.priceInUcents;
      return acc;
    },
    {
      hourlyPrice: null,
      monthlyPrice: null,
    },
  );
};

const getFlavorMinimumPrices = (
  flavoName: string,
  foundRegionalizedFlavor: TRegionalizedFlavor,
  flavorPricesById: Map<string, TFlavorPrices>,
): TFlavorCartPrice => {
  const pricings = foundRegionalizedFlavor.osTypes.flatMap((osType) => {
    const flavorPriceId = getRegionalizedFlavorOsTypePriceId(
      flavoName,
      foundRegionalizedFlavor.regionId,
      osType,
    );
    const pricing = flavorPricesById.get(flavorPriceId);
    return pricing ? [pricing] : [];
  });

  const minimumPrices = getMinimumPrices(pricings);

  return {
    hourlyPrice: minimumPrices.realMinimumHourlyPrice,
    monthlyPrice: minimumPrices.realMinimumMonthlyPrice,
  };
};

export const selectFlavorDetails: Reader<Deps, TSelectFlavorData> = (deps) => {
  return (projectId, regionalizedFlavorId, osType) => {
    if (!regionalizedFlavorId) return null;

    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);
    if (!data) return null;

    const foundRegionalizedFlavor = data.entities.regionalizedFlavors.byId.get(
      regionalizedFlavorId,
    );

    if (!foundRegionalizedFlavor) return null;

    const foundFlavor = data.entities.flavors.byId.get(
      foundRegionalizedFlavor.flavorId,
    );

    const flavorId =
      data.entities.regionalizedFlavorOsTypes.byId.get(
        `${regionalizedFlavorId}_${osType}`,
      )?.flavorId ?? null;

    if (!foundFlavor || !flavorId) return null;

    const prices = osType
      ? getFlavorPrices(
          foundFlavor.name,
          foundRegionalizedFlavor.regionId,
          osType,
          data.entities.flavorPrices.byId,
        )
      : getFlavorMinimumPrices(
          foundFlavor.name,
          foundRegionalizedFlavor,
          data.entities.flavorPrices.byId,
        );

    // TODO: adapt to GPU
    return {
      id: flavorId,
      name: foundFlavor.name,
      memory: foundFlavor.specifications.ram.value,
      vCore: foundFlavor.specifications.cpu.value,
      storage: foundFlavor.specifications.storage.value,
      bandwidthPublic: foundFlavor.specifications.bandwidth.public.value,
      bandwidthPrivate: foundFlavor.specifications.bandwidth.private.value,
      prices: prices,
    };
  };
};

type TSelectWindowsImageLicensePrice = (
  projectId: string,
  osType: string | null,
  flavorId?: string | null,
) => number | null;

export const selectWindowsImageLicensePrice: Reader<
  Deps,
  TSelectWindowsImageLicensePrice
> = (deps) => {
  return (projectId, osType, flavorId) => {
    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);

    if (!flavorId || !osType) return null;

    const flavorOsTypePriceId = `${flavorId}_${osType}_price`;

    const flavorPrices = data?.entities.flavorPrices.byId.get(
      flavorOsTypePriceId,
    );

    if (!flavorPrices) return null;

    const licensePrice = flavorPrices.prices.find(
      (price) => price.type === 'licence',
    );

    return licensePrice?.price.priceInUcents ?? null;
  };
};
