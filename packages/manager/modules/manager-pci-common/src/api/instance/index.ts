import { v6 } from '@ovh-ux/manager-core-api';
import { TInstance } from './instance.type';

export * from './instance.type';

export const getInstance = async (
  projectId: string,
  instanceId: string,
): Promise<TInstance> => {
  const { data } = await v6.get<TInstance>(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return data;
};

export const getInstances = async (
  projectId: string,
  region?: string,
): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(
    `/cloud/project/${projectId}/instance`,
    {
      params: {
        region,
      },
    },
  );
  return data;
};
