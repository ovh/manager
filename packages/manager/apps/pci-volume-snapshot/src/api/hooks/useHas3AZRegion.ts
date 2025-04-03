import { useVolumeCatalog } from '@/api/hooks/useCatalog';

export const useHas3AZRegion = (projectId: string) => {
  const { data: volumeCatalog, isPending } = useVolumeCatalog(projectId);

  return {
    has3AZ:
      volumeCatalog?.filters.deployment.some((d) => d.name === 'region-3-az') ||
      false,
    isPending,
  };
};
