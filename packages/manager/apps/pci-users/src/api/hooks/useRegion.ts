import { useQuery } from '@tanstack/react-query';
import {
  getAllRegions,
  getS3StorageRegions,
  getStorageRegions,
} from '@/api/data/region';

export const useAllRegions = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getAllRegions(projectId),
    retry: false,
  });
};

export const useS3StorageRegions = (projectId: string) => {
  const { data: regions } = useAllRegions(projectId);
  return useQuery({
    queryKey: ['project', projectId, 's3-storages-regions'],
    queryFn: () => getS3StorageRegions(regions || []),
    retry: false,
    enabled: !!regions,
  });
};

export const useStorageRegions = (projectId: string) => {
  const { data: regions } = useAllRegions(projectId);
  return useQuery({
    queryKey: ['project', projectId, 'storages-regions'],
    queryFn: () => getStorageRegions(regions || []),
    retry: false,
    enabled: !!regions,
  });
};
