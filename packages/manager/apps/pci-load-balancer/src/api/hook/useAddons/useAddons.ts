import { useMemo } from 'react';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
  TRegion,
} from '@ovh-ux/manager-pci-common';
import { useQueries } from '@tanstack/react-query';
import { Addon, RegionAddon } from '@/types/addon.type';
import { SIZE_ORDER } from './useAddons.constant';

export const useAddons = (
  ovhSubsidiary: string,
  projectId: string,
  addonFamily: string,
) =>
  useQueries({
    queries: [
      getCatalogQuery(ovhSubsidiary),
      getProductAvailabilityQuery(projectId, ovhSubsidiary, {
        addonFamily,
      }),
    ],
    combine: ([
      { data: catalog, isFetching: isCatalogFetching },
      { data: plans, isFetching: isPlansFetching },
    ]): {
      addons: RegionAddon[];
      isFetching: boolean;
    } => {
      const addons = plans?.plans?.map(({ code, regions }) => {
        const addon = catalog?.addons.find(({ planCode }) => code === planCode);

        return addon
          ? {
              ...addon,
              regions: (regions as unknown) as TRegion[],
            }
          : null;
      });

      return {
        addons,
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });

export const useRegionAddons = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
  addonFamily: string,
): { addons: Addon[]; isFetching: boolean } => {
  const { addons, isFetching } = useAddons(
    ovhSubsidiary,
    projectId,
    addonFamily,
  );

  return useMemo(
    () => ({
      addons: addons
        ?.filter(
          ({ regions, pricings }) =>
            regions.some(({ name }) => name === region) &&
            pricings.find((pricing) =>
              ['none', 'hour'].includes(pricing.intervalUnit),
            ),
        )
        .map(({ product, pricings, blobs }) => ({
          size: product.split('-').pop(),
          price: pricings[0].price,
          technicalName: blobs?.technical?.name,
        }))
        .sort(
          (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
        ),
      isFetching,
    }),
    [addons, isFetching, region],
  );
};
