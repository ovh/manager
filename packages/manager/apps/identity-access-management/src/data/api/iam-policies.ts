import { apiClient } from '@ovh-ux/manager-core-api';

export type IamPolicy = {
  id: string;
  name: string;
  description: string;
  owner: string;
  identities: string[];
  resources: Array<{ urn: string }>;
  permissionsGroups: Array<{ urn: string }>;
  createdAt: string;
};

export const getIamPolicies = async (filter?: {
  identities?: string[];
  resources?: string[];
  actions?: string[];
}): Promise<IamPolicy[]> => {
  const params = {
    identity: filter?.identities || [],
    action: filter?.actions || [],
    resourceURN: filter?.resources || [],
  };
  const { data } = await apiClient.v2.get<IamPolicy[]>('/iam/policy', {
    params,
    paramsSerializer: { indexes: null },
  });
  return data;
};
