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
  search?: string;
};

export type TRegistryPlan = {
  id: string;
  name: 'SMALL' | 'MEDIUM' | 'LARGE';
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
  registryId: string,
): Promise<TRegistryPlan> => {
  const { data } = await v6.get(
    `cloud/project/${projectId}/containerRegistry/${registryId}/plan`,
  );

  return data;
};

export const getRegistryAvailablePlans = async (
  projectId: string,
  registryId: string,
): Promise<TRegistryPlan[]> => {
  const { data } = await v6.get(
    `cloud/project/${projectId}/containerRegistry/${registryId}/capabilities/plan`,
  );

  return data;
};

export const deleteRegistry = async (projectId: string, registryId: string) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/containerRegistry/${registryId}`,
  );

  return data;
};

export type TRegistryCredentials = {
  email: string;
  id: string;
  password: string;
  user: string;
};

export const postRegistryCredentials = async (
  projectId: string,
  registryId: string,
): Promise<TRegistryCredentials> => {
  const { data } = await v6.post(
    `cloud/project/${projectId}/containerRegistry/${registryId}/users`,
  );

  return data;
};

export const renameRegistry = async (
  projectId: string,
  registryId: string,
  name: string,
) => {
  const {
    data,
  } = await v6.put(
    `/cloud/project/${projectId}/containerRegistry/${registryId}`,
    { name },
  );
  return data;
};

export const createRegistry = async (
  projectId: string,
  payload: {
    name: string;
    planID: string;
    region: string;
  },
): Promise<Omit<TRegistry, 'plan'>> => {
  const { data } = await v6.post<Omit<TRegistry, 'plan'>>(
    `/cloud/project/${projectId}/containerRegistry`,
    payload,
  );
  return data;
};

export const updatePlan = async (
  projectId: string,
  registryId: string,
  planId: string,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/containerRegistry/${registryId}/plan`,
    {
      planID: planId,
    },
  );
  return data;
};
