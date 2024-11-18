import { v6 } from '@ovh-ux/manager-core-api';

export const unleash = async (projectId: string) => {
  return v6.post(`/cloud/project/${projectId}/unleash`);
};

export const toggleManualQuota = async (
  projectId: string,
  isActive: boolean,
) => {
  await v6.put(`/cloud/project/${projectId}`, { manualQuota: isActive });
};
