import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-pci-common';

type TPlan = {
  code: string;
  regions: string[];
};

type TProduct = {
  name: string;
  regions: string[];
};

type TAvailabilityData = {
  plans: TPlan[];
  products: TProduct[];
};

export const getProductRegionsAvailability = async (
  ovhSubsidiary: string,
): Promise<string[]> => {
  const { data } = await v6.get<TAvailabilityData>(
    `/cloud/order/rule/availability?ovhSubsidiary=${ovhSubsidiary}&planCode=coldarchive.archive.hour.consumption`,
  );
  return data?.plans[0]?.regions;
};

export const getArchiveRegionDetails = async (
  projectId: string,
  region: string,
): Promise<TRegion> => {
  const { data } = await v6.get<TRegion>(
    `/cloud/project/${projectId}/region/${region}`,
  );
  return data;
};
