import { useProjectRegions } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { useProjectSnapshotAddons } from '@/api/hooks/order';

export const useRegionsWithAutomaticBackup = (projectId: string) => {
  const { data: regions } = useProjectRegions(projectId);
  const { addons } = useProjectSnapshotAddons(projectId);

  return useMemo(
    () =>
      !!regions && !!addons
        ? regions
            .filter(
              (region) =>
                region.services.find((s) => s.name === 'workflow') &&
                addons.find((a) =>
                  a.regions.find((r) => r.name === region.name),
                ),
            )
            .map((r) => r.name)
        : [],
    [regions, addons],
  );
};
