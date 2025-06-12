import { v6 } from '@ovh-ux/manager-core-api';

/**
 * Deletes a project based on the region.
 *
 * @param {Object} params - The parameters for deleting the project.
 * @param {string} params.projectId - The ID of the project to delete.
 * @param {string} params.serviceId - The service ID (required for US region).
 * @param {boolean} params.isUs - Indicates if the project is in the US region.
 * @returns {Promise<unknown>} The API response data.
 */
export const deleteProject = (params: {
  projectId: string;
  serviceId?: string;
  isUs?: boolean;
}): Promise<unknown> => {
  const { projectId, serviceId, isUs = false } = params;

  if (isUs) {
    return v6.delete(`/services/${serviceId}`);
  }
  return v6.post(`cloud/project/${projectId}/terminate`);
};

/**
 * This function deletes the user's preference for the default public cloud project
 *
 * @returns {Promise<unknown>} The API response data.
 */
export const unFavProject = async (): Promise<unknown> => {
  const response = await v6.delete(
    'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
  );

  return response.data;
};

/**
 * Retrieves the user's default public cloud project preference.
 *
 * @returns {Promise<{ projectId: string } | null>} The default project object or null if not set.
 */
export const getDefaultProject = async (): Promise<{
  projectId: string;
} | null> => {
  try {
    const { data } = await v6.get(
      'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    );

    const { projectId } = JSON.parse(data.value);
    return { projectId };
  } catch (e) {
    return null;
  }
};
