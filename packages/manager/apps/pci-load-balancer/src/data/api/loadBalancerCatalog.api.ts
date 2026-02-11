import { v6 } from '@ovh-ux/manager-core-api';

import { TLoadBalancerCatalogDTO } from '@/adapters/tanstack/loadBalancerCatalog/right/dto.type';
import { mapLoadBalancerCatalogDTOToEntity } from '@/adapters/tanstack/loadBalancerCatalog/right/mapper';
import { TLoadBalancerCatalog } from '@/domain/entities/loadBalancerCatalog';

type TGetLoadBalancerCatalogArgs = {
  ovhSubsidiary: string;
};

export const getLoadBalancerCatalog = async ({
  ovhSubsidiary,
}: TGetLoadBalancerCatalogArgs): Promise<TLoadBalancerCatalog[]> => {
  const { data } = await v6.get<TLoadBalancerCatalogDTO>('/order/catalog/public/cloud', {
    params: { ovhSubsidiary },
  });
  return mapLoadBalancerCatalogDTOToEntity(data);
};
