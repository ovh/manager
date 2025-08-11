import { useMemo } from 'react';

import { usePrefetchQuery, useQueries } from '@tanstack/react-query';

import {
  TProductAvailabilityRegion,
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';

import { useIsDistantBackupAvailable } from '@/api/hooks/feature';
import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useRegionTranslation } from '@/api/hooks/region';
import { useMe } from '@/api/hooks/user';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

export type ContinentRegion = Pick<TProductAvailabilityRegion, 'enabled' | 'name' | 'type'> & {
  label: string;
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

  const snapshotPlan = useMemo(
    () =>
      snapshotAvailabilities?.plans.find(
        ({ code, regions }) =>
          isSnapshotConsumption(code) && regions.find((r) => r.name === instanceId.region),
      ),
    [snapshotAvailabilities, instanceId.region],
  );

  const catalogAddon = useMemo(
    () => catalog?.addons.find(({ planCode }) => planCode === snapshotPlan.code),
    [catalog, snapshotPlan],
  );

  const currentRegion = useMemo(
    () => snapshotPlan?.regions.find((r) => r.name === instanceId.region),
    [snapshotPlan, instanceId],
  );

  return {
    isPending: !snapshotAvailabilities || !catalog,
    pricing: useMemo(
      () =>
        catalogAddon?.pricings.find(
          ({ intervalUnit }) => intervalUnit === 'none' || intervalUnit === 'hour',
        ) ?? null,
      [catalogAddon],
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

      return Map.groupBy(
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
          })),
        (r) => translateContinent(r.name),
      );
    }, [
      snapshotAvailabilities,
      currentRegion,
      instanceId,
      translateMicroRegion,
      translateContinent,
      isDistantBackupAvailable,
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
