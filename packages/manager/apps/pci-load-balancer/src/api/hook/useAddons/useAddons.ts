import { useMemo } from 'react';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useQueries } from '@tanstack/react-query';
import { TAddonRegions } from '@/types/region.type';
import { sortProductBySize } from './addons.select';

type UseAddonsParams = {
  ovhSubsidiary: string;
  projectId: string;
  addonFamily: string;
  select?: (addons: TAddonRegions) => TAddonRegions;
};

type UseRegionAddonsParams = {
  ovhSubsidiary: string;
  projectId: string;
  region: string;
  addonFamily: string;
};

export const useAddons = ({
  ovhSubsidiary,
  projectId,
  addonFamily,
  select,
}: UseAddonsParams) =>
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
    ]) => {
      const addons = (plans?.plans ?? []).flatMap(({ code, regions }) => {
        const addon = catalog?.addons.find(({ planCode }) => code === planCode);
        return addon ? [{ ...addon, regions }] : [];
      });

      return {
        addons: select ? select(addons) : addons,
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });

export const useRegionAddons = ({
  ovhSubsidiary,
  projectId,
  region,
  addonFamily,
}: UseRegionAddonsParams) => {
  const { addons: data, isFetching } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily,
  });

  const addons = useMemo(() => {
    const products =
      data.filter(
        ({ regions, pricings }) =>
          regions.some(({ name }) => name === region) &&
          pricings?.find((pricing) =>
            ['none', 'hour'].includes(pricing.intervalUnit),
          ),
      ) || [];

    return sortProductBySize(products);
  }, [data, region]);

  return { addons, isFetching };
};
