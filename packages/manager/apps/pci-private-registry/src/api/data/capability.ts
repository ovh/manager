import { v6 } from '@ovh-ux/manager-core-api';

export type TCapability = {
  regionName: string;
  plans: [
    {
      id: string;
      code: string;
      features: {
        vulnerability: boolean;
      };
      name: 'SMALL' | 'MEDIUM' | 'LARGE';
      registryLimits: {
        imageStorage: number;
        parallelRequest: number;
      };
    },
  ];
};

export const getCapabilities = async (
  projectId: string,
): Promise<TCapability[]> => {
  const { data } = await v6.get<TCapability[]>(
    `cloud/project/${projectId}/capabilities/containerRegistry`,
  );

  return data;
};
