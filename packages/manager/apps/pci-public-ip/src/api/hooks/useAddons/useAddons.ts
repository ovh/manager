import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useQueries } from '@tanstack/react-query';
import { TProductAddonDetail } from '@/types/product.type';

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
      const addons = (plans?.plans ?? [])
        .flatMap(({ code, regions }) => {
          const addon = catalog?.addons.find(
            ({ planCode }) => code === planCode,
          );
          return addon ? [{ ...addon, regions }] : [];
        })
        .filter((addon) =>
          addon.pricings.find(({ intervalUnit }) =>
            ['none', 'hour'].includes(intervalUnit),
          ),
        )
        .map(({ product, pricings, blobs, regions }) => ({
          size: product.split('-').pop(),
          price: pricings[0].price,
          technicalName: blobs?.technical?.name,
          regions,
        }));

      return {
        addons: select ? select(addons) : addons,
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });
