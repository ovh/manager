import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';
import { getRegionalizedFlavorOsTypePriceId } from '@/utils';
import { TFlavorPrices } from '@/domain/entities/instancesCatalog';
import { BILLING_TYPE } from '@/types/instance/common.type';

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

export type TSelectFlavorDetails = {
  id: string;
  name: string;
  memory: number;
  vCore: number;
  storage: number;
  bandwidthPublic: number;
  bandwidthPrivate: number;
  price: number;
  gpu?: string;
  numberOfGpu?: number;
  vRamTotal?: number;
};

type TSelectFlavorData = (
  projectId: string,
  regionalizedFlavorId: string | null,
  osType: string | null,
  billingType: BILLING_TYPE,
) => TSelectFlavorDetails | null;

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

export const selectFlavorDetails: Reader<Deps, TSelectFlavorData> = (deps) => {
  return (projectId, regionalizedFlavorId, osType, billingType) => {
    if (!regionalizedFlavorId || !osType) return null;

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

    const price = getFlavorPrice({
      flavorName: foundFlavor.name,
      regionId: foundRegionalizedFlavor.regionId,
      osType,
      flavorPricesById: data.entities.flavorPrices.byId,
      billingType,
    });

    if (price === null) return null;

    // TODO: adapt to GPU
    return {
      id: flavorId,
      name: foundFlavor.name,
      memory: foundFlavor.specifications.ram.value,
      vCore: foundFlavor.specifications.cpu.value,
      storage: foundFlavor.specifications.storage.value,
      bandwidthPublic: foundFlavor.specifications.bandwidth.public.value,
      bandwidthPrivate: foundFlavor.specifications.bandwidth.private.value,
      price,
    };
  };
};

type TSelectWindowsImageLicensePrice = (
  projectId: string,
  osType: string | null,
  billingType: BILLING_TYPE,
  flavorId?: string | null,
) => number | null;

export const selectWindowsImageLicensePrice: Reader<
  Deps,
  TSelectWindowsImageLicensePrice
> = (deps) => {
  return (projectId, osType, billingType, flavorId) => {
    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);

    if (!flavorId || !osType) return null;

    const flavorOsTypePriceId = `${flavorId}_${osType}_price`;

    const flavorPrices = data?.entities.flavorPrices.byId.get(
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
};
