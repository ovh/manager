import { useEffect, useState } from 'react';
import { TRegion } from '@/api/data/regions';
import { useCatalog } from '@/api/hooks/useCatalog';
import { useProjectsAvailableVolumes } from '@//api/hooks/useProjectsAvailableVolumes';
import { TCatalog } from '@/api/data/catalog';

export const useConsumptionVolumesAddon = (
  projectId: string,
  region: TRegion,
) => {
  const [state, setState] = useState<TCatalog['addons']>(undefined);

  const { data: catalog, isPending: isCatalogPending } = useCatalog();
  const {
    data: availableVolumes,
    isPending: isVolumesPending,
  } = useProjectsAvailableVolumes(projectId);
  const isPending = isCatalogPending || isVolumesPending;

  useEffect(() => {
    if (catalog && availableVolumes && region) {
      // Get volumes addons ids
      const volumeAddonsIds = catalog.plans
        .find((plan) => plan.planCode === 'project')
        .addonFamilies.find(({ name }) => name === 'volume').addons;

      // Get volumes addons details
      const totalConsumptionVolumeAddons = catalog.addons.filter(
        (addon) =>
          volumeAddonsIds.includes(addon.planCode) &&
          addon.planCode.includes('consumption'),
      );

      const volumeAddonsIdss = availableVolumes.plans?.filter(({ regions }) =>
        regions.some(({ name }) => name === region.name),
      );

      setState(
        totalConsumptionVolumeAddons.filter(({ planCode }) =>
          volumeAddonsIdss?.some(({ code }) => code === planCode),
        ),
      );
    }
  }, [catalog, region, availableVolumes]);

  return { volumeTypes: state, isPending };
};
