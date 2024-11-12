import { useMemo } from 'react';
import { useProjectRegions } from '@ovh-ux/manager-pci-common';
import { useMigrationSteins } from '@ovh-ux/manager-react-components';
import { getLocalZoneRegions } from '@/utils/utils';

export function useProductMaintenance(projectId: string, regions?: string[]) {
  const { data: customerRegions } = useProjectRegions(projectId);
  const { data: steins } = useMigrationSteins();

  const isProductConcernedByMaintenance = useMemo(() => {
    const regionsMaintenance = steins?.map(({ zone }) => zone) || [];
    const localZones = getLocalZoneRegions(customerRegions).map(
      (region) => region.name,
    );
    const productRegions =
      regions?.filter((region) => !localZones.includes(region)) || [];

    return productRegions.some((region) => regionsMaintenance.includes(region));
  }, [steins, customerRegions, regions]);

  return {
    hasMaintenance: isProductConcernedByMaintenance,
    maintenanceURL: steins?.[0]?.travaux,
  };
}
