import { apiClient } from '@ovh-ux/manager-core-api';
import { IAMResource } from './iam.type';

export const getIamResourceQueryKey = (resourceURNList: string[]) => [
  `get/iam/resource/${resourceURNList.join(',')}`,
];

/**
 * Get the vRack Services
 */
export const getIamResource = async (resourceURNList: string[]) => {
  const params = new URLSearchParams();
  resourceURNList.forEach((urn) => params.append('resourceURN', urn));

  return apiClient.v2.get<IAMResource[]>(
    `/iam/resource${params.size > 0 ? '?' : ''}${params.toString()}`,
  );
};
