import { useMemo } from 'react';

import { TProductAvailability, useProductAvailability } from '@ovh-ux/manager-pci-common';
import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';

type TRegion = {
  name: string;
  datacenter: string;
  continentCode: string;
  enabled: boolean;
  type: string;
  availabilityZones: string[];
  codes: string[];
};



export const transformToRegions = (data?: TProductAvailability, standardIsActivated = true): TRegion[] =>
  Object.values(
    data?.plans
      ?.flatMap((plan) => plan.regions.map((region) => ({ ...region, planCode: plan.code })))
      .filter(({ planCode }) => standardIsActivated ? true : (planCode.includes('free') || planCode.includes('.3az')))
      .reduce<Record<string, TRegion>>(
        (acc, { planCode, ...region }) => ({
          ...acc,
          [region.name]: {
            ...region,
            codes: [
              ...(acc[region.name]?.codes ?? []),
              planCode,
            ],
          },
        }),
        {},
      ) ?? {},
  );

function usePlanToRegionAvailability(
  projectId: string,
  product: string,
  options: { transform: true },
): { isPending: true; data: undefined } | { isPending: false; data: TRegion[] };

function usePlanToRegionAvailability<R>(
  projectId: string,
  product: string,
  options: { transform: false; select: (regions: TProductAvailability) => R },
): { isPending: true; data: undefined } | { isPending: false; data: R };

function usePlanToRegionAvailability(
  projectId: string,
  product: string,
  options: { transform: false },
): { isPending: true; data: undefined } | { isPending: false; data: TProductAvailability };

function usePlanToRegionAvailability(
  projectId: string,
  product: string,
  options: { transform: boolean; select?: (regions: TProductAvailability) => unknown },
) {
  const { data: availability, isPending } = useProductAvailability(projectId, {
    addonFamily: product,
  });

  const standardIsActivated = useStandardPlanAvailable();

  const { select, transform } = options;

  const data = useMemo(() => {
    if (isPending || !availability) {
      return { isPending: true };
    }

    if (transform) {
      return { isPending: false, data: transformToRegions(availability, standardIsActivated) };
    }

    if (select) {
      return { isPending: false, data: select(availability) };
    }

    return availability;
  }, [availability, isPending, select, transform]);

  return data;
}
export default usePlanToRegionAvailability;
