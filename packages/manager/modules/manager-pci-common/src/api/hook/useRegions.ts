import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { addProjectRegion, getProjectRegions } from '../data/regions';
import {
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '../../components/rclone-download/constants';

export const useGetProjectRegionsQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'regions'],
  queryFn: () => getProjectRegions(projectId),
});

export const useGetProjectRegions = (projectId: string) =>
  useQuery({
    ...useGetProjectRegionsQuery(projectId),
  });

export const useStorageRegions = ({
  projectId,
  isS3Storage,
}: {
  projectId: string;
  isS3Storage?: boolean;
}) => {
  const result = useGetProjectRegions(projectId);

  return {
    ...result,
    data: useMemo(
      () =>
        result?.data?.filter(({ services }) =>
          services.find(({ name }) =>
            isS3Storage
              ? S3_REGION_CAPACITY.includes(name)
              : name === REGION_CAPACITY,
          ),
        ),
      [result, isS3Storage],
    ),
  };
};

export const useS3StorageRegions = (projectId: string) =>
  useStorageRegions({ projectId, isS3Storage: true });

export interface AddProjectRegionProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useAddProjectRegion = ({
  projectId,
  onError,
  onSuccess,
}: AddProjectRegionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (region: string) => addProjectRegion(projectId, region),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'regions'],
      });
      onSuccess();
    },
  });
  return {
    addRegion: (region: string) => mutation.mutate(region),
    ...mutation,
  };
};
