import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFlavors, getKubeFlavors } from '../data';
import { useCatalog } from './useCatalog';
import { useProductAvailability } from './useAvailability';

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
    enabled: !!projectId,
  });

export const useMergedKubeFlavors = (projectId: string, region: string) => {
  const { data: flavors, isPending: isFlavorsPending } = useFlavors(
    projectId,
    region,
  );
  const { data: kubeFlavors, isPending: isKubeFlavorsPending } = useKubeFlavors(
    projectId,
    region,
  );
  const { data: catalog, isPending: isCatalogPending } = useCatalog();
  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useProductAvailability(projectId);

  const isPending =
    isFlavorsPending ||
    isKubeFlavorsPending ||
    isCatalogPending ||
    isAvailabilityPending;

  const mergedFlavors = useMemo(() => {
    if (!flavors || !kubeFlavors || !catalog || !availability) return [];
    const kubeFlavorNames = new Set(
      kubeFlavors.map(({ name }) => name.replace('-flex', '')),
    );
    const result = [...kubeFlavorNames].map((name) => ({
      ...flavors.find((_flavor) => _flavor.name === name),
      ...kubeFlavors.find((_flavor) => _flavor.name === name),
    }));
    return result
      .map((flavor) => {
        const addon = catalog.addons.find(
          (_addon) => _addon.planCode === flavor.planCodes.hourly,
        );
        const addonMonthly = catalog.addons.find(
          (_addon) => _addon.planCode === flavor.planCodes.monthly,
        );
        const plan = availability.plans?.find(
          (_plan) => _plan.code === flavor.planCodes.hourly,
        );
        return {
          ...flavor,
          blobs: addon?.blobs,
          compatibility: {
            localzone: plan?.regions?.some(
              (_region) => _region.type === 'localzone',
            ),
            globalzone: plan?.regions?.some(
              (_region) => _region.type === 'region',
            ),
          },
          pricingsHourly: addon?.pricings?.[0],
          pricingsMonthly: addonMonthly?.pricings?.[0],
          isNew: addon?.blobs.tags.includes('is_new'),
          flavorCategory: FLAVOR_CATEGORIES.find((cat) =>
            cat.pattern.test(flavor.type),
          )?.category,
          isFlex: /flex$/.test(flavor.name),
          isLegacy: /eg|sp|hg|vps-ssd/.test(flavor.name),
        };
      })
      .sort((a, b) => {
        const aGroup = a.name.replace(/-[^-]+/, '');
        const bGroup = b.name.replace(/-[^-]+/, '');
        if (aGroup === bGroup) return a.ram - b.ram;
        return bGroup.localeCompare(aGroup);
      });
  }, [availability, catalog, flavors, kubeFlavors]);
  return {
    mergedFlavors,
    isPending,
  };
};
