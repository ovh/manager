import { TLoadBalancerCatalog, TPrice } from '@/domain/entities/loadBalancerCatalog';
import { isOctaviaLoadBalancerPlan } from '@/domain/services/productAvailability.service';

import { TLoadBalancerCatalogDTO, TPricingDTO } from './dto.type';

const mapPricingDTOToPrice = ({ price, intervalUnit }: TPricingDTO): TPrice => ({
  priceInUcents: price,
  type: intervalUnit,
});

export const mapLoadBalancerCatalogDTOToEntity = (
  dto: TLoadBalancerCatalogDTO,
): TLoadBalancerCatalog[] =>
  dto.addons
    .filter((plan) => isOctaviaLoadBalancerPlan(plan.planCode))
    .map(({ planCode, product, pricings }) => ({
      planCode,
      product,
      pricing: pricings.map(mapPricingDTOToPrice),
    }));
