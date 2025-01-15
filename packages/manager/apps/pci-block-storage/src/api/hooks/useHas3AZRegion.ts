import { useVolumeCatalog } from '@/api/hooks/useCatalog';

export const useHas3AZRegion = (projectId: string) => {
  const { data: volumeCatalog, isPending } = useVolumeCatalog(projectId);

  return {
    has3AZ:
      volumeCatalog?.models.some((m) =>
        m.filters.deployment.includes('region-3-az'),
      ) || false,
    isPending,
  };
};
