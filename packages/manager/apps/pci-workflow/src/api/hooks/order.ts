import { useQueries } from '@tanstack/react-query';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { useMe } from '@ovh-ux/manager-react-components';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

export const useProjectSnapshotAddons = (projectId: string) => {
  const { me } = useMe();
  return useQueries({
    queries: [
      { ...getCatalogQuery(me?.ovhSubsidiary), enabled: !!me?.ovhSubsidiary },
      {
        ...getProductAvailabilityQuery(projectId, me?.ovhSubsidiary, {
          addonFamily: 'snapshot',
        }),
        enabled: !!me?.ovhSubsidiary,
      },
    ],

    combine: ([
      { data: catalog, isFetching: isCatalogFetching },
      { data: snapshotAvailabilities, isFetching: isPlansFetching },
    ]) => {
      const snapshotRegionPlans = new Map(
        snapshotAvailabilities?.plans
          ?.filter(({ code }) => isSnapshotConsumption(code))
          .map(({ code, regions }) => [code, regions]) ?? [],
      );

      return {
        addons: catalog?.addons
          .filter(({ planCode }) => snapshotRegionPlans.has(planCode))
          .map((addon) => ({
            ...addon,
            regions: snapshotRegionPlans.get(addon.planCode),
          })),
        isFetching: isCatalogFetching || isPlansFetching,
      };
    },
  });
};

export const useInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
) => {
  const { addons, ...query } = useProjectSnapshotAddons(projectId);

  const price = useMemo(
    () =>
      addons
        ?.find(({ regions }) =>
          regions.find(({ name }) => name === instanceRegion),
        )
        ?.pricings.find(
          ({ intervalUnit }) =>
            intervalUnit === 'none' || intervalUnit === 'hour',
        ),
    [addons, instanceRegion],
  );

  return {
    ...query,
    data: price,
  };
};
