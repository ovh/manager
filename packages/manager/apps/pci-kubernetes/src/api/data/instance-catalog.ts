import { v6 } from '@ovh-ux/manager-core-api';

export type TInstancePriceType = 'hour' | 'month' | 'licence' | 'licenceMonth' | 'localDisk';

export type TInstancePriceDetails = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TInstancePrice = {
  type: TInstancePriceType;
  price: TInstancePriceDetails;
  includeVat: boolean;
  monthlyEquivalent: TInstancePriceDetails | null;
};

export type TInstanceFlavorPricing = {
  regions: string[];
  osType: string;
  prices: TInstancePrice[];
};

export type TInstanceCatalogFlavor = {
  name: string;
  pricings: TInstanceFlavorPricing[];
};

export type TInstanceCatalog = {
  flavors: TInstanceCatalogFlavor[];
};

export const getInstanceCatalog = async (projectId: string): Promise<TInstanceCatalog> => {
  const { data } = await v6.get<TInstanceCatalog>(`/cloud/project/${projectId}/catalog/instance`);

  return data;
};

const pricesRegion = (regions: string[], region: string) =>
  regions.some((pricedRegion) => pricedRegion.toLowerCase() === region.toLowerCase());

export const getLocalDiskHourlyPrice = (
  catalog: TInstanceCatalog | undefined,
  flavorName: string | null | undefined,
  region: string | null | undefined,
): number | null => {
  if (!catalog || !flavorName || !region) return null;

  return (
    catalog.flavors
      .find((flavor) => flavor.name === flavorName)
      ?.pricings.filter(({ regions }) => pricesRegion(regions, region))
      .flatMap(({ prices }) => prices)
      .find((price) => price.type === 'localDisk')?.price.priceInUcents ?? null
  );
};
