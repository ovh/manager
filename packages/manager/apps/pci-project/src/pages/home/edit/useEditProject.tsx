import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { getProjectQueryKey } from '@ovh-ux/manager-pci-common';
import {
  editProject,
  setAsDefaultProject,
  unFavProject,
} from '@/data/api/projects';
import queryClient from '@/queryClient';
import { getDefaultProjectQueryKey } from '@/data/hooks/useProjects';

export type EditProjectParams = {
  description: string;
  isDefault: boolean;
  isDescriptionChanged: boolean;
  isDefaultPropertyChanged: boolean;
};

/**
 * Custom hook to handle editing a project's description and default status in a single mutation.
 *
 * This hook perform the following actions:
 *   - Update the project description if changed
 *   - Set or unset the project as default if changed
 *
 * @param {string} projectId
 * @param {() => void} onSuccess
 * @param {(error: ApiError) => void} onError
 *
 * @returns {UseMutationResult<void, ApiError, EditProjectParams>}
 *
 */
export const useEditProject = (
  projectId: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) =>
  useMutation({
    mutationFn: async ({
      description,
      isDefault,
      isDescriptionChanged,
      isDefaultPropertyChanged,
    }: EditProjectParams) => {
      if (isDescriptionChanged) {
        await editProject({ projectId, payload: { description } });
      }
      if (isDefaultPropertyChanged) {
        if (isDefault) {
          await setAsDefaultProject(projectId);
        } else {
          await unFavProject();
        }
      }
    },
    onSuccess: (_, variables) => {
      if (variables?.isDefaultPropertyChanged) {
        queryClient.invalidateQueries({ queryKey: getDefaultProjectQueryKey });
      }
      if (variables?.isDescriptionChanged) {
        queryClient.invalidateQueries({
          queryKey: getProjectQueryKey(projectId),
        });
      }
      onSuccess();
    },
    onError,
  });
