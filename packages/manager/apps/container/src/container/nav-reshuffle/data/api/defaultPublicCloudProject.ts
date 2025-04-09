import { v6 } from '@ovh-ux/manager-core-api';
import {
  DefaultPublicCloudProjectPreference,
  Preference,
} from '@/types/preferences';

export const getDefaultPublicCloudProjectId = async () => {
  try {
    const { data } = await v6.get<Preference>(
      '/me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    );
    const defaultProject: DefaultPublicCloudProjectPreference = data?.value
      ? JSON.parse(data.value)
      : null;
    return defaultProject.projectId;
  } catch (e) {
    return null;
  }
};
