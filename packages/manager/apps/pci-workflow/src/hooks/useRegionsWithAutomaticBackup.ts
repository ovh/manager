import { useMemo } from 'react';

import { useProjectRegions } from '@ovh-ux/manager-pci-common';

import { useProjectSnapshotAddons } from '@/api/hooks/order';

export const useRegionsWithAutomaticBackup = (projectId: string) => {
  const { data: regions } = useProjectRegions(projectId);
  const { addons } = useProjectSnapshotAddons(projectId);

  return useMemo(() => {
    if (!regions || !addons) return [];

    const addonsRegions = addons.flatMap((addon) => addon.regions.map((r) => r.name));

    return regions
      .filter(
        (region) =>
          region.services.find((s) => s.name === 'workflow') && addonsRegions.includes(region.name),
      )
      .map((r) => r.name);
  }, [regions, addons]);
};
