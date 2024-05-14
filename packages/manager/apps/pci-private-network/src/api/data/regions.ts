import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

type TRegionService = {
  endpoint: string;
  name: string;
  status: string;
};

export type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
  ipCountries: string[];
  services: TRegionService[];
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export type TGateway = {
  id: string;
  model: string;
  name: string;
  region: string;
  status: string;
  interfaces: {
    id: string;
    ip: string;
    networkId: string;
    subnetId: string;
  }[];
  externalInformation: {
    ips: { ip: string; subnetId: string }[];
    networkId: string;
  };
};

export const getGateways = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TGateway[] }>(
    `/cloud/project/${projectId}/aggregated/gateway`,
  );

  return data?.resources;
};

export const getGatewayCatalog = async (
  ovhSubsidiary: string,
  productName = 'cloud',
) => {
  const { data } = await v6.get(`/order/catalog/public/cloud`, {
    params: { ovhSubsidiary, productName },
  });

  return data;
};

export const getGatewaysByRegion = async (
  projectId: string,
  regionName: string,
) => {
  const { data } = await v6.get<TGateway[]>(
    `/cloud/project/${projectId}/region/${regionName}/gateway`,
  );

  return data;
};

export const getProductAvailability = async (
  projectId: string,
  ovhSubsidiary: string,
  planCode: string,
) => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/capabilities/productAvailability`,
    {
      params: { ovhSubsidiary, planCode },
    },
  );

  return data?.plans;
};
