import { v6 } from '@ovh-ux/manager-core-api';

export type TPublicIpType = 'PublicIP' | 'FloatingIP';

export type TCatalogPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TRegionalizedPricing = {
  regions: string[];
  price: TCatalogPrice;
};

export type TIpModel = {
  type: TPublicIpType;
  pricings: TRegionalizedPricing[];
};

export type TNetworkCatalog = {
  ipModels: TIpModel[];
};

export const getNetworkCatalog = async (
  projectId: string,
): Promise<TNetworkCatalog> => {
  const { data } = await v6.get<TNetworkCatalog>(
    `/cloud/project/${projectId}/catalog/network`,
  );

  return data;
};

const matches = (catalogValue: string, expected: string) =>
  catalogValue.toLowerCase() === expected.toLowerCase();

export const getPublicIpHourlyPrice = (
  catalog: TNetworkCatalog | undefined,
  type: TPublicIpType,
  region: string | null,
): number | null => {
  if (!catalog || !region) return null;

  const pricing = catalog.ipModels
    .find((ipModel) => matches(ipModel.type, type))
    ?.pricings.find(({ regions }) =>
      regions.some((pricedRegion) => matches(pricedRegion, region)),
    );

  return pricing?.price.priceInUcents ?? null;
};
