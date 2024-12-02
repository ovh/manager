import { useQuery } from '@tanstack/react-query';
import {
  getProjectRegions,
  getS3StorageRegions,
  getStorageRegions,
} from '../data/regions';

export const useGetProjectRegionsQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'regions'],
  queryFn: () => getProjectRegions(projectId),
});

export const useGetProjectRegions = (projectId: string) =>
  useQuery({
    ...useGetProjectRegionsQuery(projectId),
  });

export const useS3StorageRegions = (projectId: string) => {
  const { data: regions } = useGetProjectRegions(projectId);

  return useQuery({
    queryKey: ['project', projectId, 's3-storages-regions'],
    queryFn: () => getS3StorageRegions(regions || []),
    retry: false,
    enabled: !!regions,
  });
};

export const useStorageRegions = (projectId: string) => {
  const { data: regions } = useGetProjectRegions(projectId);

  return useQuery({
    queryKey: ['project', projectId, 'storages-regions'],
    queryFn: () => getStorageRegions(regions || []),
    retry: false,
    enabled: !!regions,
  });
};
