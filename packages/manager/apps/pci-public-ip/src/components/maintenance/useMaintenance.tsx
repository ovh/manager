import { useAggregatedPrivateNetworksRegions } from '@/api/hooks/useNetwork';
import { useMigrationSteins } from '@/api/hooks/useCloud';
import { useProjectRegions } from '@/api/hooks/useProject';

export function useProductMaintenance(projectId: string) {
  const { data: customerRegions } = useProjectRegions(projectId);
  const { data: steins } = useMigrationSteins();
  const { data: productRegions } = useAggregatedPrivateNetworksRegions(
    projectId,
    customerRegions,
  );

  const regionsMaintenance = steins?.map(({ zone }) => zone);

  const isProductConcernedByMaintenance = (
    productRegions || []
  ).some((region) => regionsMaintenance.includes(region));

  return {
    hasMaintenance: isProductConcernedByMaintenance,
    maintenanceURL: steins?.[0]?.travaux,
  };
}
