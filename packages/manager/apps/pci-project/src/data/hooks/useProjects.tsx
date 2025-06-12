import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  removeProject,
  getDefaultProject,
  unFavProject,
} from '@/data/api/projects';
import queryClient from '@/queryClient';

type DeleteProjectParams = {
  projectId: string;
  serviceId: string;
  isUs: boolean;
};

export const getDefaultProjectQueryKey = [
  'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
];

/**
 * Query options for fetching the user's default public cloud project preference.
 * @returns The options object for useQuery.
 */
export const getDefaultProjectOptions = queryOptions({
  queryKey: getDefaultProjectQueryKey,
  queryFn: getDefaultProject,
});

export function useRemoveProjectMutation(options: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
  isDefault: boolean;
}) {
  return useMutation({
    mutationFn: async (params: DeleteProjectParams) => {
      if (options.isDefault) {
        await Promise.all([unFavProject(), removeProject(params)]);
      } else {
        await removeProject(params);
      }
    },
    onSuccess: () => {
      if (options.isDefault) {
        // Invalidate the default project query cache when unFavProject is called
        queryClient.invalidateQueries({ queryKey: getDefaultProjectQueryKey });
      }
      options.onSuccess();
    },
    onError: options.onError,
  });
}

/**
 * React Query hook to fetch the user's default public cloud project preference.
 *
 * @returns {UseQueryResult<{projectId: string}, ApiError>} The query object containing data, error, status, etc.
 */
export const useDefaultProjectQuery = () => useQuery(getDefaultProjectOptions);

/**
 * Custom hook to determine if a given projectId matches the user's default public cloud project.
 *
 * @param {string} [projectId] - The project ID to check against the user's default project.
 * @returns {UseQueryResult<boolean, ApiError>} The query result containing:
 *   - data: boolean indicating if the project is default
 *   - isLoading: boolean indicating if the query is loading
 *   - error: ApiError | null if an error occurred
 */
export const useIsDefaultProject = (projectId?: string) =>
  useQuery({
    ...getDefaultProjectOptions,
    select: (data) => !!projectId && !!data && data.projectId === projectId,
  });
