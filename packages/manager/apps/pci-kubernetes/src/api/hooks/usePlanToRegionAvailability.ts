import { useMemo } from 'react';

import { useProductAvailability } from '@ovh-ux/manager-pci-common';

import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { TClusterPlanCodeEnum } from '@/types';
import { TProductAvailability, TRegionCodes } from '@/types/region';

export const transformToRegions = (
  data?: TProductAvailability,
  standardIsActivated = true,
): TRegionCodes[] =>
  Object.values(
    data?.plans
      .flatMap((plan) => plan.regions.map((region) => ({ ...region, planCode: plan.code })))
      .filter(
        ({ planCode }) =>
          standardIsActivated ||
          planCode === TClusterPlanCodeEnum.FREE1AZ ||
          planCode === TClusterPlanCodeEnum.STANDARD3AZ,
      )
      .reduce<Record<string, TRegionCodes>>(
        (acc, { planCode, ...region }) => ({
          ...acc,
          [region.name]: {
            ...region,
            codes: [...(acc[region.name]?.codes ?? []), planCode],
          },
        }),
        {},
      ) ?? {},
  );

type PlanToRegionAvailabilityResult =
  | { isPending: true; data: undefined }
  | { isPending: false; data: TRegionCodes[] };

function usePlanToRegionAvailability(
  projectId: string,
  product: string,
): PlanToRegionAvailabilityResult {
  const { data: availability, isPending } = useProductAvailability(projectId, {
    addonFamily: product,
  });

  const standardIsActivated = useStandardPlanAvailable();

  return useMemo((): PlanToRegionAvailabilityResult => {
    if (isPending || !availability) {
      return { isPending: true, data: undefined };
    }
    return {
      isPending: false,
      data: transformToRegions(availability as TProductAvailability, standardIsActivated),
    };
  }, [availability, isPending, standardIsActivated]);
}

export default usePlanToRegionAvailability;
