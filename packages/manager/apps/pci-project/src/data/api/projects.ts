import { TProject } from '@ovh-ux/manager-pci-common';
import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';

export const getProjects = async (): Promise<FetchResultV6<TProject>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/cloud/project`, { headers });
};

/** Add commentMore actions
 * Retrieves the user's default public cloud project preference.
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
