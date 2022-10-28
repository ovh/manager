import apiClient, {
  ApiClientVersions,
  fetchIceberg,
  IcebergOptions,
} from '@ovh-ux/manager-core-api';

import { IamApiResourceGroup, IamApiResourceGroupData } from '../types';

export const listResourceGroup = ({
  page,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: IcebergOptions) => {
  return fetchIceberg<IamApiResourceGroup>({
    route: '/iam/resourceGroup',
    page,
    pageSize,
    filters,
    sortBy,
    sortReverse,
    apiVersion: ApiClientVersions.v2,
  });
};

export const getResourceGroup = async (
  resourceGroupId: string,
): Promise<IamApiResourceGroup> => {
  const { data } = await apiClient.v2.get(
    `/iam/resourceGroup/${resourceGroupId}`,
  );
  return data;
};

export const deleteResourceGroup = async (
  resourceGroupId: string,
): Promise<void> => {
  await apiClient.v2.delete(`/iam/resourceGroup/${resourceGroupId}`);
};

export const createResourceGroup = async ({
  name,
  resources,
}: IamApiResourceGroupData): Promise<IamApiResourceGroup> => {
  const { data } = await apiClient.v2.post('/iam/resourceGroup', {
    name,
    resources,
  });
  return data;
};

export const editResourceGroup = async (
  resourceGroupId: string,
  { name, resources }: IamApiResourceGroupData,
): Promise<IamApiResourceGroup> => {
  const { data } = await apiClient.v2.put(
    `/iam/resourceGroup/${resourceGroupId}`,
    {
      name,
      resources,
    },
  );
  return data;
};

export default {
  createResourceGroup,
  deleteResourceGroup,
  editResourceGroup,
  getResourceGroup,
  listResourceGroup,
};
