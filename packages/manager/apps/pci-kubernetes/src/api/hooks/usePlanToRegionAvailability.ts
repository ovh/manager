import { useMemo } from 'react';

import { useProductAvailability } from '@ovh-ux/manager-pci-common';

import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { TClusterPlanEnum, TProductAvailability, TRegionCodes } from '@/types';

const code3AZ = '3az';

/**
 * Transforms a plan-based availability structure into a region-based structure.
 *
 * The input data has a model organized by plans, where each plan contains its available regions:
 * ```
 * plans: [
 *   { code: 'standard.hour', regions: [{ name: 'GRA7', ... }, { name: 'BHS5', ... }] },
 *   { code: 'free.hour', regions: [{ name: 'GRA7', ... }, { name: 'SBG5', ... }] },
 *   { code: 'standard.3az.hour', regions: [{ name: 'EU-WEST-PAR', ... }] }
 * ]
 * ```
 *
 * This function flattens and groups these nested arrays to produce a region-based model,
 * where each region contains a `codes` property listing all the plans available for that region:
 * ```
 * [
 *   { name: 'GRA7', ..., codes: ['standard.hour', 'free.hour'] },
 *   { name: 'BHS5', ..., codes: ['standard.hour'] },
 * ]
 * ```
 *
 * @param data - The product availability data containing plans with their regions
 * @param standardIsActivated - Feature Flip)
 * @returns An array of regions, each enriched with a `codes` array of available plan codes
 */
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
          planCode.includes(TClusterPlanEnum.FREE) ||
          planCode.includes(code3AZ),
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
