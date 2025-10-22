import { ApiError } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  claimVoucher,
  getDefaultProject,
  getProjects,
  removeProject,
  setAsDefaultProject,
  unFavProject,
} from '@/data/api/projects';
import {
  projectsWithServiceQueryKey,
  sortProjectsByDefaultAndDescription,
} from '@/data/api/projects-with-services';
import { TProjectWithService } from '@/data/types/project.type';
import queryClient from '@/queryClient';
import { DISCOVERY_PROJECT_PLANCODE } from '@/constants';

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

export function useSetAsDefaultProject(options: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) {
  return useMutation({
    mutationFn: async (projectId: string) => setAsDefaultProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: getDefaultProjectQueryKey });

      queryClient.setQueryData(
        [projectsWithServiceQueryKey()],
        (oldData: FetchResultV6<TProjectWithService>) => ({
          ...oldData,
          data: oldData.data
            .map((project) => ({
              ...project,
              isDefault: project.project_id === projectId,
            }))
            .sort(sortProjectsByDefaultAndDescription),
        }),
      );

      options.onSuccess();
    },
    onError: options.onError,
  });
}

export function useUnFavProject(options: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) {
  return useMutation({
    mutationFn: async () => unFavProject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getDefaultProjectQueryKey });
      options.onSuccess();
    },
    onError: options.onError,
  });
}

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

/**
 * Claims a voucher code for a project
 * @returns {UseMutationResult<void, ApiError, { projectId: string; voucherCode: string }>}
 */
export const useClaimVoucher = () =>
  useMutation<void, ApiError, { projectId: string; voucherCode: string }>({
    mutationFn: ({ projectId, voucherCode }) =>
      claimVoucher(projectId, voucherCode),
  });

/**
 * Custom hook to get the discovery project if one exists.
 * Discovery projects need to be activated before users can create new projects.
 *
 * @returns {UseQueryResult<TProject | undefined, ApiError>} The query result containing:
 *   - data: The discovery project if found, undefined otherwise
 *   - isPending: boolean indicating if the query is loading
 *   - error: ApiError | null if an error occurred
 */
export const useDiscoveryProject = () =>
  useQuery({
    queryKey: ['/cloud/project'],
    queryFn: () => getProjects(),
    select: ({ data }) => {
      return data.find(
        (project) => project.planCode === DISCOVERY_PROJECT_PLANCODE,
      );
    },
  });
