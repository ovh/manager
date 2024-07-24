import { v6 } from '@ovh-ux/manager-core-api';

export type TAvailableRegionsResponse = {
  products: {
    name: string;
    regions: {
      name: string;
      type: string;
    }[];
  }[];
};

export const getAvailableRegions = async (
  projectId: string,
  ovhSubsidiary: string,
  product: string,
) => {
  const { data } = await v6.get<TAvailableRegionsResponse>(
    `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${ovhSubsidiary}&product=${product}`,
  );
  return data;
};
