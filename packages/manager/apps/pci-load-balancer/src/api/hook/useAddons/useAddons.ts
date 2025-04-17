import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useQueries } from '@tanstack/react-query';
import { TProductAddonDetail } from '@/types/product.type';
import { getAddonsRegions, getHourlyAddons } from './useAddons.select';

type TUseAddonsParams = {
  ovhSubsidiary: string;
  projectId: string;
  addonFamily: string;
  select?: (addons: TProductAddonDetail[]) => TProductAddonDetail[];
};

export const useAddons = ({
  ovhSubsidiary,
  projectId,
  addonFamily,
  select,
}: TUseAddonsParams) =>
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
      const addons = getAddonsRegions(plans?.plans ?? [], catalog);
      const hourlyAddons = getHourlyAddons(addons).map(
        ({ product, pricings, blobs, regions }) => ({
          size: product.split('-').pop(),
          price: pricings[0].price,
          technicalName: blobs?.technical?.name,
          bandwidth: blobs?.technical?.bandwidth?.level,
          regions,
        }),
      );

      return {
        addons: select ? select(hourlyAddons) : hourlyAddons,
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });
