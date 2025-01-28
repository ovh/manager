import { useQueries } from '@tanstack/react-query';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';

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
      { data: catalog, isFetching: isCatalogFetchibng },
      { data: plans, isFetching: isPlansFetching },
    ]) => {
      const plan = plans?.plans?.find(
        ({ code, regions }) =>
          code.startsWith('snapshot.consumption') &&
          regions.find(({ name }) => name === instanceRegion),
      );
      const addons = [
        catalog?.addons.find(({ planCode }) => planCode === plan.code),
      ];
      const isFetching = isCatalogFetchibng || isPlansFetching;

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
