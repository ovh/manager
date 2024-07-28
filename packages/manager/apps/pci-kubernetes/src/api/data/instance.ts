import { v6 } from '@ovh-ux/manager-core-api';

type TRawInstance = {
  id: string;
  monthlyBilling?: { status: string };
};

export type TInstance = TRawInstance;

export const getInstances = async (projectId: string): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(
    `/cloud/project/${projectId}/instance`,
  );

  return data as TInstance[];
};
