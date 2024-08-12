import { v6 } from '@ovh-ux/manager-core-api';

export type TRegistryStatus =
  | 'ERROR'
  | 'READY'
  | 'DELETED'
  | 'SUSPENDED'
  | 'INSTALLING'
  | 'UPDATING'
  | 'RESTORING'
  | 'SUSPENDING'
  | 'DELETING'
  | 'SCALING_UP';

export type TRegistry = {
  createdAt: string;
  deliveredAt: string;
  id: string;
  name: string;
  notary_url: string;
  region: string;
  size: number;
  status: TRegistryStatus;
  updatedAt: string;
  url: string;
  version: string;
  plan: TRegistryPlan;
};

export type TRegistryPlan = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  registryLimits: {
    imageStorage: number;
    parallelRequest: number;
  };
  features: {
    vulnerability: boolean;
  };
  code: string;
};

export const getAllRegistries = async (
  projectId: string,
): Promise<TRegistry[]> => {
  const { data } = await v6.get(`cloud/project/${projectId}/containerRegistry`);

  return data;
};

export const getRegistryPlan = async (
  projectId: string,
  registryId,
): Promise<TRegistryPlan> => {
  const { data } = await v6.get(
    `cloud/project/${projectId}/containerRegistry/${registryId}/plan`,
  );

  return data;
};
