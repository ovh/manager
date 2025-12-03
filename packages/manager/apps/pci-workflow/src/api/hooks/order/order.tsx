import { useCallback, useMemo } from 'react';

import { usePrefetchQuery, useQueries } from '@tanstack/react-query';

import {
  TProductAvailabilityRegion,
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';

import { useIsDistantBackupAvailable } from '@/api/hooks/feature';
import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { getRegionPricing } from '@/api/hooks/order/selector/order.selector';
import { useRegionTranslation } from '@/api/hooks/region';
import { useMe } from '@/api/hooks/user';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';
import { groupBy } from '@/utils';

export type ContinentRegion = Pick<TProductAvailabilityRegion, 'enabled' | 'name' | 'type'> & {
  label: string;
  price: number | null;
};

export const useInstanceSnapshotPricing = (projectId: string, instanceId: TInstance['id']) => {
  const { me } = useMe();
  const { translateMicroRegion, translateContinent } = useRegionTranslation();
  const isDistantBackupAvailable = useIsDistantBackupAvailable();

  const [{ data: catalog }, { data: snapshotAvailabilities }] = useQueries({
    queries: [
      getCatalogQuery(me.ovhSubsidiary),
      getProductAvailabilityQuery(projectId, me.ovhSubsidiary, {
        addonFamily: 'snapshot',
      }),
    ],
  });

  const currentRegion = useMemo(() => {
    const currentPlan = snapshotAvailabilities?.plans.find(
      ({ code, regions }) =>
        isSnapshotConsumption(code) && regions.find((r) => r.name === instanceId.region),
    );

    return currentPlan?.regions.find((r) => r.name === instanceId.region);
  }, [snapshotAvailabilities, instanceId]);

  const regionPriceCalculator = useCallback(
    (region: string) => getRegionPricing(snapshotAvailabilities, catalog)(region),
    [snapshotAvailabilities, catalog],
  );

  return {
    isPending: !snapshotAvailabilities || !catalog,
    pricing: useMemo(
      () => regionPriceCalculator(instanceId.region),
      [instanceId, regionPriceCalculator],
    ),
    distantContinents: useMemo(() => {
      if (
        !snapshotAvailabilities ||
        !currentRegion ||
        // Only 1AZ and 3AZ can have distant backups for now
        (currentRegion.type !== 'region' && currentRegion.type !== 'region-3-az') ||
        !isDistantBackupAvailable
      )
        return new Map<string, ContinentRegion[]>();

      return groupBy(
        snapshotAvailabilities.plans
          .filter(({ code }) => isSnapshotConsumption(code))
          .flatMap((p) => p.regions)
          .filter(
            (r) =>
              r.name !== instanceId.region &&
              // Distant backups can be created only in distant 1AZ and 3AZ for now
              (r.type === 'region' || r.type === 'region-3-az'),
          )
          .map((r) => ({
            ...r,
            label: translateMicroRegion(r.name) || r.name,
            price: regionPriceCalculator(r.name)?.price,
          })),
        (r) => translateContinent(r.name) || 'Internal',
      );
    }, [
      snapshotAvailabilities,
      currentRegion,
      instanceId,
      translateMicroRegion,
      translateContinent,
      isDistantBackupAvailable,
      regionPriceCalculator,
    ]),
  };
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
