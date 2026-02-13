import { v6 } from '@ovh-ux/manager-core-api';

import { TProductAvailabilityDTO } from '@/adapters/tanstack/productAvailability/right/dto.type';
import { mapProductAvailabilityDTOToEntity } from '@/adapters/tanstack/productAvailability/right/mapper';
import { OCTAVIA_LOADBALANCER_ADDON_FAMILY } from '@/constants';
import { TProductAvailability } from '@/domain/entities/productAvailability';

type TGetLoadBalancerAvailabilityRegionsArgs = {
  projectId: string;
  ovhSubsidiary: string;
};

export const getLoadBalancerProductAvailability = async ({
  projectId,
  ovhSubsidiary,
}: TGetLoadBalancerAvailabilityRegionsArgs): Promise<TProductAvailability[]> => {
  const { data } = await v6.get<TProductAvailabilityDTO>(
    `/cloud/project/${projectId}/capabilities/productAvailability`,
    {
      params: {
        ovhSubsidiary,
        addonFamily: OCTAVIA_LOADBALANCER_ADDON_FAMILY,
      },
    },
  );
  return mapProductAvailabilityDTOToEntity(data);
};
