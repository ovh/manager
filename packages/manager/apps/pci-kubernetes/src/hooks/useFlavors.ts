import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  TFlavor,
  TQuota,
  getFlavors,
  useCatalog,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';

import { getKubeFlavors } from '@/api/data/flavors';
import { DeploymentMode } from '@/types';

import { useProjectQuotaByRegion } from './useProjectQuota';

export const FLAVOR_CATEGORIES = [
  {
    category: 'balanced',
    title: 'General Purpose',
    pattern: /eg/,
  },
  {
    category: 'cpu',
    title: 'Compute Optimized',
    pattern: /cpu|hg/,
  },
  {
    category: 'ram',
    title: 'Memory Optimized',
    pattern: /ram/,
  },
  {
    category: 'accelerated',
    title: 'GPU',
    pattern: /gpu|nvme/,
  },
  {
    category: 'discovery',
    title: 'Discovery',
    pattern: /d2/,
  },
  {
    category: 'iops',
    title: 'Storage Optimized',
    pattern: /ovh\.iops/,
  },
  {
    category: 'baremetal',
    title: 'Metal',
    pattern: /baremetal/,
    isNew: true,
  },
];

export const KUBE_FLAVOR_CATEGORIES = FLAVOR_CATEGORIES.filter(
  ({ category }) => category !== 'baremetal',
);

export const getFlavorsQueryKey = (projectId: string, region: string) => [
  'flavors',
  projectId,
  region,
];

export const useFlavors = (projectId: string, region: string) =>
  useQuery({
    queryKey: getFlavorsQueryKey(projectId, region),
    queryFn: () => getFlavors(projectId, region),
    enabled: !!projectId && !!region,
  });

export const getKubeFlavorsQueryKey = (projectId: string, region: string) => [
  'kube-flavors',
  projectId,
  region,
];

export const useKubeFlavors = (projectId: string, region: string) =>
  useQuery({
    queryKey: getKubeFlavorsQueryKey(projectId, region),
    queryFn: () => getKubeFlavors(projectId, region),
    enabled: !!projectId && !!region,
  });

export const hasEnoughQuota = (flavor: TFlavor, quota: TQuota) => {
  if (!quota?.instance) return true;
  const { instance } = quota;
  if (instance.usedInstances + 1 > (instance.maxInstances || 0)) return false;
  if (instance.usedRAM + flavor.ram > (instance.maxRam || 0)) return false;
  if (instance.usedCores + flavor.vcpus > (instance.maxCores || 0)) return false;
  return true;
};

export const useMergedKubeFlavors = (projectId: string, region: string | null) => {
  const { data: flavors, isPending: isFlavorsPending } = useFlavors(projectId, region);
  const { data: kubeFlavors, isPending: isKubeFlavorsPending } = useKubeFlavors(projectId, region);
  const { data: catalog, isPending: isCatalogPending } = useCatalog();
  const { data: availability, isPending: isAvailabilityPending } =
    useProductAvailability(projectId);

  const { data: quota, isPending: isQuotaPending } = useProjectQuotaByRegion(projectId, region);

  const isPending =
    isFlavorsPending ||
    isKubeFlavorsPending ||
    isCatalogPending ||
    isAvailabilityPending ||
    isQuotaPending;

  const mergedFlavors = useMemo(() => {
    if (!flavors || !kubeFlavors || !catalog || !availability || !quota) return [];
    const kubeFlavorNames = new Set(kubeFlavors.map(({ name }) => name.replace('-flex', '')));
    const result = [...kubeFlavorNames].map((name) => ({
      ...flavors.find((_flavor) => _flavor.name === name),
      ...kubeFlavors.find((_flavor) => _flavor.name === name),
    }));
    return result
      .map((flavor) => {
        const addon = catalog.addons.find((_addon) => _addon.planCode === flavor.planCodes.hourly);
        const addonMonthly = catalog.addons.find(
          (_addon) => _addon.planCode === flavor.planCodes.monthly,
        );
        const plan = availability.plans?.find((_plan) => _plan.code === flavor.planCodes.hourly);

        // Bugfix: Issue with selecting the correct monthly price in the US
        // -----------------------------------------------------------
        // Context: Normally, we take the first element of the `pricings` array
        // to determine the monthly price. However, for US offers, this first
        // value may not be correct. Instead, we need to specifically look
        // for the entry containing 'renew' in `capacities`.
        //
        // Solution:
        // - We first search the `pricings` array for an entry where `capacities`
        //   includes 'renew' and return it if found.
        // - If no such entry exists, we fallback to the first element of `pricings` (if available).
        const priceMonthly =
          addonMonthly &&
          (addonMonthly.pricings.find((p) => p.capacities.includes('renew')) ||
            addonMonthly.pricings[0]);

        return {
          ...flavor,
          blobs: addon?.blobs,
          compatibility: Object.values(DeploymentMode).reduce(
            (acc, value) => ({
              ...acc,
              [value]: plan?.regions?.some((_region) => _region.type === value),
            }),
            {},
          ) as Record<DeploymentMode, boolean>,

          pricingsHourly: addon?.pricings?.[0],
          pricingsMonthly: priceMonthly,
          isNew: addon?.blobs.tags.includes('is_new'),
          flavorCategory: FLAVOR_CATEGORIES.find((cat) => cat.pattern.test(flavor.type))?.category,
          isFlex: /flex$/.test(flavor.name),
          isLegacy: /eg|sp|hg|vps-ssd/.test(flavor.name),
          hasEnoughQuota: hasEnoughQuota(flavor, quota),
        };
      })
      .sort((a, b) => {
        const aGroup = Number((a.name.match(/[0-9]+/) || [])[0]);
        const bGroup = Number((b.name.match(/[0-9]+/) || [])[0]);
        const aRank = Number((a.name.match(/-([^-]+)$/) || [])[1]);
        const bRank = Number((b.name.match(/-([^-]+)$/) || [])[1]);
        if (aGroup === bGroup) return aRank - bRank;
        return bGroup - aGroup;
      });
  }, [availability, catalog, flavors, kubeFlavors, quota]);
  return {
    mergedFlavors,
    isPending,
  };
};
