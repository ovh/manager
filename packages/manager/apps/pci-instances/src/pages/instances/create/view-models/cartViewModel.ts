import {
  TInstancesCatalog,
  TFlavorPrices,
} from '@/domain/entities/instancesCatalog';
import { getRegionNameKey } from './localizationsViewModel';
import { getRegionalizedFlavorOsTypePriceId } from '@/utils';
import { BILLING_TYPE } from '@/types/instance/common.type';
import { mapDisksToViewModel, TDiskViewModel } from './mappers/diskMapper';

export type TSelectLocalizationDetails = {
  cityKey: string;
  datacenterDetails: string;
};

export const selectLocalisationDetails = (
  catalog: TInstancesCatalog | undefined,
) => (
  macroRegionId: string | null,
  microRegionId: string | null,
  availabilityZone: string | null,
): TSelectLocalizationDetails | null => {
  if (!macroRegionId || !microRegionId) return null;

  const macroRegion = catalog?.entities.macroRegions.byId.get(macroRegionId);

  if (!macroRegion) return null;

  const regionName = getRegionNameKey(
    macroRegion.deploymentMode,
    macroRegion.name,
  );

  const cityKey = `manager_components_region_${regionName}`;

  const datacenterDetails = availabilityZone ? availabilityZone : microRegionId;

  return { cityKey, datacenterDetails };
};

export const selectLocalisationDetailsForCreation = (
  macroRegionId: string | null,
  microRegionId: string | null,
  availabilityZone: string | null,
) => (catalog: TInstancesCatalog | undefined) =>
  selectLocalisationDetails(catalog)(
    macroRegionId,
    microRegionId,
    availabilityZone,
  );

export type TSelectFlavorDetails = {
  id: string;
  name: string;
  memory: number;
  vCore: number;
  disks: TDiskViewModel[];
  bandwidthPublic: number;
  bandwidthPrivate: number;
  price: number;
  gpu?: string;
  numberOfGpu?: number;
  vRamTotal?: number;
  gpuMemoryInterface?: string;
};

type TFlavorPricesArgs = {
  flavorName: string;
  regionId: string;
  osType: string;
  flavorPricesById: Map<string, TFlavorPrices>;
  billingType: BILLING_TYPE;
};

const getFlavorPrice = ({
  flavorName,
  regionId,
  osType,
  flavorPricesById,
  billingType,
}: TFlavorPricesArgs): number | null => {
  const flavorOsTypePriceId = getRegionalizedFlavorOsTypePriceId(
    flavorName,
    regionId,
    osType,
  );

  const flavorPrices = flavorPricesById.get(flavorOsTypePriceId);

  if (!flavorPrices) return null;

  return (
    flavorPrices.prices.find((price) =>
      billingType === BILLING_TYPE.Hourly
        ? price.type === 'hour'
        : price.type === 'month',
    )?.price.priceInUcents ?? null
  );
};

export const selectFlavorDetails = (catalog: TInstancesCatalog | undefined) => (
  regionalizedFlavorId: string | null,
  osType: string | null,
  billingType: BILLING_TYPE,
): TSelectFlavorDetails | null => {
  if (!regionalizedFlavorId || !osType || !catalog) return null;

  const data = catalog;
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

  const price = getFlavorPrice({
    flavorName: foundFlavor.name,
    regionId: foundRegionalizedFlavor.regionId,
    osType,
    flavorPricesById: data.entities.flavorPrices.byId,
    billingType,
  });

  if (price === null) return null;

  return {
    id: flavorId,
    name: foundFlavor.name,
    memory: foundFlavor.specifications.ram.value,
    vCore: foundFlavor.specifications.cpu.value,
    disks: mapDisksToViewModel(foundFlavor.specifications.disks),
    bandwidthPublic: foundFlavor.specifications.bandwidth.public.value,
    bandwidthPrivate: foundFlavor.specifications.bandwidth.private.value,
    gpu: foundFlavor.specifications.gpu?.model.unit,
    numberOfGpu: foundFlavor.specifications.gpu?.model.value,
    vRamTotal: foundFlavor.specifications.gpu?.memory.size.value,
    gpuMemoryInterface: foundFlavor.specifications.gpu?.memory.interface,
    price,
  };
};

export const selectFlavorDetailsForCreation = (
  regionalizedFlavorId: string | null,
  osType: string | null,
  billingType: BILLING_TYPE,
) => (catalog: TInstancesCatalog | undefined) =>
  selectFlavorDetails(catalog)(regionalizedFlavorId, osType, billingType);

export const selectWindowsImageLicensePrice = (
  catalog: TInstancesCatalog | undefined,
) => (
  osType: string | null,
  billingType: BILLING_TYPE,
  flavorId: string | null,
): number | null => {
  if (!flavorId || !osType) return null;

  const flavorOsTypePriceId = `${flavorId}_${osType}_price`;

  const flavorPrices = catalog?.entities.flavorPrices.byId.get(
    flavorOsTypePriceId,
  );

  if (!flavorPrices) return null;

  const licensePrice = flavorPrices.prices.find((price) =>
    billingType === BILLING_TYPE.Hourly
      ? price.type === 'licence'
      : price.type === 'licenceMonth',
  );

  return licensePrice?.price.priceInUcents ?? null;
};

export const selectWindowsImageLicensePriceForCreation = (
  osType: string | null,
  billingType: BILLING_TYPE,
  flavorId: string | null,
) => (catalog: TInstancesCatalog | undefined) =>
  selectWindowsImageLicensePrice(catalog)(osType, billingType, flavorId);

export type TQuantityHintParams = {
  quota: number | null;
  type: string | null;
  region: string | null;
  regionId: string | null;
};

export type TSelectQuantityHintParamsArgs = {
  regionalizedFlavorId: string | null;
  macroRegionId: string | null;
  microRegionId: string | null;
  availabilityZone: string | null;
};

export const selectQuantityHintParams = (
  args: TSelectQuantityHintParamsArgs,
) => (catalog: TInstancesCatalog | undefined): TQuantityHintParams => {
  const {
    regionalizedFlavorId,
    macroRegionId,
    microRegionId,
    availabilityZone,
  } = args;

  if (!catalog) {
    return {
      quota: null,
      type: null,
      region: null,
      regionId: null,
    };
  }

  const data = catalog;
  const regionalizedFlavor = regionalizedFlavorId
    ? data.entities.regionalizedFlavors.byId.get(regionalizedFlavorId)
    : null;
  const quota = regionalizedFlavor?.quota ?? null;
  const flavorId = regionalizedFlavor?.flavorId ?? null;

  const macroRegion = macroRegionId
    ? data.entities.macroRegions.byId.get(macroRegionId)
    : null;
  const region = macroRegion
    ? getRegionNameKey(macroRegion.deploymentMode, macroRegion.name) ?? null
    : null;
  const regionId = macroRegion ? availabilityZone ?? microRegionId : null;

  return {
    quota,
    type: flavorId ?? null,
    region,
    regionId,
  };
};

export const selectQuotaByRegionalizedFlavorId = (
  catalog: TInstancesCatalog | undefined,
) => (regionalizedFlavorId: string | null): number | null => {
  if (!catalog || !regionalizedFlavorId) return null;
  const regionalizedFlavor = catalog.entities.regionalizedFlavors.byId.get(
    regionalizedFlavorId,
  );
  return regionalizedFlavor?.quota ?? null;
};
