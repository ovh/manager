import { TProductAvailability } from '@/domain/entities/productAvailability';
import { isOctaviaLoadBalancerPlan } from '@/domain/services/productAvailability.service';

import type { TProductAvailabilityDTO } from './dto.type';

export const mapProductAvailabilityDTOToEntity = (
  dto: TProductAvailabilityDTO,
): TProductAvailability[] =>
  dto.plans
    .filter((plan) => isOctaviaLoadBalancerPlan(plan.code))
    .map((plan) => ({
      planCode: plan.code,
      regions: plan.regions.map((region) => region.name),
    }));
