/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */
import { useAggregatedPrivateNetworksRegions } from './useAggregatedPrivateNetworks';
import { useMigrationSteins } from './useMigrationSteins';
import { useProjectRegions } from './useProjectRegions';

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export function useProductMaintenance(projectId: string) {
  const { data: customerRegions } = useProjectRegions(projectId);
  const { data: steins } = useMigrationSteins();
  const { data: productRegions } = useAggregatedPrivateNetworksRegions(
    projectId,
    customerRegions,
  );

  const regionsMaintenance = steins?.map(({ zone }) => zone) || [];

  const isProductConcernedByMaintenance = (productRegions || []).some(
    (region) => regionsMaintenance.includes(region),
  );

  return {
    hasMaintenance: isProductConcernedByMaintenance,
    maintenanceURL: steins?.[0]?.travaux,
  };
}
