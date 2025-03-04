import { useMemo } from 'react';
import { AGORA_ADDON_FAMILY } from '@/constants';
import { Addon, RegionAddon } from '@/types/addon.type';
import { useAddons } from '../useAddons/useAddons';
import { SIZE_ORDER } from '../useAddons/useAddons.constant';

export const useLoadBalancerAddons = (
  ovhSubsidiary: string,
  projectId: string,
) => {
  const { addons, isFetching } = useAddons(
    ovhSubsidiary,
    projectId,
    AGORA_ADDON_FAMILY,
  );

  return useMemo(
    () => ({
      addons: addons?.filter((addon) =>
        addon?.pricings.find((pricing) =>
          ['none', 'hour'].includes(pricing.intervalUnit),
        ),
      ),
      isFetching,
    }),
    [addons, isFetching],
  );
};

export const useRegionLoadBalancerAddons = (
  addons: RegionAddon[],
  region: string,
): Addon[] =>
  useMemo(
    () =>
      addons
        .filter((addon) => addon.regions.some(({ name }) => name === region))
        .map(({ product, pricings, blobs }) => ({
          size: product.split('-').pop(),
          price: pricings[0].price,
          technicalName: blobs.technical.name,
        }))
        .sort(
          (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
        ),
    [addons, region],
  );
