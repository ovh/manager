import { usePrefetchQuery, useQueries } from '@tanstack/react-query';

import { getCatalogQuery, getProductAvailabilityQuery } from '@ovh-ux/manager-pci-common';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useMe } from '@/api/hooks/user';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

export const useInstanceSnapshotPricing = (projectId: string, instanceId: TInstance['id']) => {
  const { me } = useMe();
  return useQueries({
    queries: [
      getCatalogQuery(me.ovhSubsidiary),
      getProductAvailabilityQuery(projectId, me.ovhSubsidiary, {
        addonFamily: 'snapshot',
      }),
    ],

    combine: ([{ data: catalog }, { data: snapshotAvailabilities }]) => {
      if (!snapshotAvailabilities || !catalog)
        return {
          isPending: true,
          pricing: null,
        };

      const snapshotPlan =
        snapshotAvailabilities.plans.find(
          ({ code, regions }) =>
            isSnapshotConsumption(code) && regions.find((r) => r.name === instanceId.region),
        ) ?? null;
      const catalogAddon = snapshotPlan
        ? catalog.addons.find(({ planCode }) => planCode === snapshotPlan.code)
        : null;

      return {
        isPending: false,
        pricing:
          catalogAddon?.pricings.find(
            ({ intervalUnit }) => intervalUnit === 'none' || intervalUnit === 'hour',
          ) ?? null,
      };
    },
  });
};

export const usePrefetchSnapshotPricing = (projectId: string) => {
  const { me } = useMe();

  usePrefetchQuery(getCatalogQuery(me?.ovhSubsidiary));
  usePrefetchQuery(
    getProductAvailabilityQuery(projectId, me?.ovhSubsidiary, {
      addonFamily: 'snapshot',
    }),
  );
};
