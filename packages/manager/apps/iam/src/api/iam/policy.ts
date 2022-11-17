import apiClient, {
  ApiClientVersions,
  fetchIceberg,
  IcebergOptions,
} from '@ovh-ux/manager-core-api';

import { IamApiPolicy, IamApiPolicyData } from '../types';

export const listPolicies = ({
  page,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: IcebergOptions) => {
  return fetchIceberg<IamApiPolicy>({
    route: '/iam/policy',
    page,
    pageSize,
    filters,
    sortBy,
    sortReverse,
    apiVersion: ApiClientVersions.v2,
  });
};

export const getPolicy = async (policyId: string): Promise<IamApiPolicy> => {
  const { data } = await apiClient.v2.get(`/iam/policy/${policyId}`);
  return data;
};

export const deletePolicy = async (policyId: string): Promise<void> => {
  await apiClient.v2.delete(`/iam/policy/${policyId}`);
};

export const createPolicy = async ({
  name,
  description,
  resources,
  identities,
  permissions,
}: IamApiPolicyData): Promise<IamApiPolicy> => {
  const { data } = await apiClient.v2.post('/iam/policy', {
    name,
    description,
    resources,
    identities,
    permissions,
  });
  return data;
};

export default {
  createPolicy,
  deletePolicy,
  getPolicy,
  listPolicies,
};
