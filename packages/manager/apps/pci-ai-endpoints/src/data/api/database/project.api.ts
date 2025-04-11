import { v6 } from '@ovh-ux/manager-core-api';

export const getProject = async (projectId: string) => {
  const { data } = await v6.get(`/cloud/project/${projectId}`);
  return data;
};
