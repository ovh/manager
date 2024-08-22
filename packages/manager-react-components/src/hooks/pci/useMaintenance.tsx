import { useAggregatedPrivateNetworksRegions } from './useAggregatedPrivateNetworks';
import { useMigrationSteins } from './useMigrationSteins';
import { useProjectRegions } from './useProjectRegions';

export function useProductMaintenance(projectId: string) {
  const { data: customerRegions } = useProjectRegions(projectId);
  const { data: steins } = useMigrationSteins();
  const { data: productRegions } = useAggregatedPrivateNetworksRegions(
    projectId,
    customerRegions,
  );

  const regionsMaintenance = steins?.map(({ zone }) => zone) || [];

  const isProductConcernedByMaintenance = (
    productRegions || []
  ).some((region) => regionsMaintenance.includes(region));

  return {
    hasMaintenance: isProductConcernedByMaintenance,
    maintenanceURL: steins?.[0]?.travaux,
  };
}
