import { useQueries } from '@tanstack/react-query';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

export const useProjectAddons = (
  projectId: string,
  ovhSubsidiary: string,
  instanceRegion: string,
) =>
  useQueries({
    queries: [
      getCatalogQuery(ovhSubsidiary),
      getProductAvailabilityQuery(projectId, ovhSubsidiary),
    ],

    combine: ([
      { data: catalog, isFetching: isCatalogFetching },
      { data: plans, isFetching: isPlansFetching },
    ]) => {
      const plan = plans?.plans?.find(
        ({ code, regions }) =>
          isSnapshotConsumption(code) &&
          regions.find(({ name }) => name === instanceRegion),
      );
      const addons = [
        catalog?.addons.find(({ planCode }) => planCode === plan?.code),
      ];
      const isFetching = isCatalogFetching || isPlansFetching;

      return { addons, isFetching };
    },
  });

export const useInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
  ovhSubsidiary: string,
) => {
  const { addons, ...query } = useProjectAddons(
    projectId,
    ovhSubsidiary,
    instanceRegion,
  );

  const price = addons
    ? addons[0]?.pricings.find((pricing) =>
        pricing.description.includes('hour'),
      )
    : null;

  return {
    ...query,
    data: price,
  };
};
