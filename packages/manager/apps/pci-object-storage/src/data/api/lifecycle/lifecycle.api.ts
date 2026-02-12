import { apiClient } from '../api.client';
import storages from '@/types/Storages';

export interface UpdateLifecycleParams {
  projectId: string;
  region: string;
  name: string;
  lifecycleRules: storages.LifecycleRule[];
}

export const updateLifecycle = async ({
  projectId,
  region,
  name,
  lifecycleRules,
}: UpdateLifecycleParams) => {
  return apiClient.v6.put(
    `/cloud/project/${projectId}/region/${region}/storage/${name}/lifecycle`,
    {
      rules: lifecycleRules,
    },
  );
};
