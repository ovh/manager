import { v6 } from '@ovh-ux/manager-core-api';

export type TInstance = {
  id: string;
  name: string;
};

export const getInstance = async (projectId: string, instanceId: string) => {
  const { data } = await v6.get<TInstance>(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return data;
};
