import { v6 } from '@ovh-ux/manager-core-api';

import { TProductAvailabilityResponseDTO } from '@/adapters/api/productAvailability/dto.types';
import { mapProductAvailabilityToEntity } from '@/adapters/api/productAvailability/mapper';

export type TAvailableRegionsResponse = {
  products: {
    name: string;
    regions: {
      name: string;
      type: string;
    }[];
  }[];
};

/** @deprecated  */
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

type TProductAvailabilityFilter = {
  ovhSubsidiary: string;
  addonFamily: string;
};

export const getAvailabilityRegions = async (
  projectId: string,
  filter: TProductAvailabilityFilter,
) => {
  const data = await v6
    .get<TProductAvailabilityResponseDTO>(
      `/cloud/project/${projectId}/capabilities/productAvailability`,
      {
        params: filter,
      },
    )
    .then(({ data }) => mapProductAvailabilityToEntity(data));
  return data;
};
