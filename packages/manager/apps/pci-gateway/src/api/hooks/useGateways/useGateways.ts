import { useMemo } from 'react';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useQueries } from '@tanstack/react-query';
import { GATEWAY_ADDON_FAMILY, SIZE_ORDER } from './useGateways.constant';
import { TAddonRegions, TProductAddonDetail } from '@/types/addon.type';

export const useGatewayHourlyAddons = (
  ovhSubsidiary: string,
  projectId: string,
) =>
  useQueries({
    queries: [
      getCatalogQuery(ovhSubsidiary),
      getProductAvailabilityQuery(projectId, ovhSubsidiary, {
        addonFamily: GATEWAY_ADDON_FAMILY,
      }),
    ],
    combine: ([
      { data: catalog, isFetching: isCatalogFetching },
      { data: plans, isFetching: isPlansFetching },
    ]): { addons: TAddonRegions; isFetching: boolean } => {
      const addons = (plans?.plans ?? [])
        .flatMap(({ code, regions }) => {
          const addon = catalog?.addons.find(
            ({ planCode }) => code === planCode,
          );
          return addon ? [{ ...addon, regions }] : [];
        })
        .filter((addon) =>
          addon.pricings?.find(({ intervalUnit }) =>
            ['none', 'hour'].includes(intervalUnit),
          ),
        );

      return {
        addons,
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });

export const useRegionGatewayAddons = (
  ovhSubsidiary: string,
  projectId: string,
  region: string,
): TProductAddonDetail[] => {
  const { addons } = useGatewayHourlyAddons(ovhSubsidiary, projectId);

  return useMemo(
    () =>
      addons
        .filter((addon) => addon.regions.some(({ name }) => name === region))
        .map(({ product, pricings, blobs }) => ({
          size: product.split('-').pop(),
          price: pricings[0].price,
          bandwidth: blobs.technical.bandwidth.level,
        }))
        .sort(
          (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
        ),
    [addons, region],
  );
};
