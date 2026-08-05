import { v6 } from '@ovh-ux/manager-core-api';

export type TNetworkCatalogPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TIpModel = {
  type: 'PublicIP' | 'FloatingIP';
  pricings: {
    regions: string[];
    price: TNetworkCatalogPrice;
  }[];
};

export type TNetworkCatalogRegion = {
  name: string;
  type: string;
  availabilityZones?: string[];
};

export type TNetworkCatalog = {
  ipModels: TIpModel[];
  regions: TNetworkCatalogRegion[];
};

export const getNetworkCatalogUrl = (projectId: string) =>
  `/cloud/project/${projectId}/catalog/network`;

export const getNetworkCatalog = async (
  projectId: string,
): Promise<TNetworkCatalog> => {
  const { data } = await v6.get<TNetworkCatalog>(
    getNetworkCatalogUrl(projectId),
  );
  return data;
};
