import { TLoadBalancerFlavor } from '@/domain/entities/loadBalancerFlavor';

import { TLoadBalancerFlavorDTO } from './dto.type';

export const mapLoadBalancerFlavorsDTOToEntity = (
  dtos: TLoadBalancerFlavorDTO[],
): TLoadBalancerFlavor[] =>
  dtos.map(({ id, name, region }) => ({
    id,
    name,
    region,
  }));
